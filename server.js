var express = require('express');
var app = express();



var dir = __dirname + '/dist';
process.argv.forEach(function(val){
    if( val == '--dev' ) dir = __dirname + '/app';
});

app.use(express.static(dir));
app.listen(3006);

console.log('Serving '+dir+' @ http://localhost:3006');