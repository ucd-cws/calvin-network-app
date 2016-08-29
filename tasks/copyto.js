'use strict';


module.exports = {
    build: {
        files: [{
            cwd: 'public',
            src: ['index.html'],
            dest: 'dist/'
        },
        {
            cwd: 'public/js',
            src: ['webcomponents.js'],
            dest: 'dist/js/'
        },
        {
            cwd: 'public/bower_components/font-awesome',
            src: ['fonts/**/*'],
            dest: 'dist/'
        }],
        options: {
            ignore: []
        }
    }
};
