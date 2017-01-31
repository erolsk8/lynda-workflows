// Gulp is like pipe system, you just run something through it and get stuff done...
// so set input, set task and set destination

var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var compass = require('gulp-compass');
var connect = require('gulp-connect');

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
var sassSources = ['components/sass/style.scss'];

gulp.task('coffee-test', function(){
	gulp.src(coffeeSources)
		.pipe(coffee({bare: true})
			.on('error', gutil.log))
		.pipe(gulp.dest('components/scripts'));
});




// Task to concatenated JS files
// this doesn't really work, because it doesn't go through browserify
//gulp.task('concat-js', function(){
//	gulp.src(jsSources) // specify source
//		.pipe(concat('script.js')) // do some command
//		.pipe(gulp.dest('builds/development/js')); // specify destination
//});

// Task to concatenated JS files - WITH BROWSERIFY
gulp.task('concat-js-browserify', function(){
	gulp.src(jsSources) // specify source
		.pipe(concat('script.js')) // do some command
		.pipe(browserify())// require libraries that we need (jQuery, etc.)
		.pipe(gulp.dest('builds/development/js')) // specify destination
		.pipe(connect.reload()); // reload page when JS files are changed (when script.js is updated)
});

// Task to concatenated JS files - WITH COFFEE AS DEPENDENCY (to run 'coffee-test' before 'concat-js-3')
//gulp.task('concat-js-3', ['coffee-test'], function(){
//	gulp.src(jsSources) // specify source
//		.pipe(concat('script.js')) // do some command
//		.pipe(browserify())// require libraries that we need (jQuery, etc.)
//		.pipe(gulp.dest('builds/development/js')); // specify destination
//});




// Task for Compass / SASS
gulp.task('my-compass', function(){
	gulp.src(sassSources) // specify source
		.pipe(compass({
			sass: 'components/sass',
			images: 'builds/development/images',
			style: 'expanded', // compressed - for production
			line_comments: true
		})) // do some command
		.on('error', gutil.log)
		.pipe(gulp.dest('builds/development/css')) // specify destination
		.pipe(connect.reload()); // reload page when SCSS files are compiled with compass (when style.css is updated)
});






// New task called 'all', which would run all tasks passed in second parameter
gulp.task('all', ['coffee-test', 'concat-js-browserify', 'my-compass']);








// Monitor for changes and run automatically
gulp.task('my-watch', function(){
	// It doesn't work with only this line, because it didn't went through "browserify", which is done with 'concat-js-browserify'
	// - When: something in "coffeeSources" (files (tagline.coffee for example)) changes,
	// - Run: 'coffee-test'
	gulp.watch(coffeeSources, ['coffee-test']);

	// - When: jsSources files are changed (caused by changing tagline.coffee for example and then previous line changes JS files),
	// - Run: 'concat-js-browserify'
	gulp.watch(jsSources, ['concat-js-browserify']);


	// SASS changes
	gulp.watch('components/sass/*.scss', ['my-compass']);
});






// Task to start up the server using 'gulp-connect' plugin, which would also AUTO-RELOAD page when files are changed
gulp.task('my-connect', function(){
	connect.server({
		root: 'builds/development/',
		livereload: true
	});
});





// When task is named 'default', that one will be called when command "gulp" is called without any task name or anything
gulp.task('default', ['coffee-test', 'concat-js-browserify', 'my-compass', 'my-connect', 'my-watch']);