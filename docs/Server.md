# Server

## Setting up a NENO server

### 0. Requirements

Make sure that these are installed:

* Node.js (>=17)
* npm (>=8)

The NENO app must be executed in a
[secure context](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts). 
Make sure your setup meets these requirements.

### 1. Clone this repository

### 2. Install dependencies
Navigate your terminal to this repository's directory and run `npm i`

### 3. Build the frontend and the backend from the source
Run `npm run build`

### 4. Start the server

The NENO server requires a directory where it stores all its data. By default, NENO assumes that this directory is on the same level as the repository folder and has the name `neno-data`. You can customize this (see below in server start parameters). If no directory is present at the given path, a new one will be created.

If you do not want to use a TLS certificate, this is the start up command for you:

```
node dist/backend/index.js \
--port [YOUR_PORT]
```
Replace `[YOUR_PORT]` with the actual port number like `80`.

Beware that without a TLS certificate, you should run NENO only for testing purposes or on your local machine.

If you do want to use a TLS certificate, you can do this:

```
node dist/backend/index.js \
--use-https \
--cert-path [PATH_TO_CERTIFICATE_FILE] \
--cert-key-path [PATH_TO_CERTIFICATE_KEY_FILE]
```

Here is an example to run NENO with a TLS certificate 

```
node dist/backend/index.js \
--use-https \
--cert-path /etc/letsencrypt/live/www.my.domain/cert.pem \
--cert-key-path /etc/letsencrypt/live/www.my.domain/privkey.pem
```

### 5. Create users file (only at the first start)

When running NENO server for the first time, follow the instructions on the terminal to create a new users file.


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