var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');

// my-log - something we name
//gulp.task('my-log', function(){
//	gutil.log('Workflows are awesome!');
//});

//var coffeeSources = ['components/coffee/*.coffee']; // include all
var coffeeSources = ['components/coffee/tagline.coffee'];

gulp.task('coffee-test', function(){
	gulp.src(coffeeSources)
		.pipe(coffee({bare: true})
			.on('error', gutil.log))
		.pipe(gulp.dest('components/scripts'));
});