#!/usr/bin/env bash

JSON="../test-angular-versions/read-write-json.js"
VERSION=$1;
if [[ "x" == "x$VERSION" ]] ; then
	echo "specify the version of Typescript to test. e.g., to test Typescript 4.7:"
	echo "$0 4.7"
	exit 1;
fi

DIR=typescript$VERSION

mkdir $DIR
cp -Rp scaffold/* $DIR

$JSON write $DIR/package.json name "@uirouter/angular-test-typescript$VERSION"
$JSON write $DIR/package.json description "Test against Typescript $VERSION"
$JSON write $DIR/package.json dependencies.typescript "$VERSION"

$JSON write ../downstream_projects.json  "projects.typescript$(echo $VERSION | sed -e 's/\.//g')" "./test-typescript-versions/$DIR"
