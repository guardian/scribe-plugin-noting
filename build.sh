# create src dir if it doesn't exist
mkdir -p src

./node_modules/.bin/browserify index.js -o src/scribe-plugin-noting.js -s scribe-plugin-noting

