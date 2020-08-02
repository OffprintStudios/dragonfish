#!/bin/bash

# Installing dependencies for server and building
yarn add @types/mongoose-paginate-v2 --dev # This one keeps failing to install
yarn install
yarn build

# Installing dependencies for frontend and building
cd frontend
yarn add @angular-devkit/build-angular --dev
yarn install
yarn build --prod

# Mobing back to root
cd ../