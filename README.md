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
* The [Rust 1.15 (or later) toolchain](https://rustup.rs/).
    * You may also need the following packages in order to compile the Rust packages:
        * `build-essential`

Once you've installed and verified that these dependencies are working as expected, run `./build_dev.sh` in the root project directory to start an initial compilation and fetch all necessary libraries.

When you're starting the development server with `nx serve client`, make sure to include a `.env` file in the root project directory. A sample `.env` file can be found in the root of this repository.

### Developing in Docker
If you just want to use `docker-compose`, you can follow these steps.

- Edit `sample.env` to use an *actual* secret.
- Copy `sample.env` to `.env`
- Run `docker-compose up`

After following these steps, you should have your very own copy of Offprint running in a Docker container with all dependencies installed.

## Contributing

Check out the Contribution guides in the wiki!

TODO: Flesh this section out.

## Want to talk about the project?

Look no further. [We have a Discord server!](https://discord.gg/9cnSwfn)
