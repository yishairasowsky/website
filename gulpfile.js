const gulp = require('gulp');
const del = require('del');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const cssmin = require('gulp-cssmin');
const uglify = require('gulp-uglify');
const less = require('gulp-less');
const merge = require('merge-stream');

const paths = {};
paths.dist = './_site/';
paths.concatJsDest = './js/bit.min.js';
paths.libDir = './lib/';
paths.npmDir = './node_modules/';
paths.cssDir = './css/';
paths.jsDir = './js/';
paths.lessDir = './less/';

function cleanCss() {
    return del(paths.cssDir);
}

function cleanJs() {
    return del(paths.concatJsDest);
}

function cleanLib() {
    return del(paths.libDir);
}

function cleanDist() {
    return del(paths.dist);
}

function clean(cb) {
    return gulp.parallel(cleanJs, cleanCss, cleanDist, cleanLib)(cb);
}

function minJs() {
    return gulp.src([
        paths.jsDir + '**/*.js',
        '!' + paths.jsDir + '**/*.min.js'
    ], { base: '.' })
        .pipe(concat(paths.concatJsDest))
        .pipe(uglify())
        .pipe(gulp.dest('.'));
}

function minCss() {
    return gulp.src([paths.cssDir + '**/*.css', '!' + paths.cssDir + '**/*.min.css'], { base: '.' })
        .pipe(cssmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('.'));
}

function min(cb) {
    return gulp.parallel(minCss, gulp.series(cleanJs, minJs))(cb);
}

function lib() {
    var libs = [
        {
            src: [
                paths.npmDir + 'bootstrap/dist/**/fonts/*',
                paths.npmDir + 'bootstrap/dist/**/js/bootstrap.min.js',
                paths.npmDir + 'bootstrap/dist/**/css/bootstrap.min.css'
            ],
            dest: paths.libDir + 'bootstrap'
        },
        {
            src: [
                paths.npmDir + 'font-awesome/**/css/font-awesome.min.css',
                paths.npmDir + 'font-awesome/**/fonts/*'
            ],
            dest: paths.libDir + 'font-awesome'
        },
        {
            src: paths.npmDir + 'jquery/dist/jquery.min.js',
            dest: paths.libDir + 'jquery'
        }
    ];

    var tasks = libs.map((lib) => {
        return gulp.src(lib.src).pipe(gulp.dest(lib.dest));
    });

    return merge(tasks);
}

function compileLess() {
    return gulp.src(paths.lessDir + 'styles*.less')
        .pipe(less())
        .pipe(gulp.dest(paths.cssDir));
}

function lessWatch() {
    gulp.watch(paths.lessDir + '*.less', gulp.series(compileLess, minCss));
}

exports.build = gulp.series(clean, gulp.parallel(gulp.series(cleanLib, lib), compileLess), min);
exports['clean:js'] = cleanJs;
exports['clean:css'] = cleanCss;
exports['clean:dist'] = cleanDist;
exports['clean:lib'] = cleanLib;
exports.clean = clean;
exports['min:css'] = minCss;
exports['min:js'] = gulp.series(cleanJs, minJs);
exports.min = min;
exports.lib = gulp.series(cleanLib, lib);
exports.less = compileLess;
exports['less:watch'] = lessWatch;
