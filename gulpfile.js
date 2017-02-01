// Gulp is like pipe system, you just run something through it and get stuff done...
// so set input, set task and set destination

var gulp = require('gulp');
var gulpUtil = require('gulp-util'); // To show messages with gulpUtil.log
var coffee = require('gulp-coffee'); // To compile .coffee files to .js files
var concat = require('gulp-concat'); // To compile multiple .js files to single .js file
var browserify = require('gulp-browserify'); // To avoid "'required' is not defined" error and make it work in browsers :) and actually to load dependencies (jQuery and stuff)
var compass = require('gulp-compass'); // To compile .scss files to .css files
var connect = require('gulp-connect'); // To create server (and access through http://localhost:8080 avoiding some "not on same server address" errors) and to enable auto-reload in browser
var gulpIf = require('gulp-if'); // To add gulp "if" statements, i.e.  .pipe(gulpIf(condition, uglify()))
var uglify = require('gulp-uglify'); // Plugin and JS library to control how JS code will be minified
var minifyHtml = require('gulp-minify-html'); // Plugin and JS library to control how JS code will be minified

var env,
	coffeeSources,
	jsSources,
	sassSources,
	htmlSources,
	jsonSources,
	outputDir,
	sassStyle;


// Set node environment variable, if it's not set (in terminal or somewhere) it will be 'development'
// It can be changed in terminal, and "gulp" part is to actually run gulp (with 'default' task):
// $ NODE_ENV=production gulp
env = process.env.NODE_ENV || 'development';


// Modify how output is used based on "env" variable
if(env === 'development') {
	outputDir = 'builds/development/';
	sassStyle = 'expanded';
} else {
	outputDir = 'builds/production/';
	sassStyle = 'compressed';
}


// my-log - something we name
//gulp.task('my-log', function(){
//	gulpUtil.log('Workflows are awesome!');
//});

//coffeeSources = ['components/coffee/*.coffee']; // include all
coffeeSources = ['components/coffee/tagline.coffee'];
jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
];
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];
jsonSources = [outputDir + 'js/*.json'];




gulp.task('coffee-test', function(){
	gulp.src(coffeeSources)
		.pipe(coffee({bare: true})
			.on('error', gulpUtil.log))
		.pipe(gulp.dest('components/scripts'));
});




// Task to concatenated JS files
// this doesn't really work, because it doesn't go through browserify
//gulp.task('concat-js', function(){
//	gulp.src(jsSources) // specify source
//		.pipe(concat('script.js')) // do/execute some command
//		.pipe(gulp.dest(outputDir + 'js')); // specify destination
//});

// Task to concatenated JS files - WITH BROWSERIFY
gulp.task('concat-js-browserify', function(){

	// Whenever we concatenate JS files...

	gulp.src(jsSources) // specify source
		.pipe(concat('script.js')) // do/execute some command
		.pipe(browserify())// require libraries that we need (jQuery, etc.)
		.pipe(gulpIf(env === 'production', uglify()))// pipe to gulpIf, in order to execute uglify() only when 'gulp-if' condition is true
		.pipe(gulp.dest(outputDir + 'js')) // specify destination
		.pipe(connect.reload()); // reload page when JS files are changed (when script.js is updated)
});

// Task to concatenated JS files - WITH COFFEE AS DEPENDENCY (to run 'coffee-test' before 'concat-js-3')
//gulp.task('concat-js-3', ['coffee-test'], function(){
//	gulp.src(jsSources) // specify source
//		.pipe(concat('script.js')) // do some command
//		.pipe(browserify())// require libraries that we need (jQuery, etc.)
//		.pipe(gulp.dest(outputDir + 'js')); // specify destination
//});




// Task for Compass / SASS
gulp.task('my-compass', function(){
	gulp.src(sassSources) // specify source
		.pipe(compass({
			sass: 'components/sass',
			images: outputDir + 'images',
			//style: 'expanded', // compressed - for production
			style: sassStyle,
			line_comments: true
		})) // do some command
		.on('error', gulpUtil.log)
		.pipe(gulp.dest(outputDir + 'css')) // specify destination
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

	// HTML changes
	//gulp.watch(htmlSources, ['html-change']);

	// Added later (minify HTML)
	gulp.watch('builds/development/*.html', ['html-change']);

	// JSON changes
	gulp.watch(jsonSources, ['json-change']);
});






// Task to start up the server using 'gulp-connect' plugin, which would also AUTO-RELOAD page when files are changed
gulp.task('my-connect', function(){
	connect.server({
		root: outputDir,
		livereload: true
	});
});



// Reload page when HTML is changed
gulp.task('html-change', function(){
	//gulp.src(htmlSources)
	gulp.src('builds/development/*.html') // Added later (minify HTML)

		// Added later to minify HTML
		.pipe(gulpIf(env === 'production', minifyHtml()))
		.pipe(gulpIf(env === 'production', gulp.dest(outputDir)))

		.pipe(connect.reload());
});



// Reload page when JSON files are changed (.../builds/development/js/data.json)
gulp.task('json-change', function(){
	gulp.src(jsonSources)
		.pipe(connect.reload());
});




// When task is named 'default', that one will be called when command "gulp" is called without any task name or anything
gulp.task('default', ['html-change', 'json-change', 'coffee-test', 'concat-js-browserify', 'my-compass', 'my-connect', 'my-watch']);