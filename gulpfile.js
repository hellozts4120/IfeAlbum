var gulp = require('gulp')
var uglify = require('gulp-uglify')
var minifycss = require('gulp-minify-css');
var rename = require("gulp-rename");

gulp.task('script', function() {
    gulp.src('build/IfeAlbum.js')
        .pipe(uglify())
        .pipe(rename(function(path) {
            path.basename += ".min";
            path.extname = ".js";
        }))
        .pipe(gulp.dest('build/'))
})

gulp.task('css', function(){
    gulp.src('build/IfeAlbum.css')
    .pipe(minifycss())
    .pipe(rename(function(path) {
        path.basename += ".min";
        path.extname = ".css";
    }))
    .pipe(gulp.dest('build/'))
});


gulp.task('default', ['script', 'css'])