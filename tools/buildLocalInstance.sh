'''
builds a NENO instance intended for local mode only.
make sure, you set ROOT_PATH in frontend/app/config.tsx to the correct basepath
of your hosting environment before building
'''

TARGET_DIRECTORY=../../neno-local-instance
FRONTEND_PUBLIC_PATH=../frontend/public

echo "Removing old bundles..."
rm $FRONTEND_PUBLIC_PATH/js/*
rm $FRONTEND_PUBLIC_PATH/assets/*.js
echo "Creating new bundles..."
npm run build-frontend-production

echo "Removing old target directory content"
rm $TARGET_DIRECTORY/index.html
rm -R $TARGET_DIRECTORY/js
rm -R $TARGET_DIRECTORY/assets

echo "Creating target directory"
mkdir -p $TARGET_DIRECTORY

echo "Copying files to target directory"
cp $FRONTEND_PUBLIC_PATH/index.html $TARGET_DIRECTORY/
cp -R $FRONTEND_PUBLIC_PATH/js $TARGET_DIRECTORY/
cp -R $FRONTEND_PUBLIC_PATH/assets $TARGET_DIRECTORY/

echo "Copying assets to target directory"
sed -i '' -E "s/\/assets/\/neno\/assets/" $TARGET_DIRECTORY/index.html
sed -i '' -E "s/\/js/\/neno\/js/" $TARGET_DIRECTORY/index.html
# https://stackoverflow.com/a/25486705/3890888
sed -i '' -E "s/\/manifest.json/\/neno\/manifest.json/" $TARGET_DIRECTORY/index.html

echo "Creating 404.html for GitHub pages"
cp $TARGET_DIRECTORY/index.html $TARGET_DIRECTORY/404.html
# https://stackoverflow.com/a/59677657/3890888

echo "Done."