'use strict';

/**
 * Livereload and connect variables
 */
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({
  port: LIVERELOAD_PORT
});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};


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

    pkg: grunt.file.readJSON('package.json'),

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
          middleware: function (connect) {
            return [lrSnippet, mountFolder(connect, 'dist')];
          }
        }
      }
    },

    /**

    /**
     * Concatenate JavaScript files
     * https://github.com/gruntjs/grunt-contrib-concat
     * Imports all .js files and appends project banner
     */
    concat: {
      dev_css: {
        files: {
          '<%= project.dist_assets %>/css/main.css': '<%= project.css %>',
        }
      },
      dev_js: {
        files: {
          '<%= project.dist_assets %>/js/scripts.js': '<%= project.js %>',
        }
      },
      options: {
        stripBanners: true,
        nonull: true,
        banner: '<%= tag.banner %>'
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
          cssDir: '<%= project.dev_assets %>/css',
          noLineComments : true
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
        files: {
          '<%= project.dist_assets %>/css/main.css': ['<%= project.dist_assets %>/css/main.css']
        }
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
            '<%= project.dist_assets %>/css/main.min.css': ['<%= project.dist_assets %>/css/main.css']
        }
      }
    },

    /**
     * Opens the web server in the browser
     * https://github.com/jsoverson/grunt-open
     */
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
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
    clean: ['<%= project.dist_assets %>/css/main.min.css', '<%= project.dist_assets %>/js/scripts.min.js'],

    /**
     * Copy some files that don't need to be handled (like modernizr, fonts)
     * https://github.com/gruntjs/grunt-contrib-copy
     */
    copy : {
        dev : {
            files: [{
                expand : true,
                cwd: '<%= project.src %>',
                src : ['**/*.lib.{css,js}', '**/*.{webp,svg,otf,ttf,eot,woff}'],
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
        files: ['<%= project.src %>/pages/content/{,*/}*.html',
                '<%= project.src %>/pages/footer.tmpl',
                '<%= project.src %>/pages/header.tmpl'
        ],
        tasks: ['wrap'],
        options: {
          spawn: false,
        }
      },
      concat_css: {
        files: ['<%= project.css %>'],
        tasks: ['concat:dev_css', 'autoprefixer']
      },
      concat_js: {
        files: ['<%= project.js %>'],
        tasks: ['concat:dev_js']
      },
      compass: {
        files: '<%= project.dev_assets %>/scss/{,*/}*.{scss,sass}',
        tasks: ['compass']
      },
      copy: {
        files: ['<%= project.dev_assets %>/{,*/}*.lib.js', '<%= project.dev_assets %>/{,*/}*.lib.css', '<%= project.src %>/{,*/}*.{webp,svg,otf,ttf,eot,woff}'],
        tasks: ['copy']
      },
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

  grunt.registerMultiTask('wrap', 'Wraps source files with specified header and footer', function() {
        grunt.sampleText = function(a) {
          return "test" + a;
        };

        var data = this.data,
            path = require('path'),
            dest = data.dest,
            files = [data.current_file],
            sep = "\n\n";

        var cpath = path.normalize(data.current_file);
        if((data.current_file === '') || (cpath == path.normalize(data.header)) || (cpath == path.normalize(data.footer)))
          files = this.filesSrc;

        files.forEach(function(f) {
            var p = dest + '/' + path.basename(f),
                header = grunt.template.process(grunt.file.read(data.header)),
                footer = grunt.template.process(grunt.file.read(data.footer)),
                contents = grunt.template.process(grunt.file.read(f));

            grunt.file.write(p, header + sep + "<!-- start "+ path.basename(f) + "-->" + sep + contents + sep +  "<!-- end "+ path.basename(f) + "-->" + sep + footer);
            grunt.log.writeln('File "' + p + '" created.');
        });
  });

  grunt.event.on('watch', function(action, filepath, target) {
      grunt.config("wrap.html.current_file", filepath);
  });



  /**
   * Default task
   * Run `grunt` on the command line
   */
  grunt.registerTask('default', [
    'clean', // clean the min files while in dev
    'compass',
    'concat:dev_css',
    'concat:dev_js',
    'autoprefixer',
    'wrap',
    'copy',
    'imagemin',
    'connect:livereload',
    'open',
    'watch'
  ]);

  /**
   * Build task
   * Run `grunt build` on the command line
   * Then compress all JS/CSS files
   */
  grunt.registerTask('build', [
    'compass',
    'concat:dev_css',
    'concat:dev_js',
    'autoprefixer',
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
    'compass',
    'concat:dev_css',
    'concat:dev_js',
    'autoprefixer',
    'wrap',
    'imagemin',
    'uglify',
    'cssmin',
    'ftp-deploy'
  ]);


};
