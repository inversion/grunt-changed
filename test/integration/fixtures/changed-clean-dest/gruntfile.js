var path = require('path');


/**
 * @param {Object} grunt Grunt.
 */
module.exports = function(grunt) {

  var log = [];

  grunt.initConfig({
    changed: {
      options: {
        cache: path.join(__dirname, '.cache')
      }
    },
    clean: {
      one: 'dest/one.js',
      all: 'dest'
    },
    modified: {
      one: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: 'one.coffee',
          dest: 'dest/',
          ext: '.js'
        }]
      },
      all: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: '**/*.coffee',
          dest: 'dest/',
          ext: '.js'
        }]
      },
      none: {
        src: []
      }
    },
    log: {
      all: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: '**/*.coffee',
          dest: 'dest/',
          ext: '.js'
        }],
        getLog: function() {
          return log;
        }
      }
    },
    assert: {
      that: {
        getLog: function() {
          return log;
        }
      }
    }
  });

  grunt.loadTasks('../../../node_modules/grunt-contrib-clean/tasks');

  grunt.loadTasks('../../../tasks');
  grunt.loadTasks('../../../test/integration/tasks');

  grunt.registerTask('default', function() {

    grunt.task.run([
      // run the log task with changed, expect all files
      'changed:log',
      'assert:that:modified:all',

      // modify one file
      'modified:one',

      // run assert task again, expect one file
      'changed:log',
      'assert:that:modified:one',

      // modify nothing, expect no files
      'changed:log',
      'assert:that:modified:none',

      // remove one dest file, expect one file
      'clean:one',
      'changed:log',
      'assert:that:modified:one',

      // remove all dest file, expect all
      'clean:all',
      'changed:log',
      'assert:that:modified:all'

    ]);

  });

};
