#!/bin/bash

: '
builds a NENO release package
'

# this will also be the name of the directory inside the archive
TARGET_DIRECTORY_NAME=neno
TARGET_DIRECTORY=./$TARGET_DIRECTORY_NAME
VERSION=v1.0.0

cd ..

echo "Removing old builds..."
rm frontend/public/js/*
rm -R dist

echo "Creating build"
npm run build
npm run build-browser-extension

echo "Removing old target directory content"
rm -R $TARGET_DIRECTORY

echo "Creating target directory"
mkdir -p $TARGET_DIRECTORY

echo "Copying files to target directory"
rsync -av --progress . $TARGET_DIRECTORY --exclude node_modules --exclude .github --exclude .git

tar -zcvf neno-$VERSION.tar.gz $TARGET_DIRECTORY

rm -R $TARGET_DIRECTORY

echo "Done."