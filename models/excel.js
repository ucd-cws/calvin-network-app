'use strict';

var xlsx = require('xlsx');
var uuid = require('node-uuid');
var os = require('os');
var path = require('path');

var db = require('../lib/database');

module.exports = function() {
    return {
        name: 'excel',
        create : create
    };
};

function create(prmname, callback) {
  db.getNode(prmname, function(err, node){
      if( err || !node ) {
        return callback(err || 'invalid prmname');
      }

      db.getExtras(prmname, function(err, resp){
        if( err ) {
          return callback(err);
        }

        if( resp ) {
          for( var key in resp ) {
            node.properties[key] = resp[key];
          }
        }

        var data = {};
        for( var i = 0; i < node.properties.repo.files.length; i++ ) {
          node.properties.repo.files[i].data = getData(node, node.properties.repo.files[i].path);
        }

        var wb = new Workbook();
        for( var i = 0; i < node.properties.repo.files.length; i++ ) {
          var f = node.properties.repo.files[i];

          var name = f.file.replace(/^\.\//,'').replace(/(\.|\/)/g,'_');

          f.data.splice(0,0,[]);
          f.data.splice(0,0,[f.file.replace(/^\./,prmname), f.path]);

          wb.SheetNames.push(name);
          wb.Sheets[name] = sheet_from_array_of_arrays(f.data);
        }


        var wopts = { bookType:'xlsx', bookSST:true, type:'binary' };
        var filename = path.join(os.tmpdir(), uuid.v1()+'.xlsx');
        xlsx.writeFile(wb, filename, wopts);

        callback(null, filename);
      });
    });
}

function getData(object, path) {
  path = path.split('.');
  for( var i = 0; i < path.length; i++ ) {
    if( path[i] === '$ref' ) {
      return object;
    }
    if( path[i].match(/^\d+$/) ) {
      path[i] = parseInt(path[i]);
    }

    object = object[path[i]];
  }
}

/* function below from: https://gist.github.com/SheetJSDev/88a3ca3533adf389d13c */
function datenum(v, date1904) {
	if(date1904) v+=1462;
	var epoch = Date.parse(v);
	return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
	var ws = {};
	var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
	for(var R = 0; R != data.length; ++R) {
		for(var C = 0; C != data[R].length; ++C) {
			if(range.s.r > R) range.s.r = R;
			if(range.s.c > C) range.s.c = C;
			if(range.e.r < R) range.e.r = R;
			if(range.e.c < C) range.e.c = C;
			var cell = {v: data[R][C] };
			if(cell.v == null) continue;
			var cell_ref = xlsx.utils.encode_cell({c:C,r:R});

			if(typeof cell.v === 'number') cell.t = 'n';
			else if(typeof cell.v === 'boolean') cell.t = 'b';
			else if(cell.v instanceof Date) {
				cell.t = 'n'; cell.z = xlsx.SSF._table[14];
				cell.v = datenum(cell.v);
			}
			else cell.t = 's';

			ws[cell_ref] = cell;
		}
	}
	if(range.s.c < 10000000) ws['!ref'] = xlsx.utils.encode_range(range);
	return ws;
}

function Workbook() {
	if(!(this instanceof Workbook)) return new Workbook();
	this.SheetNames = [];
	this.Sheets = {};
}
