var fs = require('fs');

module.exports.print = function() {
  fs.readdir(__dirname+'/../../models/', function(err, files){
    if( err ) {
      return console.log(err);
    }

    for( var i = 0; i < files.length; i++ ) {
      if( files[i].match(/^\./) ) continue;


      try {
        var model = require(__dirname+'/../../models/'+files[i]);
        model = new model();

        console.log('model: '+files[i].replace(/\.js$/, ''));
        for( var key in model ) {
          if( typeof model[key] !== 'function' ) continue;
          console.log('  -'+model[key].toString().split('\n')[0].replace(/\s*{.*/, ''));
        }
      } catch(e) {}
    }

    process.exit();
  });
}
