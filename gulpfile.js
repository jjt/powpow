var
  _ = require('lodash'),
  path = require('path'),
  gulp = require('gulp'),
  beep = require('beepbeep'),
  chalk = require('chalk'),
  karma = require('karma'),
  notifier = require('node-notifier'),
  webpack = require('webpack'),
  WebpackDevServer = require('webpack-dev-server'),
  webpackConfig = require('./conf/webpack.config'),
  $ = require('gulp-load-plugins')();

// Explicitly include paths for performance
var jsPathsApp = [
  './src/**/*.js*',
  './conf/**/*.js',
  '!./**/*.spec.js'
];

var jsPathsTest = [
  './src/**/*.spec.js'
];

// Plumber'd source to catch errors
// Use this in place of gulp.src()
var src = function () {
  return gulp.src.apply(gulp, Array.prototype.slice.call(arguments))
    .pipe($.plumber(function (err) {
      notifier.notify({
        title: 'Gulp ERROR',
        message: err.name
      });
      beep();
      console.log(chalk.bgRed.bold('ERROR!'));
      this.emit('end');
    }));
}

//------------------------------------------------------------------------------
// Webpack (WIP - non-functional, use 'npm start')
//------------------------------------------------------------------------------

gulp.task('webpack:dev', function (done) {
 // Start a webpack-dev-server.
  var devServer = new WebpackDevServer(webpack(webpackConfig), {
    contentBase: path.resolve(webpackConfig.output.path),
    hot: true,
    progress: true,
    inline: true
  });

  devServer.listen(8080, "0.0.0.0", function(err) {
    if (err) {
      throw new $.util.PluginError("webpack-dev-server", err);
    }
    $.util.log("[webpack-dev-server]", "http://localhost:8080");
    done();
  });
});

//------------------------------------------------------------------------------
// ESLint
//------------------------------------------------------------------------------
gulp.task('eslint:app', function () {
  return src(jsPathsApp)
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failOnError())
});

gulp.task('eslint:test', function () {
  return src(jsPathsTest)
    .pipe($.eslint({
      rules: {
        'no-unused-expressions': 0
      }
    }))
    .pipe($.eslint.format())
    .pipe($.eslint.failOnError())
});

gulp.task('eslint:watch', function () {
  gulp.watch(jsPathsApp, ['eslint:app']);
  gulp.watch(jsPathsTest, ['eslint:test']);
});

//------------------------------------------------------------------------------
// Testing (Karma)
//------------------------------------------------------------------------------
var confPath = process.env.PWD + '/conf';

gulp.task('test', function (done) {
  karma.server.start({configFile: confPath + '/karma.conf.js', singleRun: true}, done);
});

gulp.task('test:watch', function (done) {
  karma.server.start({configFile: confPath + '/karma.conf.js', singleRun: false}, done);
});

gulp.task('test:coverage', function (done) {
  karma.server.start({configFile: confPath + '/karma.coverage.conf.js', singleRun: true}, done);
});

//------------------------------------------------------------------------------
// Default tasks/watch
//------------------------------------------------------------------------------
gulp.task('default', ['eslint:watch', 'test:watch']);
