import {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";

// https://usehooks.com/useOnScreen/
export function useOnScreen(ref, rootMargin = "0px") {
  // State and setter for storing whether element is visible
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {

        // That will ensure it will fire only once, and never again.
        if (entry.isIntersecting) {
          setIntersecting(entry.isIntersecting);
          observer.unobserve(ref.current);
        }
      }, { rootMargin }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.unobserve(ref.current);
    };
  }, []);

  return isIntersecting;
}

export const desktopInfoStyles = makeStyles(() => ({
  root: {
    height: "50vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  button: {
    minWidth: 400,
    fontSize: "1.2em",
  },
  message: {
    width: "90%",
    color: "#ffffff",
    fontSize: "2em",
    textAlign: "center",
  },
  arrow: {
    margin: "0 2em",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-evenly",
  },
}));

export const mobileInfoStyles = makeStyles(() => ({
  root: {
    height: "50vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  button: {
    minWidth: 260,
    fontSize: "1.1em",
  },
  message: {
    width: "95%",
    color: "#ffffff",
    fontSize: "1.5em",
    textAlign: "center",
  },
  arrow: {
    margin: "0 1em",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));