# Pulp Fiction

This is the backend repository for the Offprint fiction website.

It's still very much a work in progress.

## Build Status
|Pulp Fiction|Build|Test|Production
|------------|---------------|
|Backend|[![Backend Build Status](https://dev.azure.com/offprint-studios/pulp-fiction/_apis/build/status/Backend?branchName=master)](https://dev.azure.com/offprint-studios/pulp-fiction/_build/latest?definitionId=1&branchName=master)|[![Backend Test Deployment Status](https://vsrm.dev.azure.com/offprint-studios/_apis/public/Release/badge/8647fb01-5a91-4b3e-9f6e-0114989a79f0/1/1)]|n/a|
|Frontend|[![Frontend Build Status](https://dev.azure.com/offprint-studios/pulp-fiction/_apis/build/status/Frontend?branchName=master)](https://dev.azure.com/offprint-studios/pulp-fiction/_build/latest?definitionId=2&branchName=master)|[![Frontend Test Deployment Status](https://vsrm.dev.azure.com/offprint-studios/_apis/public/Release/badge/8647fb01-5a91-4b3e-9f6e-0114989a79f0/2/2)]|(n/a)|

## Setting Up The Dev Environment

You must have the following packages installed globally on your system:

* NodeJS 14.6.0
* Yarn 1.22.4
* TypeScript 3.9.7
* Angular 10.0.4
* NestJS 7.4.1
* MongoDB 4.2.1
* [Neon](https://neon-bindings.com/docs/getting-started) and the [Rust 1.15 (or later)toolchain](https://rustup.rs/).
    * (Optionally) If not on Ubuntu 16.10 or later, you will also need [LLVM](https://releases.llvm.org/download.html), as native module compilation relies on LLVM's `libclang`. You will also need to set the `LIBCLANG_PATH` environment variable to LLVM's `/bin` directory.

Once you've installed and verified that these dependencies are working as expected, run `./build_dev.sh` in the root project directory to start an initial compilation and fetch all necessary libraries.

When you're starting the development server with `nest start`, make sure to include a `.env` file in the root project directory. A sample `.env` file can be found in the root of this repository.

### Developing in Docker
If you just want to use `docker-compose`, you can follow these steps.

- Edit `sample.env` to use an *actual* secret.
- Copy `sample.env` to `.env`
- Run `docker-compose up`

After following these steps, you should have your very own copy of Offprint running on port 3000.

## Contributing

Check out the Contribution guides in the wiki!

TODO: Flesh this section out.

## Want to talk about the project?

Look no further. [We have a Discord server!](https://discord.gg/9cnSwfn)
