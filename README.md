# Scribe Plugin Noting

## Build information

[![Circle CI](https://circleci.com/gh/guardian/scribe-plugin-noting.svg?style=shield&circle-token=243ab02e5db3546c4387594d15a9dc6fca39e13a)](https://circleci.com/gh/guardian/scribe-plugin-noting) <img src="https://david-dm.org/guardian/scribe.svg">

## Environment

Build and integration test verified to work with **Node 4.2.4**.

## Setup
To install dependecies:

`$ npm install`


## Building

To build, run:

`$ npm run build`

This will output the built source files into the _build_ directory.


## Running integration tests
The tests run against the built version so make sure you build the source first.
The plugin is tested against Chrome and Firefox. To run the tests in Chrome you'll need
to have `ChromeDriver` installed. If you're on OS X and have Homebrew then `brew install chromedriver` should do the trick.

To run the integration tests:

`$ npm test`

This will run tests on chrome only. To run tests on Firefox:

`$ npm run test-firefox`
