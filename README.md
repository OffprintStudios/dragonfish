# Pulp Fiction

This is the backend repository for the Offprint fiction website.

It's still very much a work in progress.

## Setting Up The Dev Environment

You must have the following packages installed globally on your system:

* NodeJS 12.17.0 or greater
* Yarn 1.22.4
* TypeScript 3.8.3
* Angular 9.1.7
* NestJS 7.1.5
* MongoDB 4.2.0

Once you have installed and verified that these dependencies are working as expected, run `yarn install` in both the root project directory and in `/frontend` to install all project-related dependencies.

In order to achieve successful compilation of the backend code, you must create a `.env` file in the root project directory containing the following information:

```
DATABASE_URL={URL for MongoDB database}
JWT_SECRET={256-bit randomly generated key}
COOKIE_SECRET={256-bit randomly generated key}
```

## Contributing

TODO: Flesh this section out.

## Want to hang out and discuss the project?

Look no further. [We have a Discord channel!](https://discord.gg/MEbDAqn)
