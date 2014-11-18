bower install

# Download the selenium JAR
SELENIUM_VERSION=2.41.0
SELENIUM_MINOR_VERSION=2.41
SELENIUM_DOWNLOAD_PATH=vendor/selenium-server-standalone-$SELENIUM_VERSION.jar

mkdir -p vendor

# Only download if we need to
if [ ! -f $SELENIUM_DOWNLOAD_PATH ]; then
wget -nc -O $SELENIUM_DOWNLOAD_PATH \
  https://selenium-release.storage.googleapis.com/$SELENIUM_MINOR_VERSION/selenium-server-standalone-$SELENIUM_VERSION.jar
fi
