#!/bin/bash

# ------------------------
# This script must be run by npm
# If it isn't http-server and babel-node will not be recognised
# ------------------------


http-server -p $TEST_SERVER_PORT --silent &
HTTP_PID=$!

babel-node test/integration/runner
TEST_RUNNER_EXIT=$?

kill $HTTP_PID

if [ $TEST_RUNNER_EXIT == "0" ]; then
    exit 0
else
    exit 1
fi
