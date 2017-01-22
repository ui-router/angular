import nodeResolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import progress from 'rollup-plugin-progress';
import sourcemaps from 'rollup-plugin-sourcemaps';
import visualizer from 'rollup-plugin-visualizer';
import commonjs from 'rollup-plugin-commonjs';

var MINIFY = process.env.MINIFY;

var pkg = require('./package.json');
var banner =
`/**
 * ${pkg.description}
 * @version v${pkg.version}
 * @link ${pkg.homepage}
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */`;

var uglifyOpts = { output: {} };
// retain multiline comment with @license
uglifyOpts.output.comments = (node, comment) =>
comment.type === 'comment2' && /@license/i.test(comment.value);

var plugins = [
  nodeResolve({jsnext: true}),
  progress(),
  sourcemaps(),
  commonjs(),
];

if (MINIFY) plugins.push(uglify(uglifyOpts));
if (MINIFY) plugins.push(visualizer({ sourcemap: true }));

var extension = MINIFY ? ".min.js" : ".js";

const BASE_CONFIG = {
  sourceMap: true,
  format: 'umd',
  exports: 'named',
  plugins: plugins,
  banner: banner,
};

// Suppress this error message... there are hundreds of them. Angular team says to ignore it.
// https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
function onwarn(warning) {
  if (warning.code === 'THIS_IS_UNDEFINED') return;
  console.error(warning.message);
}

const ROUTER_CONFIG = Object.assign({
  moduleName: 'ui-router-ng2',
  entry: 'lib/index.js',
  dest: '_bundles/ui-router-ng2' + extension,
  context: 'undefined',
  onwarn: onwarn,
  external: [
    'rxjs',
    'rxjs/Rx',
    'rxjs/Observable',
    'rxjs/ReplaySubject',
    'rxjs/BehaviorSubject',
    'rxjs/Subscription',
    'rxjs/add/observable/of',
    'rxjs/add/observable/combineLatest',
    'rxjs/add/observable/fromPromise',
    'rxjs/add/operator/switchMap',
    'rxjs/add/operator/mergeMap',
    'rxjs/add/operator/concat',
    'rxjs/add/operator/map',
    '@angular/core',
    '@angular/common',
  ],
  globals: {
    '@angular/core': 'ng.core',
    '@angular/common': 'ng.common',
    'rxjs/Observable': 'Rx',
    'rxjs/Subject': 'Rx',
    'rxjs/BehaviorSubject': 'Rx',
    'rxjs/ReplaySubject': 'Rx',
  }
}, BASE_CONFIG);

export default ROUTER_CONFIG;
