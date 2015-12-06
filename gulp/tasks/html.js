'use strict';

var config          = require('../config'),
	mustache 		= require('gulp-mustache'),
	gulp 			= require('gulp'),
    bs              = require('browser-sync').get('bs1');


gulp.task('html:prod', function() {
    htmlProcess(config.templates.src, config.sourceURL.remote);
});

gulp.task('html:dev', function() {
    htmlProcess(config.templates.src, config.sourceURL.local);
});

function htmlProcess(htmlFile, sourceURL) {
	return gulp.src(htmlFile)
	   	.pipe(mustache({
	   		"SRC_ROOT": sourceURL
	   	}, {
			extension: '.html'
		}))
	    .pipe(gulp.dest(config.templates.dest))
	    .pipe(bs.stream({match: '**/*.css'}));
}