<p align="center">
  <img
    style="text-align: center;"
    src="../public/assets/app-icon/logo.svg"
    alt="NENO Logo"
    width="200" height="200" 
  >
</p>

# NENO User Manual

Hello there and welcome to the NENO user manual. 👋 Thank you for your interest in NENO. We hope that this manual provides you with all you need to become a productive NENO user.

## What is NENO?

![NENO Editor view](./img/neno-light.png)
![NENO Graph view](./img/graph-view.png)

NENO is a powerful note-taking app that helps you create your personal knowledge graph. If you do not know what a personal knowledge graph is, read [this great introduction by Dan McCreary](https://towardsdatascience.com/personal-knowledge-graphs-9a23a0b099af). With NENO, you retain full control over your data because you decide where it is stored: On your device, on a cloud storage of your choice, or even on a server under your control.

NENO is open-source software which means it is completely free to use.

![NENO Editor view in dark mode](./img/neno-dark.png)

## Getting started

NENO stores the data in a folder of your choice on your
device. If you want, you could also select a cloud storage folder so that your notes are synchronized to all your devices. You could also use a Git repository to manage your notes. That way, you also get versioning for free.
**The app does not send any user data to a web server**. 

To start, just go to the app: [NENO](https://sebastianzimmer.github.io/neno)

Beware that yor web browser has to support a feature called
"File System Access API". At the time of writing, the desktop versions
of Chrome, Edge, Opera, and Safari do support it.
Mobile browser versions are not supported yet.
We recommend to use a Chromium-based browser (Chrome, Opera, Edge, etc.).

## Taking notes

Taking notes in NENO is quite straight-forward. Just start writing your note
in the editor and save it. You will see that the note list on the left now
contains your first note:

![My first note](./img/my-first-note.png)

Notes are written in the [Subtext](https://github.com/subconsciousnetwork/subtext).
The editor features transclusions to other notes and files of your note corpus.

When you create another note, you can link it with the first one by clicking on the
chain icon of your first note in the note list:

![Link to another note](./img/link-to-another-note.png)

This will add a Wikilink to your note content. After saving your note, you can see the new link in the Graph view as well:

![Two linked notes in Graph view](./img/two-linked-notes-in-graph-view.png)

## Graph View

One of the best features of NENO is the Graph view.
[Read here how to use the Graph view](./GraphView.md)

## Tips and Tricks

Now you should already be familiar with NENO's basic functionality. But there
are some [tips and tricks for working with NENO](./TipsAndTricks.md) that
can make your life easier.

## Keyboard Shortcuts

### Editor

- Save note: `CTRL`/`CMD` + `s`