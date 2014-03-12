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
          includePaths: ['src/css/']
        },
        files: {
          'build/css/main.css': 'src/css/main.scss'
        }
      }
    },

    clean: ['build/'],

    jshint: {
      files: ['Gruntfile.js', 'src/js/*.js', 'src/js/app/**/*.js']
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
          name: 'main',
          out: 'build/js/boot.js',
          // FIXME: Is there a better way to do this?
          wrap: {
              start: "define([], function() {",
              end: " return { boot: function(el) { require(['main'], function(app) { app.boot(el); });  }}} );"
          }
        }
      }
    },

    watch: {
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['jshint', 'requirejs'],
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
    },

    copy: {
      build: {
        files: [
          { src: 'src/index.html', dest: 'build/index.html' },
          { src: 'src/js/libs/require.js', dest: 'build/js/require.js' }
        ]
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-sass');

  grunt.registerTask('build', ['jshint', 'clean', 'sass', 'requirejs', 'copy']);
  grunt.registerTask('default', ['build', 'connect', 'watch']);
};
