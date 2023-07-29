#!/bin/bash

: '
builds a NENO release package
'

# this will also be the name of the directory inside the archive
VERSION=v$(eval "cat ../package.json | jq -r '.version'")
OUTPUT_FILENAME=neno-$VERSION.tar.gz

cd ..

echo "Removing old builds ..."
rm -R dist

echo "Creating build ..."
npm run build

echo "Creating archive ..."
# works with Mac tar, not sure about GNU tar
tar -zcv -f $OUTPUT_FILENAME ./dist/*

echo "Done."