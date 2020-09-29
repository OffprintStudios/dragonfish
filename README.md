# Pulp Fiction

This is the backend repository for the Offprint fiction website.

It's still very much a work in progress.

## Build Status
|Pulp Fiction|Build|Test|Production|
|------------|-----|----|----------|
|Server|![Build Server (Dev)](https://github.com/OffprintStudios/pulp-fiction/workflows/Build%20Server%20(Dev)/badge.svg)|![Deploy Test Environment](https://github.com/OffprintStudios/pulp-fiction/workflows/Deploy%20Test%20Environment/badge.svg)|![Deploy to Production](https://github.com/OffprintStudios/pulp-fiction/workflows/Deploy%20to%20Production/badge.svg)|
|Client|![Build Client (Dev)](https://github.com/OffprintStudios/pulp-fiction/workflows/Build%20Client%20(Dev)/badge.svg)|![Deploy Test Environment](https://github.com/OffprintStudios/pulp-fiction/workflows/Deploy%20Test%20Environment/badge.svg)|![Deploy to Production](https://github.com/OffprintStudios/pulp-fiction/workflows/Deploy%20to%20Production/badge.svg)|

## Setting Up The Dev Environment

You must have the following tools installed on your system (or in a docker container):

* NodeJS 14.6.0
* Yarn 1.22.4
* MongoDB 4.2.1
* The [Rust 1.30 (or later) toolchain](https://rustup.rs/).
    * You'll also need a working C compiler. On Ubuntu, the `build-essential` apt package is sufficient.
* The Angular CLI 10.0.4 (globally, via Yarn)
* The NestJS CLI 7.4.1 (globally, via Yarn)
* The `nx` CLI (globally, via Yarn)

Once you've installed and verified that these dependencies are working as expected, run `./build_dev.sh` in the root project directory to start an initial compilation and fetch all necessary libraries.

When you're starting the development server with `nx serve client`, make sure to include a `.env` file in the root project directory. A `sample.env` file can be found in the root of this repository.

### Developing in Docker
If you just want to use `docker-compose`, you can follow these steps.


#### Building the image
- Run `docker-compose build`

Once the container is created you can get a shell inside of it with the following docker command:

```bash
docker container exec -it <your container ID> /bin/bash
```

(You can obtain your container ID with `docker container ls`. Look for the container using the `pulp-fiction_pulpd` image.)

If you're a Visual Studio Code user, you can use the "Open Folder in Container" feature of the [Remote Development extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) to automate all of the above:

- Open VSCode.
- Hit Ctrl + P to open the command palette.
- Type "Remote Containers: Open Folder in Container..."
- Find your `pulp-fiction` folder.
- When prompted, selected `docker-compose.yml`.
- When prompted again, select `pulpd`.
- Let it build.

Once it's done, VSCode will be operating inside the docker container, and opening the terminal with `Ctrl + ` ` will give you a bash environment running in the container.

#### Building the applications

Once inside the docker container...

- Create a file named `.env` at the root of the repository
- Copy  the contents of `sample.env` to your new `.env`
- Edit `.env` to use an *actual* secret. (If you intend to test out image functionality, fill in the DIGITALOCEAN_SPACES_* variables with your information)
- Inside the docker container, run `build_dev.sh`.

After following these steps, you should have your very own copy of Offprint in a Docker container with all dependencies installed.

## Running the application

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

Note that by default, the backend serves up the frontend, so in order to test the website, both of them must be running.

## Contributing

Check out the Contribution guides in the wiki!

TODO: Flesh this section out.

## Want to talk about the project?

Look no further. [We have a Discord server!](https://discord.gg/9cnSwfn)
