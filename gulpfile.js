var _ = require('lodash');
var gulp = require('gulp');
var beep = require('beepbeep');
var chalk = require('chalk');
var karma = require('karma');
var notifier = require('node-notifier');

var $ = require('gulp-load-plugins')();

// Explicitly include paths for performance
var jsPathsApp = [
  './app/**/*.js*',
  './lib/**/*.js*',
  './conf/**/*.js',
  '!./**/*.spec.js'
];

var jsPathsTest = [
  './app/**/*.spec.js',
  './lib/**/*.spec.js',
  './conf/**/*.spec.js'
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
// ESLint
//------------------------------------------------------------------------------
gulp.task('eslint:app', function () {
  return src(jsPathsApp)
    .pipe($.cached('eslint'))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failOnError())
});

gulp.task('eslint:test', function () {
  return src(jsPathsTest)
    .pipe($.cached('eslint'))
    .pipe($.eslint({
      rules: {
        'no-unused-expressions': 0
      }
    }))
    .pipe($.eslint.format())
    .pipe($.eslint.failOnError())
});

//------------------------------------------------------------------------------
// Testing (Karma)
//------------------------------------------------------------------------------
var karmaConf = {
  configFile: process.env.PWD + '/conf/karma.conf.js'
}
console.log(karmaConf);
gulp.task('test', function (cb) {
  karma.server.start(_.assign({ singleRun: true }, karmaConf),  cb);
});

gulp.task('test:watch', function (cb) {
  console.log("TESTSWATH");
  karma.server.start(_.assign({ singleRun: false }, karmaConf),  cb);
});


//------------------------------------------------------------------------------
// Default tasks/watch
//------------------------------------------------------------------------------
gulp.task('watch', function () {
  gulp.watch(jsPathsApp, ['eslint:app']);
  gulp.watch(jsPathsTest, ['eslint:test']);
});

gulp.task('default', ['eslint:app', 'eslint:test', 'test:watch', 'watch']);
