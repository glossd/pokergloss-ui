package main

import (
	"io"
	"log"
	"net/http"
)

type proxy struct {
}

func (p *proxy) ServeHTTP(wr http.ResponseWriter, req *http.Request) {
	if req.Method == "OPTIONS" {
		addCors(wr.Header())
		wr.WriteHeader(204)
		return
	}
	client := &http.Client{
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			return http.ErrUseLastResponse
		},
	}

	//http: Request.RequestURI can't be set in client requests.
	//http://golang.org/src/pkg/net/http/client.go
	req.URL.Scheme = "http"
	req.URL.Host = "localhost:8080"

	req.RequestURI = ""

	resp, err := client.Do(req)
	if err != nil {
		http.Error(wr, "Server Error", http.StatusInternalServerError)
		log.Println("ERROR ServeHTTP:", err)
		return
	}
	defer resp.Body.Close()

	log.Printf("%s %s%s", resp.Status, req.URL.Host, req.URL.Path)

	copyHeader(wr.Header(), resp.Header)
	addCors(wr.Header())
	wr.WriteHeader(resp.StatusCode)
	io.Copy(wr, resp.Body)
}

func main() {
	addr := ":9999"
	log.Printf("Starting proxy server on: %s\n", addr)
	if err := http.ListenAndServe(addr, &proxy{}); err != nil {
		log.Fatal("ListenAndServe:", err)
	}
}

func addCors(h http.Header) {
	h.Set("Access-Control-Allow-Origin", "http://localhost:3000")
	h.Set("Access-Control-Allow-Credentials", "true")
	h.Set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS")
	h.Set("Access-Control-Allow-Headers", "DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,"+
		"If-Modified-Since,Cache-Control,Content-Type,Authorization")
}

func copyHeader(dst, src http.Header) {
	for k, vv := range src {
		for _, v := range vv {
			dst.Add(k, v)
		}
	}
}
