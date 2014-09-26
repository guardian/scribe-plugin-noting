# Scribe Plugin Noting

## Setup
To install dependecies:

`$ ./setup.sh`


## Building

To build, run:

`$ plumber build`

This will output the built source files into the _build_ directory.


## Running integration tests
The tests run against the built version so make sure you build the source first. 
The plugin is tested against Chrome and Firefox. To run the Chrome tests you'll need
to have `ChromeDriver` installed. If you're on OS X and have Homebrew then `brew install chromedriver` should do the trick.

To run the integration tests:

`$ env SERVER_PORT=3000 BROWSER_NAME="firefox" ./run-tests.sh`

`$ env SERVER_PORT=3000 BROWSER_NAME="chrome" ./run-tests.sh`


