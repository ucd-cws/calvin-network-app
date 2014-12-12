var neo4j = require('neo4j');
var util= require('util');

var db = new neo4j.GraphDatabase('http://localhost:7474');

function getElArCap (inp, vals) {
    var o = {};
    var l = vals.length -1 ;
    if (isFinite(inp.elevation)) {
	o.elevation = inp.elevation;
	if ((inp.elevation < vals[0].elevation) ||
	    (inp.elevation > vals[l].elevation)) {
	    o.capacity=NaN; o.area=NaN;
	} else {
	    var i=1; while ( inp.elevation > vals[i].elevation) {i++;};
	    o.capacity= vals[i-1].capacity + (vals[i].capacity - vals[i-1].capacity) * (inp.elevation - vals[i-1].elevation)/(vals[i].elevation - vals[i-1].elevation);
	    o.area= vals[i-1].area +(vals[i].area - vals[i-1].area) * (inp.elevation - vals[i-1].elevation)/(vals[i].elevation - vals[i-1].elevation);
	}
    } else if (isFinite(inp.area)) {
	o.area = inp.area;
	if ((inp.area < vals[0].area) || (inp.area > vals[l].area)) {
	    o.capacity=NaN; o.elevation=NaN;
	} else {
	    var i=1; while ( inp.area > vals[i].area) {i++;};
	    o.capacity= vals[i-1].capacity +(vals[i].capacity - vals[i-1].capacity) * (inp.area - vals[i-1].area)/(vals[i].area - vals[i-1].area);
	    o.elevation = vals[i-1].elevation +(vals[i].elevation  - vals[i-1].elevation) * (inp.area - vals[i-1].area)/(vals[i].area - vals[i-1].area);
	}
    } else if (isFinite(inp.capacity)) {
	o.capacity = inp.capacity;
	if ((inp.capacity < vals[0].capacity) || (inp.capacity > vals[l].capacity)) {
	    o.elevation=inp.elevation; o.area=inp.area;
	} else {
	    var i=1; while ( inp.capacity > vals[i].capacity) {i++;};
	    o.area= vals[i-1].area + (vals[i].area - vals[i-1].area) * (inp.capacity - vals[i-1].capacity)/(vals[i].capacity - vals[i-1].capacity);
	    o.elevation = vals[i-1].elevation + (vals[i].elevation  - vals[i-1].elevation) * (inp.capacity - vals[i-1].capacity)/(vals[i].capacity - vals[i-1].capacity);
	}
    }
//    console.log(JSON.stringify(o));
    return o;
};

var query = [
    'MATCH (res {type:"Surface Storage"})',
    'WHERE res.prmname <> "SR-27" and res.prmname <> "SR-CFW "and res.prmname <> "SR-CR" and res.prmname <> "SR-EL"',
    'RETURN res.geojson',
    'LIMIT 15',
].join('\n')


db.query(query, null, function (err, results) {
    if (err) return err;
    console.log('prmname,initialcapacity,0.4,0.6,0.8,1.0,1.2,1.4');
    for (var i = 0; i < results.length; i++) {
	var res=results[i]["res.geojson"];
	var p=JSON.parse(res).properties;
	console.log(p);
	if (p.initialstorage && p.el_ar_cap) {
	    var area={};
	    for (var e=0.4; e <= 1.40; e+=0.2) { 
		var eac=getElArCap({capacity:p.initialstorage*e},p.el_ar_cap);
		area[e]=eac.area;
	    }
	    var str=util.format
	    ('%s,%d,%d,%d,%d,%d,%d,%d',
	     p.prmname,p.initialcapacity,
	     area[0.4],area[0.6],area[0.8],area[1.0],area[1.2],area[1.4]);
	} else {
	    var str=util.format
	    ('%s,%d,%d,%d,%d,%d,%d,%d',
	     p.prmname,p.initialcapacity,null,null,null,null,null,null,null);
	}
	console.log(str);
    }
    console.log(areas);
});

