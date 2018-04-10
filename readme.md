# seeder
A Raspberry Pi DAT seeder (early-development stage).

It's just a seeder, without HTTP mirroring or anything special. My future plans are to make this 100% renewable-energy powered.

## installation
You need ```node``` and ```npm``` to be accessible from ```$ sudo``` to do this.

Clone the repo into ```/home/pi/seeder``` and run ```sudo ./install.sh```. I didn't test it on other devices so let me know if something's not working.

## usage
The installation script should add two services to systemd: [hypercored](https://github.com/mafintosh/hypercored), which is the seeding service & a web server running on port 80 that's the frontend for the seeder.

Navigate to the Pi's address (in my case it's ```seeder.local```) and manage your sources.

After you remove a source it'll still seed it until you restart the Pi or the service.

## development

Don't run the ```install.sh``` script on your development machine!

Clone the repo, then:
```
npm install
npm run build
npm start dev
```

This will not start ```hypercored``` just the frontend server.
