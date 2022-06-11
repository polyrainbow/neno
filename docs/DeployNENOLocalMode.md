# Deploying NENO for local mode usage

To deploy NENO for local mode usage, you need a web space capable of serving
static files via HTTPS.

## 1. Clone this repository

## 2. Install dependencies
Run `npm i`

## 3. Build the frontend from the source

Set the constant `ROOT_PATH` in `frontend/app/config.tsx` to the correct basepath
of your hosting environment. Then go to the `tools` directory and open the script
`./buildLocalInstance.sh`. Set the target directory to which the built is saved.
Now run this script.

## 4. Copy files to webspace

Copy the all the files in the target directory your filespace.

Make sure that your webspace contains a SPA fallback mechanism so that requests
to non-existing files are forwarded to `index.html`