#!/usr/bin/env bash

SITE_DIR="/var/www/aselva.org/html"
PUBLIC_DIR="$SITE_DIR/public"

rm "$PUBLIC_DIR/counties.zip"
mv "/tmp/counties.zip" "$PUBLIC_DIR/counties.zip"

cd $SITE_DIR

pm2 stop 0
sudo npm run-script build && pm2 start 0
