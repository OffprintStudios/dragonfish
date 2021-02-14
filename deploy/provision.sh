# Provisions a machine for usage by the 'dragonfish' backend for Offprint.

# Create the user that will be in charge of PM2 later
sudo useradd dragonfish-user

# Create the install directory
sudo mkdir /opt/dragonfish
sudo mkdir /opt/dragonfish/.pm2 
sudo mkdir /opt/dragonfish/deploy-cache
sudo mkdir /opt/dragonfish/releases
sudo mkdir /opt/dragonfish/releases/server
sudo mkdir /opt/dragonfish/releases/client

# Set up group membership. Assumes that the `dragonfish-cd` user already exists.
sudo groupapp dragonfishers
sudo usermod -a -G dragonfishers dragonfish-cd
sudo usermod -a -G dragonfishers dragonfish-user # <-- this will be the user in charge of actually running PM2

# Grant ownership of the install directory to the 'dragonfishers' group
sudo chgrp -R dragonfishers /opt/dragonfish/

# Grant read/write/execute access to owners and group members, but not others
sudo chmod -R a+rwx,o-rwx /opt/dragonfish/

# Ensure that any newly-created files inherit group permissions
sudo chmod g+s /opt/dragonfish

# Install and set up PM2
sudo npm install pm2@4.5.4 -g
# Redirect PM2's home, so it can be safely used by more than one user
echo "PM2_HOME=\"/opt/dragonfish/.pm2\"" | sudo tee -a /etc/environment > /dev/null
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u dragonfish-user --hp /opt/dragonfish
