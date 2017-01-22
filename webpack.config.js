var pkg = require('./package.json');
var banner = pkg.description + '\n' +
    '@version v' + pkg.version + '\n' +
    '@link ' + pkg.homepage + '\n' +
    '@license MIT License, http://www.opensource.org/licenses/MIT';

var webpack = require('webpack');
var Visualizer = require('webpack-visualizer-plugin');

module.exports = {
  entry: {
    "ui-router-ng2": "./src/index.ts",
    "ui-router-ng2.min": "./src/index.ts"
  },

  output: {
    path: __dirname + "/_bundles",
    filename: "[name].js",
    libraryTarget: "umd",
    library: "ui-router-ng2",
    umdNamedDefine: true
  },

  devtool: 'source-map',

  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.ts']
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/, minimize: true
    }),
    new webpack.BannerPlugin(banner),
    new Visualizer(),
  ],

  module: {
    loaders: [
      { test: /\.ts$/, loader: "awesome-typescript-loader" },
      { test: /\.js$/, loader: "babel-loader" },
    ]
  },

  externals: mkExternals([
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
  ])
};

function mkExternals(names) {
  return names.reduce(function (acc, name) { 
    return Object.assign(acc, mkExternal(name));
  }, {});
}

function mkExternal(name) {
  var obj = {};
  obj[name] = { root: name, amd: name, commonjs2: name, commonjs: name };
  return obj;
}
