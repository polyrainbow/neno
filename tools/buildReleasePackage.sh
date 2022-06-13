#!/bin/bash

: '
builds a NENO release package
'

# this will also be the name of the directory inside the archive
VERSION=v$(eval "cat ../package.json | jq -r '.version'")
OUTPUT_FILENAME=neno-$VERSION.tar.gz

cd ..

echo "Removing old builds ..."
rm frontend/public/js/*
rm -R dist

echo "Creating build ..."
npm run build
npm run build-browser-extension

echo "Creating archive ..."
# works with Mac tar, not sure about GNU tar
tar --exclude node_modules --exclude="*.tar.gz" -zcv -f $OUTPUT_FILENAME ./*

echo "Done."