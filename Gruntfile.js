'use strict';

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    grunt.loadNpmTasks('grunt-vulcanize');
    grunt.loadNpmTasks('grunt-manifest');
    grunt.loadNpmTasks('grunt-shell');

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        yeoman: {
            // Configurable paths
            app: 'app',
            dist: 'dist',
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js',
                '!<%= yeoman.app %>/scripts/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },

        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,*/}*.js',
                        //'<%= yeoman.dist %>/styles/{,*/}*.css',
                        '<%= yeoman.dist %>/images/{,*/}*.{gif,jpeg,jpg,png,webp}',
                        //'<%= yeoman.dist %>/styles/fonts/{,*/}*.*'
                    ]
                }
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            options: {
                dest: '<%= yeoman.dist %>',
                verbose : true
            },
            html: '<%= yeoman.app %>/{,*/}*.html'
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            options: {
                assetsDirs: ['<%= yeoman.dist %>']
            },
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css']
        },

        // The following *-min tasks produce minified files in the dist folder
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{gif,jpeg,jpg,png}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeCommentsFromCDATA: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: '{,*/}*.html',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'images/{,*/}*.webp',
                        '{,*/}*.html',
                        'styles/fonts/{,*/}*.*',
                        'styles/*.css',
                        'fonts/{,*/}*.*',
                        'components/**',
                        'other_components/**/*.*',
                        'elements/**/*.*'
                    ]
                }]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },


        // Run some tasks in parallel to speed up build process
        concurrent: {
            server: [
                //'compass:server',
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                //'compass',
                'copy:styles',
                'imagemin',
                'svgmin'
            ]
        },
        
        vulcanize: {
            default : {
                options: {},
                files : {
                    '<%= yeoman.dist %>/index.html': ['<%= yeoman.dist %>/index.html'],
                }
            },
            
        },

        manifest: {
            generate: {
              options: {
                basePath: 'dist/',
                cache: [
                    'bower_components/polymer/polymer.js', 
                    'fonts/fontawesome-webfont.svg?v=4.0.3',
                    'fonts/fontawesome-webfont.ttf?v=4.0.3',
                    'fonts/fontawesome-webfont.woff?v=4.0.3'
                ],
                network: ['/', '*', 'http://*', 'https://*'],
                preferOnline: true,
                verbose: true,
                timestamp: true,
                hash: true,
                master: ['record.html']
              },
              src: [
                'index.html',
                'record.html',
                'scripts/*',
                'styles/*.css',
                'font/*'
              ],
              dest: 'dist/manifest.appcache'
            }
        },


        shell: {
            // this should be done prior to running normal dev server, generates the webcomponets base.css file
            // also handles copying bower_components font-awesome /fonts dir
            'generate-deep-css' : {
                options: {
                    stdout: true,
                    stderr: true
                },
                command: 'rm -rf <%= yeoman.app %>/styles/deep.css <%= yeoman.app %>/styles/tmp.* && ' +
                         'cp <%= yeoman.app %>/components/bootstrap/dist/css/bootstrap.css <%= yeoman.app %>/styles/tmp.bootstrap.css && '+
                         'sed -i "" -e \':a\' -e \'N\' -e \'$!ba\' -e \'s/\\}\\(\\n *\\)\\([a-z\\.\\*]\\)/\\}\\1html \\/deep\\/ \\2/g\' <%= yeoman.app %>/styles/tmp.bootstrap.css &&' +
                         'sed -i "" -e \':a\' -e \'N\' -e \'$!ba\' -e \'s/\\,\\(\\n *\\)\\([a-z\\.\\*]\\)/\\,\\1html \\/deep\\/ \\2/g\' <%= yeoman.app %>/styles/tmp.bootstrap.css &&' +
                         'sed -i "" -e \':a\' -e \'N\' -e \'$!ba\' -e \'s/\\,\\( *\\)\\([a-z\\.]\\)/\\,\\1html \\/deep\\/ \\2/g\' <%= yeoman.app %>/styles/tmp.bootstrap.css &&' +
                         'sed -i "" -e \':a\' -e \'N\' -e \'$!ba\' -e \'s/\\(@media[a-z0-9()-\\: ]*{\\n\\)/\\1 html \\/deep\\//g\' <%= yeoman.app %>/styles/tmp.bootstrap.css &&' +
                         // fix the modal selector
                         'sed -i "" -e \':a\' -e \'N\' -e \'$!ba\' -e \'s/html \\/deep\\/ \\.modal-open \\.modal/.modal-open \\/deep\\/ .modal/g\' <%= yeoman.app %>/styles/tmp.bootstrap.css &&' +

                         // there is issue where the regex adds html /deep/ to a animate keyframe set, this cleans it
                         'sed -i "" -e \':a\' -e \'N\' -e \'$!ba\' -e \'s/  html \\/deep\\/ to {/  to {/g\' <%= yeoman.app %>/styles/tmp.bootstrap.css &&' +
                         'cp <%= yeoman.app %>/components/animate-css/animate.css <%= yeoman.app %>/styles/tmp.animate.css && '+
                         'sed -i "" -e \':a\' -e \'N\' -e \'$!ba\' -e \'s/\\(\\n\\)\\(\\.[a-zA-Z]*\\)/\\1html \\/deep\\/ \\2/g\' <%= yeoman.app %>/styles/tmp.animate.css && ' +
                         'cat '+
                         '<%= yeoman.app %>/styles/tmp.bootstrap.css '+
                         '<%= yeoman.app %>/styles/tmp.animate.css '+
                         '>> <%= yeoman.app %>/styles/deep.css && '+
                         'rm -rf <%= yeoman.app %>/styles/tmp.*'

            },
            // the vulconizer imports all the custom elements everything we need
            // usemin compresses the css and js, makeing the components lib
            // unnecessary except the polymer script
            'clear-bower-components' : {
                options: {
                    stdout: true,
                    stderr: true
                },
                command: 'rm -rf <%= yeoman.dist %>/components/* && '+
                         'rm -rf <%= yeoman.dist %>/elements && '+
                         'mkdir <%= yeoman.dist %>/components/polymer && '+
                         'mkdir -p <%= yeoman.dist %>/components/jquery/dist && '+
                         'cp <%= yeoman.app %>/components/polymer/polymer.js <%= yeoman.dist %>/components/polymer && '+
                         'cp <%= yeoman.app %>/components/polymer/polymer.js.map <%= yeoman.dist %>/components/polymer && '+
                         'cp <%= yeoman.app %>/components/jquery/dist/jquery.js <%= yeoman.dist %>/components/jquery/dist'
            },
            // datanucleusenhance run 'ant compile' as well
            'appengine-compile' : {
                options: {
                    stdout: true,
                    stderr: true
                },
                command: 'cd appengine/appengine-dev && ant datanucleusenhance'
            },
            'server' : {
                options: {
                    stdout: true,
                    stderr: true
                },
                command: 'node server'
            },
            'build-server' : {
                options: {
                    stdout: true,
                    stderr: true
                },
                command: 'node server.js --build'
            }
        }

    });


    grunt.registerTask('server', [
        'shell:server'
    ]);

    grunt.registerTask('build-server', [
        'shell:build-server'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'useminPrepare',
        'concurrent:dist',
        //'autoprefixer',
        'concat',
        'uglify',
        'copy:dist',
        'rev',
        'usemin',
        'vulcanize:default',
        'shell:clear-bower-components',
        'manifest'
    ]);

};
