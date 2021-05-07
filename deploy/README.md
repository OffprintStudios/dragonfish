# Deployment
This sub-readme is all about how the Offprint server and client are deployed, and the infrastructure that they run on.

## Continuous Integration
Every commit to the `main` branch (including PR merges) automatically triggers a GitHub Actions workflow (all of which can be found in the [`.github` directory](../.github) in the repository).

The client and server each have a separate set of workflows, both of which build a new version any time either of them change. The newly-built artifact is then zipped and stored, for later use by the deployment system.

## Continuous Deployment
Whenever a new artifact is built off the `main` branch, it is automatically deployed to the test environment. If, after testing, the new artifact looks good, it can automatically be deployed to the production environment after a manual approval from one of the maintainers.

## The environments
Offprint has a test environment and a production environment. 

### Test Environment
Running on a Digital Ocean VM, can be found at `165.232.148.23`. Always running the latest from `main`, and uses a separate database and image hosting instance from the production environment.

### Production environment
Running on a beefier Digital Ocean VM, can be found at `143.198.107.187`. Running whatever's been deployed to it =)

## Provisioning a new server
Server provisioning is automatic, and powered by the [`provision-droplet` workflow](../.github/workflows/provision-droplet.yml). That workflow is responsible for:
 - Creating the new Digital Ocean droplet
 - Uploading and running the script that creates users, downloads necessary packages, and sets up the reverse proxy on the server
 - Installing Node on the server
 - Creating the daemon that will run the Offprint server application

 ## The server runtime infrastructure
 The actual serving of pages is accomplished through a combination of three different things:
  - A reverse proxy powered by [Caddy](https://caddyserver.com/) that handles HTTPS, and accepts incoming HTTP requests and redirects them to the `dragonfish` NodeJS application
  - [PM2](https://pm2.keymetrics.io/), which provides automatic restart-on-crash and restart-on-reboot (among other things) for the `dragonfish` NodeJS application
  -  The actual `dragonfish` NodeJS application, which provides the Offprint API, and serves up the `bettafish` client to users.

  The Caddy reverse proxy's configuration file can be [found in this folder](./Caddyfile). The `replaceme` string in it is replaced by the hostname or IP address of the server it will be deployed to by the [provisoning script](./provision.sh). Caddy is installed as a systemd service on the server, and can be controlled by systemctl, and its logs viewed with journalctl.

  PM2's configuration file can also [be found in this folder](./pm2.config.js). It tells PM2 where the NodeJS application's entry point, and what its working directory should be.

  ### The server file layout
  The files on the server are laid out as follows:
  
  ```bash
/opt/dragonfish
├── current_server -> /opt/dragonfish/releases/server/release-<num>-<sha>
├── backend-deploy-cache
├── deploy-cache
├── frontend-deploy-cache
├── releases
│   ├── client
│   │   └── release-<num>-<sha>
│   │       └── <etc etc>
│   └── server
│       └── release-<num>-<sha>
│           ├── assets
│           └── static -> /opt/dragonfish/releases/client/release-<num>-<sha>
└── server_config
    └── pm2.config.js
  ```

- `current_server` is a symlink to the folder of the latest server release.
- `backend-deploy-cache`, `frontend-deploy-cache` and `deploy-cache` are working folders for the deployment process to unpack artifacts, and all contents should be considered transient.
- `releases` contains released versions of both the client and the server applications. Each version is identified by a build number, and the commit SHA from which it was built.

Note that the `current_server` symlink points to the latest release folder in the `server/releases/` directory. There is _also_ a symlink inside `current_server` named `static` which points to the latest _client_ release. Whenever a new server or client is deployed, these symlinks are rearranged as necessary. 

This is what allows for zero-downtime deployments: after unpacking the newest release, the actual upgrade process is just a matter of re-pointing a symlink (or two symlinks in the case of a server update), which is nearly instant.
