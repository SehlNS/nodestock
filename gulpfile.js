const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCss = require('gulp-clean-css');

const cssSrc = "./content/css";
const sassSrc = "./content/sass";
 
gulp.task('sass:compile', () =>
    gulp.src(sassSrc + "/styles.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(cleanCss())
        .pipe(gulp.dest(cssSrc))
);