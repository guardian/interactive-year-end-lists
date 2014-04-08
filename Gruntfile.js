module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Local web server
    connect: {
      server: {
        options: {
          port: 9000,
          base: 'build'
        }
      }
    },

    // Backend API enpoint
    nodemon: {
      dev: {
        script: 'server/server.js'
      }
    },

    // CSS
    sass: {
      build: {
        options: {
          outputStyle: 'compressed',
          includePaths: ['src/css/', 'src/css/partials/']
        },
        files: {
          'build/css/main.css': 'src/css/main.scss'
        }
      }
    },

    // Normalise CSS prefixes
    autoprefixer: {
      build: {
            files: {
                'build/css/main.css': 'build/css/main.css'
            }
        }
    },

    // Empty out build folder
    clean: ['build/'],

    // Lint JavaScript files
    jshint: {
      files: ['Gruntfile.js', 'src/js/*.js', 'src/js/app/**/*.js']
    },

    // Combine main app into one JS file
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

    // Fix to remove 'text!' AMD module names as CurlJS has problems them
    'string-replace': {
      dist: {
        files: {
          'build/js/boot.js': 'build/js/boot.js'
        },
        options: {
          replacements: [{
            pattern: /text!/ig,
            replacement: ''
          }]
        }
      }
    },

    // Listen to file changes
    watch: {
      scripts: {
        files: ['src/**/*.js', 'src/**/*.scss', 'src/js/app/templates/*.html'],
        tasks: ['jshint', 'requirejs', 'sass', 'autoprefixer', 'string-replace'],
        options: {
          spawn: false,
        },
      },
      html: {
        files: ['src/*.html'],
        tasks: ['copy'],
        options: {
          spawn: false,
        },
      },
    },

    // Copy needed files into the build folder
    copy: {
      build: {
        files: [
          { src: 'src/index.html', dest: 'build/index.html' },
          { src: 'src/ngw.html', dest: 'build/ngw.html' },
          { src: 'src/css/partials/*.css', dest: 'build/css/vendor.css' },
          { src: 'src/js/libs/require.js', dest: 'build/js/require.js' },
          {
            expand: true,
            cwd: 'src/images/',
            src: ['**/*.{png,jpg,svg}'],
            dest:'build/images/'
          }
        ]
      }
    },

  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-string-replace');

  // Tasks
  grunt.registerTask('build', ['jshint', 'clean', 'sass', 'autoprefixer', 'requirejs', 'copy', 'string-replace']);
  grunt.registerTask('default', ['build', 'connect', 'nodemon', 'watch']);
};
