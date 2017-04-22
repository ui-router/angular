import nodeResolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import progress from 'rollup-plugin-progress';
import sourcemaps from 'rollup-plugin-sourcemaps';
import visualizer from 'rollup-plugin-visualizer';
import commonjs from 'rollup-plugin-commonjs';

let MINIFY = process.env.MINIFY;

let pkg = require('./package.json');
let banner =
`/**
 * ${pkg.description}
 * @version v${pkg.version}
 * @link ${pkg.homepage}
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */`;

let uglifyOpts = { output: {} };
// retain multiline comment with @license
uglifyOpts.output.comments = (node, comment) =>
comment.type === 'comment2' && /@license/i.test(comment.value);

let plugins = [
  nodeResolve({ jsnext: true }),
  progress(),
  sourcemaps(),
  commonjs(),
];

if (MINIFY) plugins.push(uglify(uglifyOpts));
if (MINIFY) plugins.push(visualizer({ sourcemap: true }));

let extension = MINIFY ? '.min.js' : '.js';

// Suppress this error message... there are hundreds of them. Angular team says to ignore it.
// https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
function onwarn(warning) {
  if (warning.code === 'THIS_IS_UNDEFINED') return;
  console.error(warning.message);
}

function isExternal(id) {
  // @uirouter/core and ui-router-rx should be external
  // All rxjs and @angular/* should be external
  // except for @angular/router/src/router_config_loader
  let externals = [
    /^ui-router-rx/,
    /^@uirouter\/core/,
    /^rxjs/,
    /^@angular\/(?!router\/src\/router_config_loader)/,
  ];
  return externals.map(regex => regex.exec(id)).reduce((acc, val) => acc || !!val, false);
}

const CONFIG = {
  moduleName: '@uirouter/angular',
  entry: 'lib/index.js',
  dest: '_bundles/ui-router-ng2' + extension,

  sourceMap: true,
  format: 'umd',
  exports: 'named',
  plugins: plugins,
  banner: banner,

  onwarn: onwarn,
  external: isExternal,

  globals: {
    'rxjs/ReplaySubject': 'Rx',

    // Copied these from @angular/router rollup config
    'rxjs/BehaviorSubject': 'Rx',
    'rxjs/Observable': 'Rx',
    'rxjs/Subject': 'Rx',
    'rxjs/Subscription': 'Rx',
    'rxjs/util/EmptyError': 'Rx',

    'rxjs/observable/from': 'Rx.Observable',
    'rxjs/observable/fromPromise': 'Rx.Observable',
    'rxjs/observable/forkJoin': 'Rx.Observable',
    'rxjs/observable/of': 'Rx.Observable',

    'rxjs/operator/toPromise': 'Rx.Observable.prototype',
    'rxjs/operator/map': 'Rx.Observable.prototype',
    'rxjs/operator/mergeAll': 'Rx.Observable.prototype',
    'rxjs/operator/concatAll': 'Rx.Observable.prototype',
    'rxjs/operator/mergeMap': 'Rx.Observable.prototype',
    'rxjs/operator/reduce': 'Rx.Observable.prototype',
    'rxjs/operator/every': 'Rx.Observable.prototype',
    'rxjs/operator/first': 'Rx.Observable.prototype',
    'rxjs/operator/catch': 'Rx.Observable.prototype',
    'rxjs/operator/last': 'Rx.Observable.prototype',
    'rxjs/operator/filter': 'Rx.Observable.prototype',
    'rxjs/operator/concatMap': 'Rx.Observable.prototype',
    
    '@uirouter/core': '@uirouter/core',
    'ui-router-rx': 'ui-router-rx',
    '@angular/core': 'ng.core',
    '@angular/common': 'ng.common',
  }
};

export default CONFIG;
