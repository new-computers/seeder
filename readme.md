# seeder
A Raspberry Pi DAT seeder (early-development stage).

## installation
Clone the repo into ```/home/pi/seeder``` and run ```sudo ./install.sh```.

## usage
The installation script should add two services to systemd: hypercored, which is the seeding service & a web server running on port 80 that's the frontend for the seeder.

Navigate to the Pi's address (in my case it's ```seeder.local```) and manage your sources.

After you remove a source it'll still seed it until you restart the Pi or the service.
