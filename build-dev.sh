#!/bin/bash

# Installing dependencies for workspace
yarn install

# Building everything
nx build server && nx build client
