var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('styles', function() {
	console.log('Hello !');
    gulp.src('/node_modules/material-design-lite/src/material-design-lite.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('/public/css'));
});

//Watch task
gulp.task('default',function() {
    gulp.watch('/node_modules/material-design-lite/src/material-design-lite.scss',['styles']);
});