'use strict';

/**
 * Livereload and connect variables
 */
var LIVERELOAD_PORT = 35729;

/**
 * Grunt module
 */
module.exports = function (grunt) {
  /**
   * Dynamically load npm tasks
   */
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  /**
   * Grunt config
   */
  grunt.initConfig({

    /**
     * Set project info
     */
    project: {
      src: 'src',
      app: 'dist',
      dist_assets: '<%= project.app %>/assets',
      dev_assets: '<%= project.src %>/assets',
      scss: [
        '<%= project.dev_assets %>/scss/*.scss'
      ],
      js: [
        '<%= project.src %>/assets/js/{,*/}*.js',
        '!<%= project.src %>/assets/js/{,*/}*.lib.js'
      ],
      css: [
        '<%= project.src %>/assets/css/{,*/}*.css',
        '!<%= project.src %>/assets/css/{,*/}*.lib.css'
      ]
    },

    /**
     * Runs tasks against changed watched files
     * https://github.com/gruntjs/grunt-contrib-watch
     * Watching development files and run concat/compile tasks
     * Livereload the browser once complete
     */
    watch: {
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%= project.app %>/{,*/}*.html',
          '<%= project.dist_assets %>/css/*.css',
          '<%= project.dist_assets %>/js/{,*/}*.js',
          '<%= project.dist_assets %>/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    }
  }); // end initConfig



};
