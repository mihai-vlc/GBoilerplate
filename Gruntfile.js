/**
 *  GBoilerplate - Grunt Setup
 *  Author: Mihai Ionut Vilcu
 *  License: MIT
 */

'use strict';

/**
 * Dependencies
 */
var path = require('path');
var exec = require("child_process").exec;

/**
 * Livereload and connect variables
 */
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({
  port: LIVERELOAD_PORT
});
var livereload; // separate process for livereload
var mountFolder = function (connect, dir) {
  return connect.static(path.resolve(dir));
};
/**
 * Other settings
 */
var INCLUDE_LOCAL_FIRST = true;
var SPAWN = false;

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
  var CONFIG = {

    pkg: grunt.file.readJSON('package.json'),

    /**
     * Set project info
     */
    project: {
      src: 'src',
      app: 'dist',
      dist_assets: '<%= project.app %>/assets',
      dev_assets: '<%= project.src %>/assets',
      partials_path : '<%= project.src %>/pages/partials',
      scss: [
        '<%= project.dev_assets %>/scss/**/*.scss'
      ],
      js: [
        '<%= project.src %>/assets/js/**/*.js',
        '!<%= project.src %>/assets/js/**/*.lib.js'
      ]
    },

    /**
     * Project banner
     * Dynamically appended to CSS/JS files
     * Inherits text from package.json
     */
    tag: {
      banner: '/*!\n' +
              ' * <%= pkg.name %>\n' +
              ' * @author <%= pkg.author %>\n' +
              ' * @version <%= pkg.version %>\n' +
              ' */\n'
    },

    /**
     * Connect port/livereload
     * https://github.com/gruntjs/grunt-contrib-connect
     * Starts a local webserver and injects
     * livereload snippet
     */
    connect: {
      options: {
        port: 9000,
        hostname: '*'
      },
      livereload: {
        options: {
          middleware: function (connect, options) {
            return [lrSnippet, mountFolder(connect, '.')];
          }
        }
      }
    },

    /**
     * Concatenate JavaScript files
     * https://github.com/gruntjs/grunt-contrib-concat
     * Imports all .js files and appends project banner
     */
    concat: {
      dev_js: {
        files: {
          '<%= project.dist_assets %>/js/scripts.js': '<%= project.js %>',
        }
      },
      options: {
        stripBanners: true,
        nonull: true
      }
    },

    /**
     * Uglify (minify) JavaScript files
     * https://github.com/gruntjs/grunt-contrib-uglify
     * Compresses and minifies all JavaScript files into one
     */
    uglify: {
      options: {
        banner: '<%= tag.banner %>'
      },
      dist: {
        files: {
          '<%= project.dist_assets %>/js/scripts.min.js': '<%= project.dist_assets %>/js/scripts.js'
        }
      }
    },

    /**
     * Compile Sass/SCSS files + compass support
     * https://github.com/gruntjs/grunt-contrib-compass
     * Compiles all Sass/SCSS files
     */
    compass: {
      dist: {
        options: {
          sassDir: '<%= project.dev_assets %>/scss',
          cssDir: '<%= project.dist_assets %>/css',
          noLineComments: true,
          force: true
        }
      },
      dev: {
        options: {
          sassDir: '<%= project.dev_assets %>/scss',
          cssDir: '<%= project.dist_assets %>/css',
          sourcemap: true,
          noLineComments: true
        }
      }
     },

    /**
     * Autoprefixer
     * Adds vendor prefixes automatically
     * https://github.com/nDmitry/grunt-autoprefixer
     */
    autoprefixer: {
      options: {
        browsers: [
          'last 2 version',
          'safari 6',
          'ie 8',
          'opera 12.1',
          'ios 6',
          'android 4'
        ]
      },
      dev: {
        options: {
          map: true
        },
        src: '<%= project.dist_assets %>/css/main.css',
        dest: '<%= project.dist_assets %>/css/main.css'
      },
      dist: {
        src: '<%= project.dist_assets %>/css/main.css',
        dest: '<%= project.dist_assets %>/css/main.css'
      }
    },

    /**
     * Wrap
     * It will wrap the pages with the header and footer
     */
    wrap: {
        html: {
            header: '<%= project.src %>/pages/header.tmpl',
            footer: '<%= project.src %>/pages/footer.tmpl',
            src: [
                '<%= project.src %>/pages/content/{,*/}*.html'
            ],
            current_file: '', // will be used to hold the edited file from watch
            dest: '<%= project.app %>'   // destination *directory*, probably better than specifying same file names twice
        }
    },

    /**
     * CSSMin
     * CSS minification
     * https://github.com/gruntjs/grunt-contrib-cssmin
     */
    cssmin: {
      dist: {
        options: {
          banner: '<%= tag.banner %>',
          keepSpecialComments : 0
        },
        files: {
            '<%= project.dist_assets %>/css/main.min.css': ['<%= project.dist_assets %>/css/main.css'],
            '<%= project.dist_assets %>/css/all.min.css': ['<%= project.dist_assets %>/css/{,*/}*.css', '!<%= project.dist_assets %>/css/{main,all}.min.css']
        }
      }
    },

    /**
     * Opens the web server in the browser
     * https://github.com/jsoverson/grunt-open
     */
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port + "/" + project.app %>'
      }
    },
    /**
     * Uploads files to an ftp server
     * https://github.com/zonak/grunt-ftp-deploy
     */
    'ftp-deploy': {
      dist: {
        auth: {
          host: 'localhost',
          port: 21,
          authKey: 'ftp'
        },
        src: '<%= project.app %>',
        dest: '_dist'
      }
    },

    /**
     * Cleans the min files when you enter the developer mode
     * https://github.com/gruntjs/grunt-contrib-clean
     */
    clean: ['<%= project.dist_assets %>/css/main.min.css', '<%= project.dist_assets %>/css/main.min.map', , '<%= project.dist_assets %>/css/all.min.css', '<%= project.dist_assets %>/js/scripts.min.js'],

    /**
     * Copy some files that don't need to be handled (like modernizr, fonts)
     * https://github.com/gruntjs/grunt-contrib-copy
     */
    copy : {
        bin : {
            files: [{
                expand : true,
                cwd: '<%= project.src %>',
                src : ['**/*.{webp,svg,otf,ttf,eot,woff,ico,lib.js}'],
                dest: "<%= project.app %>"
            }]
        },
        css : {
            files: [{
                expand : true,
                cwd: '<%= project.src %>',
                src : ['**/*.css'],
                dest: "<%= project.app %>"
            }]
        }
    },
    /**
     * Compress the images
     * https://github.com/gruntjs/grunt-contrib-imagemin
     */
    imagemin: {
        dev: {
            options: {
                optimizationLevel: 3
            },
            files: [{
                expand: true,
                cwd: '<%= project.src %>',
                src: ['**/*.{png,jpg,jpeg,gif}'],
                dest: "<%= project.app %>"
            }]
        }
    },

    /**
     * Runs tasks against changed watched files
     * https://github.com/gruntjs/grunt-contrib-watch
     * Watching development files and run concat/compile tasks
     * Livereload the browser once complete
     */
    watch: {
      wrap: {
        files: ['<%= project.src %>/pages/content/**/*.html',
                '<%= project.partials_path %>/**/*.html',
                '<%= project.src %>/pages/footer.tmpl',
                '<%= project.src %>/pages/header.tmpl'
        ],
        tasks: ['wrap'],
        options: {
          spawn: SPAWN
        }
      },
      imagemin : {
        files : '<%= project.dev_assets %>/**/*.{png,jpg,jpeg,gif}',
        tasks : ['imagemin']
      },
      concat_js: {
        files: ['<%= project.js %>'],
        tasks: ['concat:dev_js']
      },
      compass: {
        files: '<%= project.dev_assets %>/scss/**/*.{scss,sass}',
        tasks: ['compass:dev', 'autoprefixer:dev']
      },
      copy: {
        files: '<%= project.dev_assets %>/**/*.{webp,svg,otf,ttf,eot,woff,ico,lib.js}',
        tasks: ['copy:bin']
      },
      copy_css: {
        files: '<%= project.dev_assets %>/**/*.css',
        tasks: ['copy:css']
      }
    },
    startLivereload: {
        dev:{}
    }
  };


  // init grunt
  grunt.initConfig(CONFIG);

  grunt.registerMultiTask("startLivereload", "Starts livereload in a different process based on gruntfile-livereload", function(){
      // start livereload over the dist files
      livereload = exec("grunt watch --gruntfile Gruntfile-Livereload.js");
      console.log("Starting livereload(refresh the page first time)...");
  });


  grunt.registerMultiTask('wrap', 'Wraps source files with specified header and footer', function() {

        var data = this.data,
            dest = data.dest,
            files = [data.current_file], // just the current one, works if spawn == false
            sep = data.sep || "\n\n";

        if(wrapAll(data))
          files = this.filesSrc; // all the html files

        files.forEach(function(f) {
            // make the file name available inside the templates
            grunt.current_file = path.basename(f);
            grunt.current_file_full = f;

            // ignore partials
            if(INCLUDE_LOCAL_FIRST && (grunt.current_file[0] == "_"))
              return;

            // grab some data
            var p = dest + '/' + path.relative(grunt.config("project.src") + "/pages/content",f),
                header = grunt.template.process(grunt.file.read(data.header)),
                footer = grunt.template.process(grunt.file.read(data.footer)),
                contents = grunt.template.process(grunt.file.read(f));

            // join the content
            grunt.file.write(p, header + sep + contents + sep + footer);
            grunt.log.writeln('File "' + p + '" created.');
        });
  });
  // provide the current edited file to the wrap task (only works with spawn false)
  grunt.event.on('watch', function(action, filepath, target) {
      grunt.config("wrap.html.current_file", filepath);
  });
  /**
   * Includes the content of a partial file
   */
  grunt.include = function (file_name, include_path) {
      if(!include_path)
        include_path = path.dirname(path.normalize(grunt.current_file_full));

      // we first check for a local _file
      var full_path = grunt.template.process(include_path + "/" + path.dirname(file_name) + "/_" + path.basename(file_name));

      // if we can't find that, we search in the partials folder
      if(!grunt.file.exists(full_path) || !INCLUDE_LOCAL_FIRST)
        full_path = grunt.config("project.partials_path") + "/" + file_name;

      // return the content or the error message
      if(grunt.file.exists(full_path))
        return grunt.template.process(grunt.file.read(full_path));
      else {
        var message = "<pre>Error: File: `" + full_path + "` doesn't exists !</pre>";
        grunt.log.error(message);
        return message;
      }
  };

  // determine if we should compile all the files or just the current one
  function wrapAll(data) {

    var cpath = path.normalize(data.current_file);
    var current_file = path.basename(data.current_file);

    if(
        (data.current_file === '') || // is empty
        (cpath == path.normalize(data.header)) || // is header or footer
        (cpath == path.normalize(data.footer)) ||
        (cpath.indexOf(path.normalize(grunt.config("project.partials_path"))) === 0) || // is in partials folder
        (INCLUDE_LOCAL_FIRST && (current_file[0] == "_")) // is local partial
      )
      return true;
    return false;
  }


  /**
   * Default task
   * Run `grunt` on the command line
   */
  grunt.registerTask('default', [
    'clean', // clean the min files while in dev
    'compass:dev',
    'autoprefixer:dev',
    'concat:dev_js',
    'wrap',
    'copy',
    'imagemin',
    'connect',
    'open',
    'startLivereload',
    'watch'
  ]);

  /**
   * Build task
   * Run `grunt build` on the command line
   * Then compress all JS/CSS files
   */
  grunt.registerTask('build', [
    'clean',
    'compass:dist',
    'concat:dev_js',
    'autoprefixer:dist',
    'wrap',
    'copy',
    'imagemin',
    'uglify',
    'cssmin'
  ]);

  /**
   * Ftp task
   * Run `grunt ftp` on the command line
   * It will upload build the files and upload them on the ftp.
   */
  grunt.registerTask('ftp', [
    'clean',
    'compass:dist',
    'concat:dev_js',
    'autoprefixer:dist',
    'wrap',
    'imagemin',
    'uglify',
    'cssmin',
    'ftp-deploy'
  ]);


};
