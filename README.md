# Dragonfish

> Fire in its own way.

This is the backend repository for the [Offprint fiction website](https://offprint.net/).

It's still very much a work in progress.

## Build Status

| Dragonfish | Build | Test | Production |
| ---------- | ----- | ---- | ---------- |
| Server     | [![Build Server (DO)](https://github.com/OffprintStudios/dragonfish/actions/workflows/digiocean-build-server.yml/badge.svg)](https://github.com/OffprintStudios/dragonfish/actions/workflows/digiocean-build-server.yml) | [![Deploy Server (DO)](https://github.com/OffprintStudios/dragonfish/actions/workflows/digioncean-deploy-server.yml/badge.svg)](https://github.com/OffprintStudios/dragonfish/actions/workflows/digioncean-deploy-server.yml) | ![Deploy to Production](https://github.com/OffprintStudios/dragonfish/workflows/Deploy%20to%20Production/badge.svg) |
| Client     | [![Build Client (DO)](https://github.com/OffprintStudios/dragonfish/actions/workflows/digiocean-build-client.yml/badge.svg)](https://github.com/OffprintStudios/dragonfish/actions/workflows/digiocean-build-client.yml) | [![Deploy Client (DO)](https://github.com/OffprintStudios/dragonfish/actions/workflows/digiocean-deploy-client.yml/badge.svg)](https://github.com/OffprintStudios/dragonfish/actions/workflows/digiocean-deploy-client.yml) | ![Deploy to Production](https://github.com/OffprintStudios/dragonfish/workflows/Deploy%20to%20Production/badge.svg) |

## Setting up the dev environment

You must have the following tools installed on your system or in a docker container (use listed versions or latest):

- NodeJS 14.17.0
- Yarn 1.22.10 (don't use 2.x)
- MongoDB Community Server 4.2.1
    - MongoDB Compass is recommended
- Redis server 6.2.6

## Building the application

Once you've installed and verified that these dependencies are working as expected...

- Create a file named `.env` at the root of the project
- Copy the contents of `sample.env` to your new `.env`
- Edit `.env` to set `MONGO_URL=mongodb://localhost:27017`
- Edit `.env` to set your `REDIS_*` values
- Edit `.env` to set `JWT_SECRET` to an _actual_ secret, such as a plain random string
- If you intend to test out image functionality, fill in the `DIGITALOCEAN_SPACES` variables with your information
- If you intend to test out email functionality, fill in the appropriate SendGrid API information
- Run `yarn install` in the repository root to install all the dependencies.

VS Code and WebStorm are our recommended IDEs.

## Running the application

Installing MongoDB should have resulted in a persistent MongoDB service running, which is necessary for the site.

Note that by default, the API and client are hosted separated. Thus, you must spin up both in order to test any features which require database access.

To run the API:

```bash
yarn start:api
```

To run the client:

```bash
yarn dev:client
```

Then you should find the website at <http://localhost:3000>

## Contributing

Check out the Contribution guides in the wiki!

TODO: Flesh this section out.

## Deployment

For more information on deploying the server and client, and the project's infrastructure, take a look at [deployment folder's readme](/deploy).

## Want to talk about the project?

Look no further. [We have a Discord server!](https://discord.gg/9cnSwfn)