'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');


var paths = {
  sass: ['./scss/**/*.scss'],
  scripts: "./src/app/**/*.js",
  styles: "./src/app/**/*.sass"

};

gulp.task('default', ['sass','scripts','styles'],function(){
  gulp.watch(paths.sass, ['sass']);
   gulp.watch(paths.scripts, ['scripts']);
   gulp.watch(paths.styles, ['styles']);
});
gulp.task('styles', function(done){
  gulp.src(paths.styles)
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
   .on('end', done);
});

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('scripts', function(done) {
  gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))

    .pipe(concat('main.js'))

    .pipe(gulp.dest('./www/js/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('./www/js/'))
    .on('end', done);


});

gulp.task('watch', ['sass','scripts','styles'],function() {
gulp.watch(paths.sass, ['sass']);
gulp.watch(paths.scripts, ['scripts']);
gulp.watch(paths.styles, ['styles']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
