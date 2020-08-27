#!/bin/bash

# Installing dependencies for workspace
yarn install

# Building everything
nx build server --prod && nx build client --prod

# Copying .env file to server
cp .env ./dist/packages/server/.env