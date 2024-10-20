: '
Deploys NENO to GitHub pages.

Requires another repository (TARGET_DIRECTORY) that is checked out in the
branch that will deploy to gh-pages.
'

TARGET_DIRECTORY=../../neno-gh-pages

SCRIPT_DIRECTORY="$( cd "$( dirname "$0" )" && pwd )"

# see https://unix.stackexchange.com/questions/13711/differences-between-sed-on-mac-osx-and-other-standard-sed
# for differences between macOS sed and GNU sed
if [ "$(uname)" = "Darwin" ]; then
  sed -i '' -E "s/\"\/\"/\"\/neno\/\"/" ../vite.config.ts
else # uname = Linux
  sed -i -r "s/\"\/\"/\"\/neno\/\"/" ../vite.config.ts
fi


npm run build

echo "Removing old target directory content"
rm $TARGET_DIRECTORY/*.html
rm $TARGET_DIRECTORY/*.js
rm $TARGET_DIRECTORY/*.json
rm $TARGET_DIRECTORY/*.webmanifest
rm -R $TARGET_DIRECTORY/assets

echo "Copying files to target directory"
cp -R ../dist/* $TARGET_DIRECTORY/

echo "Creating 404.html for GitHub pages"
cp $TARGET_DIRECTORY/index.html $TARGET_DIRECTORY/404.html
# https://stackoverflow.com/a/59677657/3890888

cd $TARGET_DIRECTORY
git add -A
git commit --amend --no-edit
git push --force

# Reset vite config
cd $SCRIPT_DIRECTORY

if [ "$(uname)" = "Darwin" ]; then
  sed -i '' -E "s/\"\/neno\/\"/\"\/\"/" ../vite.config.ts
else
  sed -i -r "s/\"\/neno\/\"/\"\/\"/" ../vite.config.ts
fi

echo "Done."