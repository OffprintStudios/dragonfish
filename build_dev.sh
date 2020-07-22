#!/bin/bash

# Installing dependencies for server and building
yarn install
yarn build
yarn buildNativeModules

# Installing dependencies for frontend and building
cd frontend
yarn install
yarn build

# Mobing back to root
cd ../