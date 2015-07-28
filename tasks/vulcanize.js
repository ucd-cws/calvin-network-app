'use strict';

module.exports = function(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-vulcanize');

	// Options
	return {
    default: {
      options: {
        inlineCss : true,
				inlineScripts : true
      },
      files: {
        'dist/require.html': [
        'public/require.html'
        ]
      }
    }
  };
};
