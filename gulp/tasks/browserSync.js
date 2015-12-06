'use strict';

var config          = require('../config'),
    gulp            = require('gulp'),
    bs              = require('browser-sync').create('bs1');

// Watch files with BrowserSync server
gulp.task('serve', ['html:dev', 'scripts', 'styles', 'bs'], function() {
   gulp.watch(config.styles, ['styles'], bs.reload);
   gulp.watch(config.scripts, ['scripts'], bs.reload);
   gulp.watch(config.templates.src, ['html'], bs.reload);
});

// BrowserSync server
gulp.task('bs', function() {
  bs.init({
      port: 8889,
      //https: true,
      server: {
          baseDir: config.root
      },
      open: false
  });
});

