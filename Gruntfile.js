'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    connect: {
      server: {
        options: {
          port: 9000,
          base: 'build'
        }
      }
    },

    sass: {
      build: {
        options: {
          includePaths: ['src/css/partials/']
        },
        files: {
          'build/css/main.css': 'src/css/main.scss'
        }
      }
    },

    autoprefixer: {
        css: {
            src: 'build/css/*.css'
        }
    },

    clean: ['build/'],

    jshint: {
        options: {
            jshintrc: true
        },

      files: ['Gruntfile.js', 'src/*.js', 'src/js/*.js', 'src/js/app/**/*.js']
    },

    requirejs: {
      compile: {
        options: {
          baseUrl: './src/js/app/',
          paths: {
              'underscore': '../libs/underscore',
              'jquery': '../libs/jquery',
              'backbone': '../libs/backbone',
              'text': '../libs/text'
          },
          optimize: 'none',
          inlineText: true,
          name: '../libs/almond',
          out: 'build/js/main.js',
          include: ['main'],
          insertRequire: ['main'],
        
          wrap: {
            startFile: 'src/wrapStart.frag',
            endFile: 'src/wrapEnd.frag'
          }
          
        }
      }
    },

    filerev: {
        options: {
            encoding: 'utf8',
            algorithm: 'md5',
            length: 32
        },
        js: {
            src: ['build/js/main.js']
        },
        css: {
            src: ['build/css/*.css']
        }
    },

    filerev_apply: {
        options: {
          prefix: 'build/'
        },
        assets: {
            files: [{
                expand: true,
                src: ['build/boot.js', 'build/js/main*.js']
            }]
        }
    },

    watch: {
      scripts: {
        files: ['src/**/*.js', 'src/js/app/templates/*.html'],
        tasks: ['requirejs', 'version-files'],
        options: {
          spawn: false,
        },
      },
      html: {
        files: ['src/index.html'],
        tasks: ['copy'],
        options: {
          spawn: false,
        },
      },
      css: {
        files: ['src/css/**/*.*'],
        tasks: ['sass', 'autoprefixer', 'version-files'],
        options: {
          spawn: false,
        },
      }
    },

    copy: {
      build: {
        files: [
          { src: 'src/index.html', dest: 'build/index.html' },
          { src: 'src/js/libs/curl.js', dest: 'build/js/curl.js' },
          { src: 'src/boot.js', dest: 'build/boot.js' }
        ]
      }
    }

    });

  // Tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-filerev');
  grunt.loadNpmTasks('grunt-filerev-apply');
  grunt.loadNpmTasks('grunt-s3');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');

  // Tasks
  grunt.registerTask('version-files', ['filerev', 'copy', 'filerev_apply']);
  grunt.registerTask('build', ['clean', 'sass', 'autoprefixer', 'requirejs', 'version-files']);
  grunt.registerTask('default', ['build', 'connect', 'watch']);
};

