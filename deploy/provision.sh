#!/bin/bash

# Provisions a machine for usage by the 'dragonfish' backend for Offprint.

# Receive the hostname as an argument from the caller
hostname=$1
if [[ -z $hostname ]]; then
    echo "No hostname was included in the provisioning script. Terminating..."
    exit 1
fi

# Create the dragonfish-cd user, and allow SSH access to them
sudo useradd dragonfish-cd
mkhomedir_helper dragonfish-cd
usermod --shell /bin/bash dragonfish-cd
mkdir -p /home/dragonfish-cd/.ssh
cat /root/.ssh/authorized_keys > /home/dragonfish-cd/.ssh/authorized_keys

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
sudo systemctl reload caddy