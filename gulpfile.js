var gulp = require('gulp'),
    uglify = require('gulp-uglifyjs'),
    cssmin = require('gulp-cssmin'),
    imagemin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    bowerFiles = require('main-bower-files'),
    zip = require('gulp-zip'),
    gutil = require('gulp-util'),

    fs = require('fs'),
    path = require('path'),
    es = require('event-stream'),
    config = {
        ext: 'extension',
        js: 'extension/js',
        css: 'extension/css',
        images: 'extension/images/*.png',
        views: 'extension/views/*.html',
        partials: 'extension/partials/*.html',
        build: 'build',
        build_js: 'build/js',
        build_lib: 'build/js/lib',
        build_css: 'build/css',
        build_img: 'build/images',
        packages: 'packages',
        manifest: require('./extension/manifest.json')
    };

// Function that returns an array of all of the
// directories within the given directory

function getFolders(dir) {
    // Grab all files & folders, then filter out the ones that
    // aren't directories (i.e. the files)
    return fs.readdirSync(dir).filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

// uglify js
gulp.task('js', function() {
    return es.concat.apply(null, getFolders(config.js).map(function(folder) {
        return gulp.src(path.join(config.js, folder, '*.js'))
            .pipe(uglify()
                .on('error', gutil.log))
            .pipe(concat(folder + '.js'))
            .pipe(gulp.dest(config.build_js));
    }));
});

// Minify CSS
gulp.task('css', function() {
    return es.concat.apply(null, getFolders(config.css).map(function(folder) {
        return gulp.src(path.join(config.css, folder, '*.css'))
            .pipe(cssmin())
            .pipe(concat(folder + '.css'))
            .pipe(gulp.dest(config.build_css));
    }));
});


// Compress images
gulp.task('images', function() {
    return gulp.src(config.images)
        .pipe(imagemin({
            optimizationLevel: 5
        }))
        .pipe(gulp.dest(config.build_img));
});

// Copy bower files
gulp.task('bower-files', function() {
    gulp.src(bowerFiles())
        .pipe(gulp.dest(config.build_lib));

    gulp.src(path.join(config.ext, 'bower_components', 'angular', 'angular-csp.css'))
        .pipe(gulp.dest(config.build_css));
});

// Copy static files
gulp.task('html', function() {
    return gulp.src(config.views)
        .pipe(gulp.dest(config.build));
});

gulp.task('partials', function() {
    return gulp.src(config.partials)
        .pipe(gulp.dest(path.join(config.build, 'partials')));
});

gulp.task('statics', ['html', 'partials'], function() {
    return gulp.src(path.join(config.ext, 'manifest.json'))
        .pipe(gulp.dest(config.build));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch(config.js + '/**/*.js', ['js']);
    gulp.watch(config.css + '/**/*.css', ['css']);
    gulp.watch(config.images, ['images']);
    gulp.watch(config.views, ['html']);
    gulp.watch(config.partials, ['partials']);
});

// builds the extension
gulp.task('build', ['statics', 'js', 'css', 'images', 'bower-files']);

// Packs the extension for uploading to the web store
gulp.task('pack', ['build'], function() {
    return gulp.src(path.join(config.build, '**/*'))
        .pipe(zip(config.manifest.name + ' [' + config.manifest.version + '].zip'))
        .pipe(gulp.dest(config.packages));
});

gulp.task('default', ['build', 'watch']);
