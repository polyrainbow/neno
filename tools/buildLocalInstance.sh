'''
builds a NENO instance intended for local mode only.
make sure, you set ROOT_PATH in src/config.tsx to the correct basepath
of your hosting environment before building
'''

TARGET_DIRECTORY=../../neno-gh-pages

npm run build

echo "Removing old target directory content"
rm $TARGET_DIRECTORY/index.html
rm $TARGET_DIRECTORY/404.html
rm -R $TARGET_DIRECTORY/assets

echo "Copying files to target directory"
cp -R ../dist/* $TARGET_DIRECTORY/

echo "Creating 404.html for GitHub pages"
cp $TARGET_DIRECTORY/index.html $TARGET_DIRECTORY/404.html
# https://stackoverflow.com/a/59677657/3890888

echo "Done."