#!/bin/bash

BASE_DIR=$(dirname $0)

if [ $# -ne 1 ];
then
  echo "Usage: ./release.sh <version-number | major | minor | patch | build>"
  exit 1
fi

# Clean the working tree
git reset --hard
git checkout master

echo "-- Building distribution files"
npm run build-prod

echo "-- Copying distribution files to dist branch"
git checkout dist
git fetch
git reset --hard origin/dist
yes | cp -R ./build/* .

echo "-- Commiting update to distribution files"
git add --update .
git commit --message "Update distribution files"
MVERSION_PATH="$BASE_DIR/node_modules/.bin/mversion"
echo "-- Current version: `$MVERSION_PATH`"
echo "-- Updating version"
$MVERSION_PATH $1 -m "v%s"

git checkout master
