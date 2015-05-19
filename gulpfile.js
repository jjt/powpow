var gulp = require('gulp');
var beep = require('beepbeep');
var chalk = require('chalk');
var notifier = require('node-notifier');

var $ = require('gulp-load-plugins')();

// Explicitly include paths for performance
var jsPaths = [
  './app/**/*.js*',
  './lib/**/*.js*',
  './conf/**/*.js'
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

gulp.task('eslint', function () {
  return src(jsPaths)
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failOnError())
});

gulp.task('watch', function () {
  gulp.watch(jsPaths, ['eslint'])
});

gulp.task('default', ['eslint', 'watch']);
