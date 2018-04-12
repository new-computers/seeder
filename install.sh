#!/bin/sh

npm i -g add-to-systemd lil-pids
npm install
npm run build
sudo add-to-systemd dat $(which lil-pids) ~/seeder/services ~/seeder/pids
sudo systemctl start dat
