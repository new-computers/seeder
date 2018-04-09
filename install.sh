#!/bin/sh

npm i -g hypercored add-to-systemd lil-pids
npm install
npm run build
sudo add-to-systemd dat-lil-pids $(which lil-pids) ~/seeder/services ~/seeder/pids
sudo systemctl start dat-lil-pids
