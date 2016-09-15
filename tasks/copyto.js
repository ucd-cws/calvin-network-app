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
            src: ['webcomponents.js','sigma.min.js','sigma.renderers.customEdgeShapes.min.js','sigma.parsers.json.min.js'],
            dest: 'dist/js/'
        },
        {
            cwd: 'public/bower_components/font-awesome',
            src: ['fonts/**/*'],
            dest: 'dist/bower_components/font-awesome/'
        }],
        options: {
            ignore: []
        }
    }
};
