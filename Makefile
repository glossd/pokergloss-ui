
PWD_PATH = $(CURDIR)

install_node18:
	docker run -it --rm --name pokergloss-ui-dev-container -p 3000:3000 -v "$(PWD_PATH)":/app -w /app node:18-alpine npm config set legacy-peer-deps true && npm install

run_node18:
	docker run -it --rm --name pokergloss-ui-dev-container -p 3000:3000 -v "$(PWD_PATH)":/app -w /app node:18-alpine npm run startDev

open_chrome_mac:
	open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security