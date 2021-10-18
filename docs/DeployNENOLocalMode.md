# Deploying NENO for local mode usage

To deploy NENO for local mode usage, you need a web space capable of serving static files via HTTPS.

## 1. Clone this repository

## 2. Install dependencies
Run `npm i`

## 3. Build the frontend from the source

We build the frontend with the local-only flag enabled. This will result in a login page that does not offer a server login form.

Run `npm run build-frontend-production-local-only`

## 4. Copy files to webspace
Copy the following files/folders to your filespace:

* `frontend/assets`
* `frontend/index.html`
* `frontend/browserconfig.xml`
* `frontend/manifest.json`