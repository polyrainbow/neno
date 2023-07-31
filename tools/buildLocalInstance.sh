'''
Builds a NENO instance intended for a deployment on GitHub pages.

Requires another repository (TARGET_DIRECTORY) that is checked out in the
branch that will deploy to gh-pages.

Make sure, you set the base property in the Vite config to the correct
basepath of your hosting environment before building
Example: domain.com/neno/ -> base: '/neno/'
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

cd $TARGET_DIRECTORY
git add -A
git commit --amend --no-edit
git push --force

echo "Done."