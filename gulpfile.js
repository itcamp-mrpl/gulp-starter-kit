const gulp = require('gulp');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const rollup = require('gulp-rollup');
const browserSync = require('browser-sync').create();

function html(cb) {
  gulp.src('./src/*.html')
    .pipe(gulp.dest('./build'));
  cb();
}

function css(cb) {
  gulp.src('./src/style.css')
    .pipe(sourcemaps.init())
    .pipe(postcss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build'));
  cb();
}

function js(cb) {
  gulp.src('./src/**/*.js')
    .pipe(rollup({
      input: './src/app.js',
      format: 'iife',
      sourcemap: true,
    }))
    .pipe(gulp.dest('./build'));
  cb();
}

function serve() {
  browserSync.init({
    server: {
      baseDir: './build/',
    },
  });
}

function reload(cb) {
  browserSync.reload()
  cb();
}

const build = gulp.parallel(html, css, js)

const init = gulp.series(build, serve)

function defaultTask() {
  init();

  gulp.watch('src/**/*.html', gulp.series(html, reload));

  gulp.watch('src/**/*.css', gulp.series(css, reload));

  gulp.watch('src/**/*.js', gulp.series(js, reload));
}

exports.default = defaultTask;
