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
sudo mkdir -p /opt/dragonfish
sudo mkdir -p /opt/dragonfish/deploy-cache
sudo mkdir -p /opt/dragonfish/releases
sudo mkdir -p /opt/dragonfish/releases/server
sudo mkdir -p /opt/dragonfish/releases/client

# Set up group membership.
sudo groupadd dragonfishers
sudo usermod -a -G dragonfishers dragonfish-cd # <-- this will be the user in charge of actually running PM2

# Grant ownership of the install directory to the 'dragonfishers' group
sudo chgrp -R dragonfishers /opt/dragonfish/

# Grant read/write/execute access to owners and group members, but not others
sudo chmod -R a+rwx,o-rwx /opt/dragonfish/

# Ensure that any newly-created files inherit group permissions
sudo chmod g+s /opt/dragonfish

# Install NPM and Node
# This is the only way to pin to Node 15.5.1 the nodesource repository removes
# old point versions whenever they do a minor update (which breaks our attempt to
# pin to a specific version with apt-get)
wget --quiet --output-document=node-latest.deb 'https://deb.nodesource.com/node_15.x/pool/main/n/nodejs/nodejs_15.5.1-deb-1nodesource1_amd64.deb'
sudo apt install -y ./node-latest.deb 
rm node-latest.deb

# Once everything is set up, ensure that dragonfish-cd owns everything under /opt/dragonfish
chown -R dragonfish-cd /opt/dragonfish/

# Install and set up caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo apt-key add -
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee -a /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
sed -i "s/replaceme/$hostname/g" "/root/Caddyfile"
sudo cp /root/Caddyfile /etc/caddy/Caddyfile
