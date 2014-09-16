# create src dir if it doesn't exist
mkdir -p dist

./node_modules/.bin/browserify src/noting.js -o dist/scribe-plugin-noting.js -s scribe-plugin-noting --debug

