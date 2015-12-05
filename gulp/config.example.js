'use strict';

var config = {
    path: './',
    root: './root/',
    assets: './root/_/',

    styles: './_src/**/*.scss',
    appScss: './_src/app.scss',

    scripts: './_src/**/*.js',
    appJs: './_src/app.js',

    templates: {
        src: './_src/**.html',
        dest: './root/'
    },

    jshint: {
        'esnext': true,
        'predef': [ 'angular', 'beforeEach', 'it', 'expect', 'describe', 'sessionStorage' ]
    }
};

module.exports = config;
