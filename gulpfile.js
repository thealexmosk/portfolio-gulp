'use strict'
const gulp = require('gulp')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const pug = require('gulp-pug')
const browserSync = require('browser-sync').create()
const rename = require('gulp-rename')
const svgSprite = require('gulp-svg-sprite')

const reload = browserSync.reload

// SVG Sprite
gulp.task('sprite', function () {
  return gulp.src('./resources/svg/*.svg')
    .pipe(svgSprite({
      mode: {
        symbol: true
      }
    }))
    .pipe(gulp.dest('./resources/pug'))
})

// Compile sass files to css
gulp.task('sass', function () {
  return gulp.src('./resources/sass/main.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 15 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./public/assets/css'))
    .pipe(browserSync.reload({ stream: true }))
})

// Compile pug files to html
gulp.task('pug', () => {
  return gulp.src('resources/pug/index.pug')
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest('./public'))
})

gulp.task('js', function () {
  gulp.src('./resources/js/main.js')
    .pipe(rename('public/js/main.js'))
    .pipe(gulp.dest('./public/assets'))
})

// the working directory
gulp.task('browser-sync', ['sass', 'pug', 'js'], function () {
  browserSync.init({
    server: {
      baseDir: './public'
    }
  })
})

// Watch files comiling
gulp.task('watch', function () {
  gulp.watch('./resources/sass/*.sass', ['sass'])
  gulp.watch('./resources/pug/*.pug', ['pug'])
  gulp.watch('./public/*.html').on('change', reload)
  // gulp.watch('./assests/js/*.js', ['js']);
  gulp.watch('./public/assets/js/main.js').on('change', reload)
})

gulp.task('default', ['watch', 'browser-sync'])
