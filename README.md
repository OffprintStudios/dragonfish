# Dragonfish

> Fire in its own way.

This is the backend repository for the Offprint fiction website.

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

For these, use the command `yarn global add @angular/cli @nestjs/cli nx`:

- The Angular CLI 12.0.1 or higher (globally, via Yarn)
- The NestJS CLI 7.6.5 or higher (globally, via Yarn)
- The `nx` CLI (globally, via Yarn)

## Building the application

Once you've installed and verified that these dependencies are working as expected...

- Create a file named `.env` at the root of the repository
- Copy the contents of `sample.env` to your new `.env`
- Edit `.env` to set `MONGO_URL=mongodb://localhost:27017`
- Edit `.env` to set `JWT_SECRET` to an _actual_ secret, such as a plain random string
- If you intend to test out image functionality, fill in the `DIGITALOCEAN_SPACES` variables with your information
- Run `yarn install` in the repository root to install all the dependencies.

When you're starting the development server with `nx serve client`, make sure to include a `.env` file in the root project directory. A `sample.env` file can be found in the root of this repository.

VS Code is the recommended editor.

## Running the application

Installing MongoDB should have resulted in a persistent MongoDB service running, which is necessary for the site.

Note that by default, the backend serves up the frontend, so in order to test the website, both of them must be running.

To run the backend:

```bash
nx serve api
```

To run the frontend:

```bash
nx serve bettafish
```

On some machines, the frontend won't automatically pick up changes and rebuild. In that case, you can try this:

```bash
nx build bettafish --watch --poll=2000
```

Then you should find the website at <http://localhost:3333>

## Contributing

Check out the Contribution guides in the wiki!

TODO: Flesh this section out.

## Deployment

For more information on deploying the server and client, and the project's infrastructure, take a look at [deployment folder's readme](/deploy).

## Want to talk about the project?

Look no further. [We have a Discord server!](https://discord.gg/9cnSwfn)
