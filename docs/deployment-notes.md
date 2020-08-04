# Deployment notes
Some notes about what the setup required on the server.

## Test server
Can be found at http://139.59.157.229.  
HTTP and a naked IP because I'm lazy.

### Basics
- The site root is at `/opt/pulpd`
- a user named `pulpd-user` is in charge of managing and deploying the service

### Folder structure
- Note: Make sure pulpd-user has read/write/execute permissions on /opt/pulpd/ and subdirectories

```
/opt/pulpd
├── .pm2
│   └── (pm2 stuff)
├── deployment
│   ├── backend
│   │   ├── Release-52
|   |   |   ├── .env
|   |   |   ├── node_modules
│   │   │   └── dist
│   │   │       ├── api
│   │   │       │   ├── admin
│   │   │       │   ├── auth
│   │   │       │   │   └── models
│   │   │       │   ├── content
│   │   │       │   │   ├── blogs
│   │   │       │   │   ├── portfolio
│   │   │       │   │   └── works
│   │   │       │   ├── images
│   │   │       │   │   └── models
│   │   │       │   └── search
│   │   │       │       └── models
│   │   │       ├── db
│   │   │       │   ├── blogs
│   │   │       │   │   └── models
│   │   │       │   ├── users
│   │   │       │   │   └── models
│   │   │       │   └── works
│   │   │       │       └── models
│   │   │       ├── guards
│   │   │       ├── static -> /opt/pulpd/deployment/frontend/Release-25/
│   │   │       └── util
│   │   ├── (other releases, etc)
│   │   └── ignoreme
│   └── frontend
│       ├── Release-25
│       │   └── (frontend content, etc)
│       ├── (other releases, etc)
│       └── ignoreme
└── site -> /opt/pulpd/deployment/backend/Release-52/
```

### Daemonizing
- Need `pm2` to manage daemonizing the server (https://pm2.keymetrics.io/)
- /etc/environment should have 'export PM2_HOME=/opt/pulpd/.pm2' added to it

`pm2` likes to save things to the current user's home dir by default. That's not great, so we should make a little effort to make it more multi-user:

First, set up a group that users who manage `pm2` belong to:
   ```bash
   sudo groupadd pm2
   sudo usermod -a -G pm2 pulpd-user
   sudo usermod -a -G pm2 (whoever else needs to control pm2)
   ```
Then, give that group ownership of the `.pm2` folder.
```bash
   sudo chgrp -R pm2 /opt/pulpd/.pm2
   sudo chmod -R 770 /opt/pulpd/.pm2
   sudo chmod g+s /opt/pulpd/.pm2
   ```
   
Then, we just have to set up `pm2`:

**Note: Make sure $PM2_HOME is set to `/opt/pulpd/.pm2`!**

```bash
    pm2 start site/dist/main.js --name pulpd    
    pm2 systemd startup
    # (copy-paste the given line, EXCEPT pass /opt/pulpd (and NOT /opt/pulpd/.pm2) to --hp)
    pm2 save
```

...now the server will come up on reboot, and try to autorecover on crash.