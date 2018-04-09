# seeder
A Raspberry Pi DAT seeder (early-development stage). It's just a seeder, without HTTP mirroring or anything special. My future plans are to make this 100% renewable-energy powered.

I spent around 5 minutes with the design, but will spend more time with it.

## installation
Clone the repo into ```/home/pi/seeder``` and run ```sudo ./install.sh```. I didn't test it on other devices so let me know if something's not working.

## usage
The installation script should add two services to systemd: [hypercored](https://github.com/mafintosh/hypercored), which is the seeding service & a web server running on port 80 that's the frontend for the seeder.

Navigate to the Pi's address (in my case it's ```seeder.local```) and manage your sources.

After you remove a source it'll still seed it until you restart the Pi or the service.
