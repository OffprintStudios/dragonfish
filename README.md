# Dragonfish

> Fire in its own way.

This is the backend repository for the Offprint fiction website.

It's still very much a work in progress.

## Build Status

| Dragonfish | Build                                                                                                             | Test                                                                                                                      | Production                                                                                                          |
| ---------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Server     | ![Build Server (Dev)](<https://github.com/OffprintStudios/dragonfish/workflows/Build%20Server%20(Dev)/badge.svg>) | ![Deploy Test Environment](https://github.com/OffprintStudios/dragonfish/workflows/Deploy%20Test%20Environment/badge.svg) | ![Deploy to Production](https://github.com/OffprintStudios/dragonfish/workflows/Deploy%20to%20Production/badge.svg) |
| Client     | ![Build Client (Dev)](<https://github.com/OffprintStudios/dragonfish/workflows/Build%20Client%20(Dev)/badge.svg>) | ![Deploy Test Environment](https://github.com/OffprintStudios/dragonfish/workflows/Deploy%20Test%20Environment/badge.svg) | ![Deploy to Production](https://github.com/OffprintStudios/dragonfish/workflows/Deploy%20to%20Production/badge.svg) |

## Setting up the dev environment

You must have the following tools installed on your system or in a docker container (use listed versions or latest):

-   NodeJS 14.6.0
-   Yarn 1.22.4 (don't use 2.x)
-   MongoDB Community Server 4.2.1
    -   MongoDB Compass is recommended
-   The [Rust 1.30 (or later) toolchain](https://rustup.rs/).
    -   You'll also need a working C compiler. On Ubuntu, the `build-essential` apt package is sufficient.

For these, use the command `yarn global add @angular/cli @nestjs/cli nx`:

-   The Angular CLI 10.0.4 (globally, via Yarn)
-   The NestJS CLI 7.4.1 (globally, via Yarn)
-   The `nx` CLI (globally, via Yarn)

## Building the application

Once you've installed and verified that these dependencies are working as expected...

-   Create a file named `.env` at the root of the repository
-   Copy the contents of `sample.env` to your new `.env`
-   Edit `.env` to set MONGO_URL=mongodb://localhost:27017
-   Edit `.env` to set JWT_SECRET to an _actual_ secret, such as a plain random string
-   If you intend to test out image functionality, fill in the DIGITALOCEAN*SPACES*\* variables with your information

Run `./build-dev.sh` in the root project directory to start an initial compilation and fetch all necessary libraries. SH files can be run using Git Bash on Windows.

When you're starting the development server with `nx serve client`, make sure to include a `.env` file in the root project directory. A `sample.env` file can be found in the root of this repository.

To view the source files, VS Code is recommended.

### Developing in Docker

If you just want to use `docker-compose`, you can follow these steps.

#### Building the image

-   Run `docker-compose build`

Once the container is created you can get a shell inside of it with the following docker command:

```bash
docker container exec -it <your container ID> /bin/bash
```

(You can obtain your container ID with `docker container ls`. Look for the container using the `pulp-fiction_pulpd` image.)

If you're a Visual Studio Code user, you can use the "Open Folder in Container" feature of the [Remote Development extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) to automate all of the above:

-   Open VSCode.
-   Hit Ctrl + P to open the command palette.
-   Type "Remote Containers: Open Folder in Container..."
-   Find your `pulp-fiction` folder.
-   When prompted, selected `docker-compose.yml`.
-   When prompted again, select `pulpd`.
-   Let it build.

Once it's done, VSCode will be operating inside the docker container, and opening the terminal with `Ctrl + ` ` will give you a bash environment running in the container.

Once inside the docker container, you can follow the directions from "Building the applications".

## Running the application

Installing MongoDB should have resulted in a persistent MongoDB service running, which is necessary for the site.

Note that by default, the backend serves up the frontend, so in order to test the website, both of them must be running.

To run the backend:

```bash
nx serve server
```

To run the frontend:

```bash
nx build client
```

On some machines, the frontend won't automatically pick up changes and rebuild. In that case, you can try this:

```bash
nx build client --watch --poll=2000
```

Then you should find the website at http://localhost:3333

To run the Dashboard:

```bash
nx serve dashboard
```

Then you should find the website at http://localhost:4200. Note the backend still needs to be run for this.

## Troubleshooting

When running the backend, if you get a message like this:

```bash
nx run server:serve
ð§  Checking for wasm-pack...

â¹ï¸  Installing wasm-pack

spawn npm ENOENT
```

Then you may have to manually install [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/).

## Contributing

Check out the Contribution guides in the wiki!

TODO: Flesh this section out.

## Want to talk about the project?

Look no further. [We have a Discord server!](https://discord.gg/9cnSwfn)
