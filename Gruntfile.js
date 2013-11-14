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
        '<%= project.src %>/assets/js/{,*/}*.js'
      ],
      css: [
        '<%= project.src %>/assets/css/{,*/}*.css'
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
      dev: {
        files: {
          '<%= project.dist_assets %>/js/scripts.js': '<%= project.js %>',
          '<%= project.dist_assets %>/css/main.css': '<%= project.css %>',
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
          '<%= project.dist_assets %>/js/main.min.js': '<%= project.dist_assets %>/js/main.js'
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
          cssDir: '<%= project.dev_assets %>/css'
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
      },
      dist: {
        files: {
          '<%= project.dist_assets %>/css/main.css': ['<%= project.dist_assets %>/css/main.css']
        }
      }
    },

    /**
     * Wrap
     * It will wrap the pages with the header and footer
     * https://github.com/chrissrogers/grunt-wrap
     */
    wrap: {
        html: {
            header: '<%= project.src %>/pages/header.tmpl',
            footer: '<%= project.src %>/pages/footer.tmpl',
            src: [
                '<%= project.src %>/pages/content/{,*/}*.html'
            ],
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
          banner: '<%= tag.banner %>'
        },
        files: {
            '<%= project.dist_assets %>/css/main.css': ['<%= project.css %>']
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
        tasks: ['wrap']
      },
      concat: {
        files: ['<%= project.js %>',
                '<%= project.css %>'
        ],
        tasks: ['concat:dev', 'autoprefixer:dev']
      },
      compass: {
        files: '<%= project.dev_assets %>/{,*/}*.{scss,sass}',
        tasks: ['compass']
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
  });

    grunt.registerMultiTask('wrap', 'Wraps source files with specified header and footer', function() {
          var data = this.data,
              path = require('path'),
              dest = grunt.template.process(data.dest),
              files = this.filesSrc,
              header = grunt.file.read(grunt.template.process(data.header)),
              footer = grunt.file.read(grunt.template.process(data.footer)),
              sep = "\n\n";

          files.forEach(function(f) {
              var p = dest + '/' + path.basename(f),
                  contents = grunt.file.read(f);

              grunt.file.write(p, header + sep + "<!-- start "+ path.basename(f) + "-->" + sep + contents + sep +  "<!-- end "+ path.basename(f) + "-->" + sep + footer);
              grunt.log.writeln('File "' + p + '" created.');
          });
    });


  /**
   * Default task
   * Run `grunt` on the command line
   */
  grunt.registerTask('default', [
    'compass',
    'concat:dev',
    'autoprefixer:dev',
    'wrap',
    // 'jshint',
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
    'concat:dev',
    'autoprefixer:dist',
    'cssmin:dist',
    // 'jshint',
    'uglify'
  ]);

};
