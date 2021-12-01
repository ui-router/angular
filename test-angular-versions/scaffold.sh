#!/usr/bin/env bash

VERSION=$1;
if [[ "x" == "x$VERSION" ]] ; then
	echo "specify the version of Angular to test. e.g., to test Angular v14:"
	echo "$0 14"
	exit 1;
fi

JSON=./read-write-json.js
DIR=v$VERSION

npx -y -p @angular/cli@$VERSION ng new --package-manager=yarn --style=css --routing=false --skip-git --skip-install --skip-tests $DIR
rm -rf $DIR/src/app
cp -Rp scaffold/* $DIR

$JSON write $DIR/package.json name "$VERSION"
$JSON write $DIR/package.json dependencies.@uirouter/angular "*"
$JSON write $DIR/package.json dependencies.@uirouter/cypress-runner "*"
$JSON write $DIR/package.json scripts.test "npm run test:dev && npm run test:prod"
$JSON write $DIR/package.json scripts.test:dev "ng build --configuration development && cypress-runner run --path dist/$DIR"
$JSON write $DIR/package.json scripts.test:prod "ng build  --configuration production && cypress-runner run --path dist/$DIR"

$JSON write ../downstream_projects.json  "projects.angular$VERSION" "./test-angular-versions/$DIR"
