module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    settings: {
      localWebServer:   'http://localhost:9000/',
      remoteWebServer:  'http://s3.amazonaws.com/gdn-cdn/next-gen/football/ng-interactive/dream-team-test/',
      s3Folder: '/next-gen/football/ng-interactive/dream-team-test/'
    },

    // Local web server
    connect: {
      server: {
        options: {
          port: 9000,
          base: 'build',
          keepalive: true
        }
      }
    },

    // Backend API endpoint
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
      files: ['Gruntfile.js', 'src/js/*.js', 'server/*.js', 'src/js/app/**/*.js']
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
              'text': '../libs/text',
              'transit': '../libs/transit'
          },
          shim: {
              'transit': ['jquery']
          },
          optimize: 'none',
          name: 'dreamTeam',
          out: 'build/js/boot.js',
          // FIXME: Is there a better way to do this?
          wrap: {
              start: "define([], function() {",
              end: " return { boot: function(el) { require(['dreamTeam'], function(app) { app.boot(el); });  }}} );"
          }
        }
      }
    },

    // Fix to remove 'text!' AMD module names as CurlJS has problems them
    'string-replace': {
        requireFix: {
          files: {
            'build/js/boot.js': 'build/js/boot.js'
          },
          options: {
            replacements: [{
              pattern: /text!/ig,
              replacement: ''
            }]
          }
        },
        enpoint: {
          files: { 'build/js/boot.js': 'build/js/boot.js' },
          options: {
              replacements: [{
                  pattern: '\'@@useLocalEndpoint\'',
                  replacement: (grunt.option('prod') || grunt.option('remotedb')) ? 'false' : 'true'
              }]
          }
        },
        debugUser: {
          files: { 'build/js/boot.js': 'build/js/boot.js' },
          options: {
              replacements: [{
                  pattern: '\'@@useDebugUser\'',
                  replacement: grunt.option('prod') ? 'false' : 'true'
              }]
          }
        },
        assetPath: {
          files: { 'build/js/boot.js': 'build/js/boot.js' },
          options: {
              replacements: [{
                  pattern: /@@assetPath/gi,
                  replacement: grunt.option('prod') ? '<%= settings.remoteWebServer %>' : '<%= settings.localWebServer %>'
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
          spawn: false
        },
      },
      server: {
        files: ['server/*.js'],
        tasks: ['jshint'],
        options: {
          spawn: false
        }
      },
      html: {
        files: ['src/*.html'],
        tasks: ['copy'],
        options: {
          spawn: false
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

    // Run multiple tasks at once
    concurrent: {
      assets: ['requirejs', 'sass'],
      watchers: {
        tasks: ['connect:server', 'nodemon', 'watch'],
        options: {
            logConcurrentOutput: true
        }
      }
    },

    shell: {
        deployServer: {
            command: [
                'cd ./server',
                'rsync -vt ./* ubuntu@ec2-54-195-231-244.eu-west-1.compute.amazonaws.com:/home/ubuntu/world-cup-2014-dreamteam/',
                'ssh ubuntu@ec2-54-195-231-244.eu-west-1.compute.amazonaws.com "cd /home/ubuntu/world-cup-2014-dreamteam/ && ./afterDeploy.sh"'
            ].join('&&'),
            options: {
                stdout: true
            }
        }
    },

    s3: {
      test: {
        options: {
            bucket: 'gdn-cdn',
            access: 'public-read',
            headers: {
              'Cache-Control': 'max-age=60, public',
            },
            debug: true
        },
        upload: [
          {
            src: 'build/**/*',
            dest: '<%= settings.s3Folder %>',
            rel: 'build'
          }
        ]
      },
      prod: {
        options: {
            bucket: 'gdn-cdn',
            access: 'public-read',
            headers: {
              'Cache-Control': 'max-age=60, public',
            }
        },
        upload: [
          {
            src: 'build/**/*',
            dest: '<%= settings.s3Folder %>',
            rel: 'build'
          }
        ]
      }
    },

    gss_fetch: {
        options: {
            amd: true
        },
        prod: {
            url: 'https://docs.google.com/spreadsheet/pub?key=0AkRR3zKqdlUHdFE5SjJtS3gyUHF3ZEcwYlF0SHgxbkE&output=html',
            dest: 'src/js/app/data/players.js'
        }
    }

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
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-s3');
  grunt.loadNpmTasks('grunt-gss-fetch');

  // Tasks
  grunt.registerTask('build', ['jshint', 'clean', 'concurrent:assets', 'autoprefixer', 'copy', 'string-replace']);
  grunt.registerTask('default', ['build', 'concurrent:watchers']);
  grunt.registerTask('deploy-server', ['shell']);
  grunt.registerTask('deploy-s3', ['build', 's3:prod']);
  grunt.registerTask('deploy-s3-test', ['build', 's3:test']);
};

