#!/usr/bin/env bash

# install node
if [ -x "command -v node" ]; then
	echo "0. Node.js is not installed. Installing..."

	sudo apt-get update
	sudo apt-get install build-essential libssl-dev

	curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh -o install_nvm.sh
	./install_nvm.sh

	# install latest node version

	echo "Finished! :("

	rm ./install_nvm.sh
fi

# download seeder
echo "1. Downloading seeder..."

cd /home/pi
git clone https://github.com/new-computers/seeder
cd seeder

echo "Finished! :|"

# install dependencies
echo "2. Installing dependencies..."

sudo npm i -g add-to-systemd lil-pids
npm install

echo "Finished! :)"

# build
echo "3. Building..."

npm run build

echo "Finished! :>"

# add to systemd
echo "4. Setting up your Pi..."
sudo add-to-systemd dat $(which lil-pids) /home/pi/seeder/services /home/pi/seeder/pids
sudo systemctl start dat

echo "Finished! :D"

# test
# TODO

echo "seeder was successfully installed to your Pi."
echo "Open the frontend in a web-browser, by going to its IP address or to http://<device-name>.local"
