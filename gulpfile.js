var gulp = require('gulp'),
    uglify = require('gulp-uglifyjs'),
    cssmin = require('gulp-cssmin'),
    imagemin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    bowerFiles = require('gulp-bower-files'),
    zip = require('gulp-zip'),

    fs = require('fs'),
    path = require('path'),
    es = require('event-stream'),
    config = {
        ext: 'extension',
        js: 'extension/js',
        css: 'extension/css',
        images: 'extension/images/*.png',
        views: 'extension/views/*.html',
        build: 'build',
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
            .pipe(uglify())
            .pipe(concat(folder + '.js'))
            .pipe(gulp.dest(config.build));
    }));
});

gulp.task('css', function() {
    return es.concat.apply(null, getFolders(config.css).map(function(folder) {
        return gulp.src(path.join(config.css, folder, '*.css'))
            .pipe(cssmin())
            .pipe(concat(folder + '.css'))
            .pipe(gulp.dest(config.build));
    }));
});


// Compress static images
gulp.task('images', function() {
    return gulp.src(config.images)
    // Pass in options to the task
    .pipe(imagemin({
        optimizationLevel: 5
    }))
        .pipe(gulp.dest(path.join(config.build, 'images')));
});

gulp.task('bower-files', function() {
    bowerFiles().pipe(gulp.dest(config.build));
});

// Copy static files
gulp.task('html', function() {
    return gulp.src(config.views)
        .pipe(gulp.dest(config.build));
});

gulp.task('statics', ['html'], function() {
    return gulp.src('manifest.json')
        .pipe(gulp.dest(config.build));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch(config.js + '/**/*.js', ['js']);
    gulp.watch(config.css + '**/*.css', ['css']);
    gulp.watch(config.images, ['images']);
    gulp.watch(config.views, ['html']);
});

// builds the extension
gulp.task('build', ['statics', 'js', 'css', 'images', 'bower-files']);

gulp.task('pack', ['build'], function() {
    return gulp.src(path.join(config.build, '**/*'))
        .pipe(zip(config.manifest.name + ' [' + config.manifest.version + '].zip'))
        .pipe(gulp.dest(config.packages));
});

gulp.task('default', ['build', 'watch']);
