#!/bin/bash

# Provisions a machine for usage by the 'dragonfish' backend for Offprint.
hostname=$1
if [[ -z $hostname ]]; then
    echo "No hostname was included in the provisioning script. Terminating..."
    exit 1
fi

# Create the dragonfish-cd user
sudo useradd dragonfish-cd

# Create the install directory
sudo mkdir /opt/dragonfish
sudo mkdir /opt/dragonfish/.pm2 
sudo mkdir /opt/dragonfish/deploy-cache
sudo mkdir /opt/dragonfish/releases
sudo mkdir /opt/dragonfish/releases/server
sudo mkdir /opt/dragonfish/releases/client

# Set up group membership.
sudo groupapp dragonfishers
sudo usermod -a -G dragonfishers dragonfish-cd # <-- this will be the user in charge of actually running PM2

# Grant ownership of the install directory to the 'dragonfishers' group
sudo chgrp -R dragonfishers /opt/dragonfish/

# Grant read/write/execute access to owners and group members, but not others
sudo chmod -R a+rwx,o-rwx /opt/dragonfish/

# Ensure that any newly-created files inherit group permissions
sudo chmod g+s /opt/dragonfish

# Install and set up PM2
sudo npm install pm2@4.5.4 -g
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u dragonfish-cd --hp /home/dragonfish-cd
pm2 start /opt/dragonfish/server_config/pm2.config.js

# Install and set up caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo apt-key add -
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee -a /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
caddy reverse-proxy --from $hostname --to localhost:3333

# Once everything is set up, ensure that dragonfish-cd owns everything under /opt/dragonfish
chown -R dragonfish-cd /opt/dragonfish/
