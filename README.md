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
* (Optionally) If you wish to contribute to, or author a native module, you will also need [Neon](https://neon-bindings.com/docs/getting-started) and the [Rust 1.15 (or later)toolchain](https://rustup.rs/).
    * (Double optionally) If not on Ubuntu 16.10 or later, you will also need [LLVM](https://releases.llvm.org/download.html), as native module 
    compilation relies on LLVM's `libclang`. You will also need to set the `LIBCLANG_PATH` environment variable to LLVM's `/bin` directory.

Once you have installed and verified that these dependencies are working as expected, run `yarn install` in both the root project directory and in `/frontend` to install all project-related dependencies.

In order to achieve successful compilation of the backend code, you must create a `.env` file in the root project directory containing both a `DATABASE_URL` pointing to a valid MongoDB server along with a database, e.g. `mongodb://localhost:27017/my_database`, and a `JWT_SECRET` with any development key you want.

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
