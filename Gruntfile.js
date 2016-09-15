'use strict';


module.exports = function (grunt) {


    // Load the project's grunt tasks from a directory
    require('load-grunt-config')(grunt, {
        configPath: require('path').join(process.cwd(), 'tasks')
    });



    // Register group tasks
    grunt.registerTask('build', [
        'clean',
        //'browserify',
        'copyto',
      'vulcanize']);

};
