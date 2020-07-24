# Pulp Fiction

This is the backend repository for the Offprint fiction website.

It's still very much a work in progress.

## Setting Up The Dev Environment

You must have the following packages installed globally on your system:

* NodeJS 12.17.0
* Yarn 1.21.1
* TypeScript 3.8.3
* Angular 9.1.5
* NestJS 7.1.5
* MongoDB 4.2.1
* Rust 1.34 (or later) and the Cargo toolchain
    * If not on Ubuntu 16.10 or later, you will also need LLVM, as native module compilation relies on LLVM's `libclang`. You will also need to set the `LIBCLANG_PATH` environment variable to LLVM's `/bin` directory.

Once you've installed and verified that these dependencies are working as expected, run `./build_dev.sh` in the root project directory to start an initial compilation and fetch all necessary libraries.

When you're starting the development server with `nest start`, make sure to include a `.env` file in the root project directory. A sample `.env` file can be found in the root of this repository.

### Developing in Docker
If you just want to use `docker-compose`, you can follow these steps.

- Edit `sample.env` to use an *actual* secret.
- Copy `sample.env` to `.env`
- Run `docker-compose up`

After following these steps, you should have your very own copy of Offprint running on port 3000.

## Contributing

TODO: Flesh this section out.

## Want to talk about the project?

Look no further. [We have a Discord server!](https://discord.gg/9cnSwfn)
