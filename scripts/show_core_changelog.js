#!env node
"use strict";
var gitSemverTags = require('git-semver-tags');
var shelljs = require('shelljs');
var path = require('path');
var fs = require('fs');

var CORE = `core`;
var CORE_PKG = `@uirouter/${CORE}`;
var CORE_DIR = path.join(__dirname, "..", "..", CORE);
var SHOWCHANGELOG_SCRIPT = path.join(CORE_DIR, "scripts", "show_changelog.js");

var currentPackage = require('../package.json');
if (!currentPackage.dependencies || !currentPackage.dependencies[CORE_PKG]) {
  console.error(stringify(currentPackage.dependencies));
  throw new Error("No dependency on " + CORE_PKG + " found in package.json.")
}

if (!fs.existsSync(CORE_DIR)) {
  throw new Error(CORE_PKG + " not found at " + path.resolve(CORE_DIR));
}

if (!fs.existsSync(SHOWCHANGELOG_SCRIPT)) {
  throw new Error("show_changelog.js not found at " + path.resolve(SHOWCHANGELOG_SCRIPT));
}

shelljs.config.silent = true;
gitSemverTags(function (err, val) {
  var fromTag;
  if (require.main === module && process.argv[2]) {
    fromTag = process.argv[2];
  } else {
    var prevRaw = shelljs.exec('git show ' + val[0] + ':package.json', {silent:true}).stdout;
    var prevPackage;
    try {
      prevPackage = JSON.parse(prevRaw);
    } catch (error) {
      console.error("Unable to parse previous package.json in ${val[0]}");
      console.error(prevRaw);
      throw error;
    }

    if (!prevPackage.dependencies) {
      console.error(stringify(prevPackage));
      throw new Error(`previous package.json in ${val[0]} has no "dependencies" key.`);
    } else if (!prevPackage.dependencies[CORE_PKG]) {
      console.error(stringify(prevPackage.dependencies));
      throw new Error(`previous package.json in ${val[0]} has no "dependencies['${CORE_PKG}']" key.`);
    }

    fromTag = prevPackage.dependencies[CORE_PKG].replace(/[=~^]/, "");
  }

  var toTag = require("../package.json").dependencies[CORE_PKG].replace(/[=~^]/g, "");
  shelljs.pushd(CORE_DIR);
  // console.log("node " + SHOWCHANGELOG_SCRIPT + " " + fromTag + " " + toTag)
  shelljs.config.silent = false;
  shelljs.exec("node " + SHOWCHANGELOG_SCRIPT + " " + fromTag + " " + toTag)
});


function stringify(object) {
  return JSON.stringify(object, null, 2);
}