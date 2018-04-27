#!/bin/bash

s_has() {
	type "${1-}" > /dev/null 2>&1
}

# install node
if s_has "node" && s_has "npm" ; then
	echo "node installed"
else
	echo "0. node is not installed. Installing..."

	# install nvm
	if s_has "nvm" ; then
		echo "nvm installed."
	else
		echo "0.a. Installing nvm..."
		curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
		source ~/.bashrc

		echo "nvm installed!"
	fi

	# install latest node version
	nvm install node
	nvm use node

	n=$(which node); \
	n=${n%/bin/node}; \
	chmod -R 755 $n/bin/*; \
	sudo cp -r $n/{bin,lib,share} /usr/local

	echo "Finished! :|"
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
sudo npm install

echo "Finished! :)"

# build
echo "3. Building..."

sudo npm run build

echo "Finished! :>"

# add to systemd
echo "4. Setting up your Pi..."
sudo add-to-systemd dat $(which lil-pids) /home/pi/seeder/services /home/pi/seeder/pids
sudo systemctl start dat

echo "Finished! :D"

# test
# TODO

echo ""
echo "seeder was successfully installed to your Pi."
echo "Open the frontend in a web-browser, by going to its IP address or to http://$(hostname -s).local/"
