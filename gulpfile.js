'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const jasmine = require('gulp-jasmine');
const istanbul = require('gulp-istanbul');
const reporter = require('eslint-html-reporter');
const path = require('path');
const fs = require('fs');
const del = require('del');

//pre-test task to hook istanbul to record code coverage
gulp.task('pre-test', () => {
    return gulp.src(['index.js', 'libs/*.js'])
        .pipe(istanbul())
        .pipe(istanbul.hookRequire());
});

//task to run es lint.
gulp.task('lint', ['clean'], () => {
    return gulp.src(['index.js', 'test/*.js', 'libs/*.js','gulpfile.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.format(reporter, (results) => {
            if (!fs.existsSync('build')){
                fs.mkdirSync('build');
            }
            fs.writeFileSync(path.join(__dirname, 'build/lint-report.html'), results);
        }))
        .pipe(eslint.failAfterError());
});

//task to run tests
gulp.task('test', ['pre-test', 'lint'], () => {
    return gulp.src(['test/*.js'])
        .pipe(jasmine())
        .pipe(istanbul.writeReports({dir: 'build/coverage'}))
        .pipe(istanbul.enforceThresholds({thresholds: {global: 80}}));
});
// task clean
gulp.task('clean', () => {
    return del([
        'build/'
    ]);
});

gulp.task('default', ['clean', 'lint', 'test'], () => {
    // place code for your default task here
});