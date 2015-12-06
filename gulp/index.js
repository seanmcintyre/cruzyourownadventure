'use strict';

var fs              = require('fs'),
    path            = require('path'),
    gulp			= require('gulp'),
    tasks           = fs.readdirSync('./gulp/tasks/').filter(task => /(\.(js)$)/i.test(path.extname(task)));

tasks.forEach(function(task) {
    require('./tasks/' + task);
});

gulp.task('build:dev', ['html:dev', 'scripts', 'styles']);
gulp.task('build:prod', ['html:prod', 'scripts', 'styles']);