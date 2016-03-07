'use strict'

var ngrok = require('ngrok');

module.exports = function(grunt) {

  // Load grunt tasks
  require('load-grunt-tasks')(grunt);

  // Grunt configuration
  grunt.initConfig({
    pagespeed: {
      options: {
        nokey: true,
        locale: "en_US",
        threshold: 40
      },
      local: {
        options: {
          strategy: "desktop"
        }
      },
      mobile: {
        options: {
          strategy: "mobile"
        }
      }
    },
    imagemin: {
      png: {
        options: {
          optimizationLevel: 7
        },
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['**/*.png'],
            dest: 'dist/',
            ext: '.png'
          }
        ]
      },
      jpg: {
        options: {
          progressive: true
        },
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['**/*.jpg', '!views/images/pizzeria.jpg'],
            dest: 'dist/',
            ext: '.jpg'
          }
        ]
      }
    },
    responsive_images: {
      options: {
        engine: 'im'
      },
      target: {
        options: {
          sizes: [{
            name: 't',
            width: 100,
            quality: 60
          },{
            name: 's',
            width: 240,
            quality: 60
          },{
            name: 'm',
            width: 360,
            quality: 60
          },{
            name: 'l',
            width: 720,
            quality: 60
          },{
            name: 's',
            width: 480,
            suffix: '_x2',
            quality: 60
          },{
            name: 'l',
            width: 1440,
            suffix: '_x2',
            quality: 60
          }]
        },
        files: {
          'dist/views/images/pizzeria.jpg': 'src/views/images/pizzeria.jpg'
        }
      }
    },
    htmlmin: {
      target: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['**/*.html'],
            dest: 'dist/',
            ext: '.html'
          }
        ]
      }
    },
    cssmin: {
      options: {
        roundingPrecision: 2
      },
      target: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['**/*.css'],
            dest: 'dist/',
            ext: '.css'
          }
        ]
      }
    },
    uglify: {
      options: {
        mangle: true
      },
      target: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['**/*.js'],
            dest: 'dist/',
            ext: '.js'
          }
        ]
      }
    }
  });

  // Load NPM tasks
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-responsive-images');

  // Register tasks
  grunt.registerTask('psi-ngrok', 'Run pagespeed with ngrok', function() {
    var done = this.async();
    var port = 8080;

    ngrok.connect(port, function(err, url) {
      if (err !== null) {
        grunt.fail.fatal(err);
        return done();
      }
      grunt.config.set('pagespeed.options.url', url);
      grunt.task.run('pagespeed');
      done();
    });
  });

  // Register default tasks
  grunt.registerTask('default', ['newer:htmlmin','newer:cssmin','newer:uglify','newer:imagemin','newer:responsive_images']);
};
