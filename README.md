# NENO

NENO is a note-taking app that helps you creating your personal knowledge graph. With NENO, you retain full control over your data because you decide where it is stored: On your local machine, on a cloud storage of your choice, or even on a server under your control.

![NENO Editor view](./docs/img/editor%20view.png)
![NENO Graph view](./docs/img/graph%20view.png)

There are two modes in which NENO can operate: **Server mode** and
**local mode**.

Server mode requires you to set up your own server.
Server mode has the advantage that you can access your data from everywhere you
want. In addition, in server mode NENO will retrieve metadata on pasted URLs
and displays them with your note.
The NENO server supports
* HTTPS and SSL certificates for secure connections
* as many users/databases as you like
* two-factor authentication with password and token

In local mode, NENO stores the data in a directory of your choice on your
local machine (could be a cloud storage directory for example). This is possible
thanks to the [File System Access API](https://web.dev/file-system-access/) that is
now available in Chromium-based browsers (Chrome, Edge, Opera, ...) and
hopefully soon in Firefox, too.
In local mode, no notes data is transmitted to the server.
To run NENO in local mode, you do not need a Node.js server. You only need a
web space capable of serving static files via HTTPS.

## Setting up a NENO server

Requirements: You need to have node>=15 and npm>=6 installed.

### 1. Clone this repository

### 2. Install dependencies
Run the following commands:

`npm cache clean --force`

`npm update`

`npm i`

Sometimes, npm does not correctly install **all** modules. `npm cache clean --force` and `npm update` make sure it does.

### 3. Build the frontend and the backend from the source
Run `npm run build`

### 4. Create a data directory
The NENO server needs a directory where it stores all the data. By default, NENO assumes that this directory is on the same level as the repository folder and has the name `neno-data`. You can customize this (see below in server start parameters).

### 5. Create a users file
NENO needs a users file in the data directory where the user information is stored.
In the repository folder, run `node tools/createUsersFile.js` and follow the instructions on screen. This script will then create a users file called `users.json`. Move the this file into the data directory. 


### 6. Start the server
* If you do not want to use a TLS certificate, this is the start up command for you: `node dist/backend/index.js --port [YOUR_PORT]` (replace `[YOUR_PORT]` with a number like `80`)
* If you do want to use a TLS certificate, you can do `node dist/backend/index.js --use-https
--cert-path [PATH_TO_CERTIFICATE_FILE]
--cert-key-path [PATH_TO_CERTIFICATE_KEY_FILE]`

#### Example to run NENO with a TLS certificate 

```
node dist/backend/index.js --use-https \
--cert-path /etc/letsencrypt/live/www.my.domain/cert.pem \
--cert-key-path /etc/letsencrypt/live/www.my.domain/privkey.pem
```

### Server start parameters

#### -p, --port \<value>
* HTTP port
* Default value: `80`

#### --https-port \<value>
* HTTPS port
* Default value: `443`

#### -d, --data-folder-path \<value>
* path to data folder
* Default value: `path.join(REPO_PATH, "..", "neno-data")


#### --use-https
* create a https server (valid cert and key must be passed as parameters)",

#### --cert-path \<value>
* path to TLS certificate
* Default value: `path.join(REPO_PATH, "..", "server.cert")`

#### --cert-key-path \<value>
* path to private key of TLS certificate
* Default value: `path.join(REPO_PATH, "..", "server.key")`

#### --jwt-secret \<value>
* secret for signing JSON web tokens for authentication
* Default value: A random uuid automatically created at server startup

#### --url-metadata \<url>
* don't start server, only grab url metadata for given url"

### Docker demo

The repository also contains a Dockerfile to set up a NENO server for demo
purposes. When you run the image, the console outputs a QR code for your 2FA
app. Also, a demo user is created with username `test` and password `0000`.
You should not use this in production.

## Deploying NENO for local mode usage

To deploy NENO for local mode usage, you need a web space capable of serving static files via HTTPS.

### 1. Clone this repository

### 2. Install dependencies
Run the following commands:

`npm cache clean --force`

`npm update`

`npm i`

Sometimes, npm does not correctly install **all** modules. `npm cache clean --force` and `npm update` make sure it does.

### 3. Build the frontend from the source

We build the frontend with the local-only flag enabled. This will result in a login page that does not offer a server login form.

Run `npm run build-frontend-production-local-only`

### 4. Copy files to webspace
Copy the following files/folders to your filespace:

* `frontend/assets`
* `frontend/index.html`
* `frontend/browserconfig.xml`
* `frontend/manifest.json`


## Further reading

* [How to use the Graph view](./docs/GraphViewManual.md)

* [Tips and tricks for working with NENO](./docs/TipsAndTricks.md)
