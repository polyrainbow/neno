# Contributing

Contributions are always welcome, no matter how large or small! Before contributing, please read the [code of conduct](https://github.com/SebastianZimmer/neno/blob/main/CODE_OF_CONDUCT.md).

## Concepts

If you want to contribute, here are some links that offer some basic insights on how NENO works:

* [README](./README.md)
* [Why I built NENO](./docs/posts/Serendipity.md)
* [How to setup a NENO server](./docs/Server.md)
* [Developer Notes](./docs/DeveloperNotes.md)
* [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API) (used in local mode)

## Development setup

Make sure, you have Node.js v19.8.1 or newer installed. Clone this repo and run
`npm i`. To start a development instance, run `npm run dev`. There is no watch-and-reload
mechanism enabled. For frontend changes, refresh the page to see the effect.
For backend changes, restart the development environment.

## Repository folder structure

* `backend`: Backend-related code
* `browser-extension`: Code related to browser extension
* `docs`: Documentation
* `frontend`: Frontend-related code
* `lib`: Shared libs and types used by both frontend and backend
* `tools`: Some scripts to make the developer's life easier


