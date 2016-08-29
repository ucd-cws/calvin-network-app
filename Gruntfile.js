'use strict';


module.exports = function (grunt) {


    // Load the project's grunt tasks from a directory
    require('load-grunt-config')(grunt, {
        configPath: require('path').join(process.cwd(), 'tasks')
    });



    // Register group tasks
    grunt.registerTask('build', [
        'clean',
        'browserify',
        'copyto',
      'vulcanize']);

      grunt.registerTask('printConfig', function() {
        grunt.log.writeln(JSON.stringify(grunt.config(), null, 2));
        console.log(require('path').join(process.cwd(), 'taskz'))
    });

};
