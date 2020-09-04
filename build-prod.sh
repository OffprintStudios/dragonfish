#!/bin/bash

# Installing dependencies for workspace
printf "Acquiring all dependences...\n"
curl https://sh.rustup.rs -sSf |  bash -s -- -y
echo 'source $HOME/.cargo/env' >> $HOME/.bashrc
yarn install
printf "\n"

# Building everything
printf "Building the server and client...\n"
nx build server --prod && nx build client --prod
printf "\n"

# Copying .env file to server
printf "Copying .env file to server...\n"
cp .env ./dist/packages/server/.env
printf "\n"

# Copying client to server and moving into it
printf "Copying client files to server folder for static file serving...\n"
rsync -r ./dist/packages/client/* ./dist/packages/server/static
cd ./dist/packages/server
printf "\n"

# Exit message
printf "Ready for blastoff!\n"
