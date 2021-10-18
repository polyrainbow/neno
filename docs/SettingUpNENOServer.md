# Setting up a NENO server

Requirements: You need to have Node.js (>=15) and npm (>=6) installed.

## 1. Clone this repository

## 2. Install dependencies
Run `npm i`

## 3. Build the frontend and the backend from the source
Run `npm run build`

## 4. Create a data directory
The NENO server needs a directory where it stores all the data. By default, NENO assumes that this directory is on the same level as the repository folder and has the name `neno-data`. You can customize this (see below in server start parameters).

## 5. Create a users file
NENO needs a users file in the data directory where the user information is stored.
In the repository folder, run `node tools/createUsersFile.js` and follow the instructions on screen. This script will then create a users file called `users.json`. Move the this file into the data directory. 


## 6. Start the server
* If you do not want to use a TLS certificate, this is the start up command for you: `node dist/backend/index.js --port [YOUR_PORT]` (replace `[YOUR_PORT]` with a number like `80`)
* If you do want to use a TLS certificate, you can do `node dist/backend/index.js --use-https
--cert-path [PATH_TO_CERTIFICATE_FILE]
--cert-key-path [PATH_TO_CERTIFICATE_KEY_FILE]`

### Example to run NENO with a TLS certificate 

```
node dist/backend/index.js --use-https \
--cert-path /etc/letsencrypt/live/www.my.domain/cert.pem \
--cert-key-path /etc/letsencrypt/live/www.my.domain/privkey.pem
```

## Server start parameters

### -p, --port \<value>
* HTTP port
* Default value: `80`

### --https-port \<value>
* HTTPS port
* Default value: `443`

### -d, --data-folder-path \<value>
* path to data folder
* Default value: `path.join(REPO_PATH, "..", "neno-data")`

### --use-https
* create a https server (valid cert and key must be passed as parameters)",

### --cert-path \<value>
* path to TLS certificate
* Default value: `path.join(REPO_PATH, "..", "server.cert")`

### --cert-key-path \<value>
* path to private key of TLS certificate
* Default value: `path.join(REPO_PATH, "..", "server.key")`

### --session-secret \<value>
* secret for signing JSON web tokens for authentication
* Default value: A random uuid automatically created at server startup

### --url-metadata \<url>
* don't start server, only grab url metadata for given url"

## Docker demo

The repository also contains a Dockerfile to set up a NENO server for demo
purposes. When you run the image, the console outputs a QR code for your 2FA
app. Also, a demo user is created with username `test` and password `0000`.
You should not use this in production.