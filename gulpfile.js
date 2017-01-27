// Gulp is like pipe system, you just run something through it and get stuff done...
// so set input, set task and set destination

var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');

// my-log - something we name
//gulp.task('my-log', function(){
//	gutil.log('Workflows are awesome!');
//});

//var coffeeSources = ['components/coffee/*.coffee']; // include all
var coffeeSources = ['components/coffee/tagline.coffee'];
var jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
];

gulp.task('coffee-test', function(){
	gulp.src(coffeeSources)
		.pipe(coffee({bare: true})
			.on('error', gutil.log))
		.pipe(gulp.dest('components/scripts'));
});




// Task to concatonate JS files
gulp.task('concat-js', function(){
	gulp.src(jsSources) // specify source
		.pipe(concat('script.js')) // do some command
		.pipe(gulp.dest('builds/development/js')); // specify destination
});