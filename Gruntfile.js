'use strict';
var pkg = require('./package.json');
var currentTime = +new Date();
var assetPath = 'build/assets-' + currentTime;

module.exports = function(grunt) {
  grunt.initConfig({

    connect: {
      server: {
        options: {
          port: pkg.config.port,
          base: 'build'
        }
      }
    },

    sass: {
      build: {
        options: { loadPath: ['src/css/partials/'] },
        files: { 'build/assets/css/main.css': 'src/css/main.scss' }
      }
    },

    autoprefixer: {
        css: { src: 'build/assets/css/*.css' }
    },

    clean: ['build/'],

    jshint: {
        options: { jshintrc: true },
      files: ['Gruntfile.js', 'src/*.js', 'src/js/*.js', 'src/js/app/**/*.js']
    },

    requirejs: {
      compile: {
        options: {
          baseUrl: './src/js/app/',
          paths: {
              // Example libraries. You can add your own here
              'underscore'      : '../libs/underscore',
              'jquery'          : '../libs/jquery',
              'backbone'        : '../libs/backbone',
              'text'            : '../libs/text',
              'json'            : '../libs/json',
              'd3'              : '../libs/d3',
              'iframeMessenger' : '../libs/iframeMessenger'
          },
          optimize: 'none',
          inlineText: true,
          name: '../libs/almond',
          out: 'build/assets/js/main.js',
          include: ['main'],

          wrap: {
            start: 'define(["require"],function(require){var req=(function(){',
            end: 'return require; }()); return req; });'
          }

        }
      }
    },

    watch: {
      scripts: {
        files: [
          'src/**/*.js',
          'src/boot.js',
          'src/**/*.json',
          'src/js/app/templates/*.html'
        ],
        tasks: ['requirejs'],
        options: {
          spawn: false,
        },
      },
      html: {
        files: ['src/*.html', 'src/**/*.html'],
        tasks: ['copy', 'replace:local'],
        options: {
          spawn: false,
        },
      },
      css: {
        files: ['src/css/**/*.*'],
        tasks: ['sass', 'autoprefixer'],
        options: {
          spawn: false,
        },
      }
    },

    copy: {
      build: {
        files: [
          { src: 'src/index.html', dest: 'build/index.html' },
          { src: 'src/ngw.html', dest: 'build/ngw.html' },
          { src: 'src/js/libs/curl.js', dest: 'build/assets/js/curl.js' },
          { src: 'src/boot.js', dest: 'build/boot.js' },
          { cwd: 'src/', src: 'imgs/**', dest: 'build/assets/', expand: true}
        ]
      }
    },

    cssmin: {
        minify: {
            expand: true,
            cwd: 'build/assets/css/',
            dest: 'build/assets/css/',
            src: ['*.css']
        }
    },

    uglify: {
        options: {
            preserveComments: 'some',
            drop_console: true,
            report: 'min'
        },

        minify: {
            files:[{
                expand: true,
                cwd: 'build/assets/js/',
                dest: 'build/assets/js/',
                src: '*.js'
            }]
        }
    },

    replace: {
        prod: {
            options: {
                patterns: [{
                  match: /\/assets/g,
                  replacement: pkg.config.cdn_url + 'assets-'+currentTime
                }]
            },
            files: [{
                src: ['build/*.html', 'build/**/*.js', 'build/**/*.css'],
                dest: './'
            }]
        },
        local: {
            options: {
                patterns: [{
                  match: /\/assets/g,
                  replacement: 'http://localhost:' + pkg.config.port + '/assets'
                }]
            },
            files: [{
                src: ['build/*.html', 'build/**/*.js', 'build/**/*.css'],
                dest: './'
            }]
        }

    },

    s3: {
        options: {
            access: 'public-read',
            bucket: 'gdn-cdn',
            maxOperations: 20,
            dryRun: false,
            headers: {
                CacheControl: 180,
            },
            gzip: true,
            gzipExclude: ['.jpg', '.gif', '.jpeg', '.png']
        },
        base: {
            files: [{
                cwd: 'build',
                src: '*.*',
                dest: pkg.config.s3_folder
            }]
        },
        assets: {
            options: {
                headers: {
                    CacheControl: 3600,
                }
            },
            files: [{
                cwd: 'build',
                src: 'assets-' + currentTime + '/**/*.*',
                dest: pkg.config.s3_folder
            }]
        }
    },

    rename: {
        main: {
            files: [
                { src: 'build/assets', dest: assetPath }
            ]
        }
    }
  });

  // Task pluginsk
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-filerev');
  grunt.loadNpmTasks('grunt-filerev-apply');
  grunt.loadNpmTasks('grunt-aws');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-contrib-rename');

  // Tasks
  grunt.registerTask('version-files', ['filerev', 'copy', 'filerev_apply']);
  grunt.registerTask('build',[
    'clean',
    'sass',
    'autoprefixer',
    'requirejs',
    'copy'
  ]);
  grunt.registerTask('default', ['build', 'replace:local', 'connect', 'watch']);
  grunt.registerTask('compress', ['uglify', 'cssmin']);

  grunt.registerTask('deploy', [
      'build',
      'compress',
      'rename',
      'replace:prod',
      's3'
  ]);
};

