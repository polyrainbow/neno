# Contributing

Contributions are always welcome, no matter how large or small! Before contributing, please read the [code of conduct](./CODE_OF_CONDUCT.md).

## Concepts

If you want to contribute, here are some links that offer some basic insights on how NENO works:

* [README](./README.md)
* [Developer Notes](./docs/DeveloperNotes.md)
* [Lexical Editor Framework](https://lexical.dev)

## Development setup

Make sure, you have Node.js v20 or newer installed. Clone this repo and run
`npm i`. To start a development instance, run `npm run dev`.

## Publishing a release

1. Run `node tools/updateVersion.js {major,minor,patch}`
2. Commit this with the commit message `release: vX.Y.Z` (replace X.Y.Z with actual version number)
3. Add a tag to this commit: `git tag vX.Y.Z`
4. Push commit to remote (if required via PR)
5. Push tag to remote: `git push origin vX.Y.Z`

The release package will now be built remotely with the script 
`tools/buildReleasePackage.sh`

## Commit convention
See https://www.conventionalcommits.org/en/v1.0.0/

## Deploying NENO on your own server

To deploy NENO, you need a web space capable of serving static files via HTTPS.

### 1. Clone this repository

### 2. Install dependencies
Run `npm i`

### 3. Build the app from the source

Set the constant `ROOT_PATH` in `src/config.tsx`, and the `base` property in
the Vite config to the correct basepath.
of your hosting environment. Then go to the `tools` directory and open the script
`./buildLocalInstance.sh`. Set the target directory to which the built is saved.
Now run this script.

### 4. Copy files to webspace

Copy the all the files in the target directory your filespace.

Make sure that your webspace contains a SPA fallback mechanism so that requests
to non-existing files are forwarded to `index.html`