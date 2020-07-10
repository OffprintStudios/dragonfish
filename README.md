# Pulp Fiction

This is the backend repository for the Offprint fiction website.

It's still very much a work in progress.

## Setting Up The Dev Environment

You must have the following packages installed globally on your system:

* NodeJS 13.3.0
* Yarn 1.21.1
* TypeScript 3.7.2
* Angular 8.3.21
* NestJS 6.12.6
* MongoDB 4.2.1

Once you have installed and verified that these dependencies are working as expected, run `yarn install` in both the root project directory and in `/frontend` to install all project-related dependencies.

In order to achieve successful compilation of the backend code, you must create a `.env` file in the root project directory containing both a `DATABASE_URL` pointing to a valid MongoDB server along with a database, e.g. `mongodb://localhost:27017/my_database`, and a `JWT_SECRET` with any development key you want.

## Contributing

TODO: Flesh this section out.

## Want to talk about the project?

Look no further. [We have a Discord server!](https://discord.gg/9cnSwfn)