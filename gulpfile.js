/**
 * @project bootcamp-gulp-express
 * Created by ming on 2015-11-11.
 */

// grab our gulp packages
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    less = require('gulp-less'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    path = require('path');

// create a default task and just log a message
gulp.task('default', function() {
  return gutil.log('Gulp is running!')
});

// configure the jshint task
gulp.task('jshint', function() {
  return gulp.src('main/js/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'));
});

/* updated watch task to include less */

gulp.task('watch', function() {
  gulp.watch('source/javascript/**/*.js', ['jshint']);
  gulp.watch('source/stylesheets/**/*.less', ['build-less']);
});

gulp.task('build', ['build:copy', 'build:build-tom', 'build:build-js']);

gulp.task('build:copy', function() {
  gulp.src('source/*.html').pipe(gulp.dest('public'));
  gulp.src('source/libraries/*.*').pipe(gulp.dest('public/libraries/'));
});

gulp.task('build:build-tom', function() {
  //return gulp.src('main/js/tom/**/*.js')
  return gulp.src(['source/javascripts/tom/utils/string.js', 'source/javascripts/tom/core/selection.js'])
      .pipe(sourcemaps.init())
      .pipe(concat('tom.min.js'))
    //only uglify if gulp is ran with '--type production'
    //  .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
      .pipe(uglify())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('public/javascripts'));
});


gulp.task('build:build-less', function() {
  return gulp.src('source/stylesheets/**/*.less')
      .pipe(sourcemaps.init())  // Process the original sources
      .pipe(less({
        paths: ['source/stylesheets/**/']
      }))
      .pipe(sourcemaps.write()) // Add the map to modified source.
      .pipe(gulp.dest('public/stylesheets'));
});

gulp.task('build:build-js', function() {
  gutil.log(gutil.env);
  return gulp.src('source/javascripts/**/*.js')
    //return gulp.src(['main/js/tom/utils/string.js', 'main/js/tom/core/selection.js'])
      .pipe(sourcemaps.init())
      .pipe(concat('index.min.js'))
    //only uglify if gulp is ran with '--type production'
    //  .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
      .pipe(uglify())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('public/javascripts'));
});
