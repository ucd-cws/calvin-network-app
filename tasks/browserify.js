'use strict';


module.exports = {
    build: {
      files: {
        '.build/js/app.js': ['public/js/app.js']
      },
      options: {
        transform: [
            ["babelify"]
        ]
      },
      browserifyOptions : {
        standalone : 'CWN'
      }
    },
    
    watch: {
      files: {
        'public/js/app.js': [
          'public/lib/index.js'
        ]
      },
      options: {
        transform: [
            ["babelify"]
        ],
        browserifyOptions : {
          debug : true,
          standalone : 'CWN'
        },
        keepAlive : true,
        watch : true
      }
    }
}

