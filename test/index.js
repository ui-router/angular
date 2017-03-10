// require all source files ending in "Spec" from the
// current directory and all subdirectories

require('core-js');
// require('zone.js');

require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');
require('zone.js/dist/proxy');
require('zone.js/dist/sync-test');
require('zone.js/dist/jasmine-patch');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');

// Init testing harness
require('./bootstrap');

// Add ui-router-ng2
require('../src/index');

var testsContext = require['context'](".", true, /\.spec$/);
testsContext.keys().forEach(testsContext);
