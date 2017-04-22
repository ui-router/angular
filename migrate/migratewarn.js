#!env node
"use strict";

var pkg = require('../package.json');
var migrate = require('./migrate.json');

if (pkg.name === migrate.old) {
  var warning = 'WARNING! this npm package "' + migrate.old + '" has moved to "' + migrate.new + '".  Please update your package.json';
  console.log("\x1b[1m\x1b[37m\x1b[41m%s\x1b[0m", warning);
}
