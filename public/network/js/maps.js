app.map = (function(){

	var map, layer;
	var markers = [];
	var lines = [];



	function init() {
		// create a map in the "map" div, set the view to a given place and zoom
		map = L.map('map-canvas').setView([40,-121], 5);

		// add an OpenStreetMap tile layer
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);
	}

	function update(data) {
		for( var i = 0; i < markers.length; i++ ) {
		 	map.removeLayer(markers[i]); 
		}
		for( var i = 0; i < lines.length; i++ ) {
			map.removeLayer(lines[i]); 
		}
		markers = [];
		lines = [];

		var ll, pts, lineCoords, n;
		for( var i = 0; i < data.edges.length; i++ ) {
			pts = getEdgePts(data.edges[i], data.nodes);

			try {
				if( isNaN(parseFloat(pts[0][1])) || isNaN(parseFloat(pts[1][1])) ) continue;
			} catch(e) {
				alert("Badness with filtering :(")
			}
			

			var latlngs = [
				L.latLng(parseFloat(pts[0][1]), parseFloat(pts[0][0])),
				L.latLng(parseFloat(pts[1][1]), parseFloat(pts[1][0]))
			];

			var polyline = L.polyline(latlngs, {
				color: 'red',
				weight: 2,
				opacity: 0.4,
				smoothFactor: 1,
				data : data.edges[i]
			}).addTo(map);
			polyline.on('click', function(e) {
				app.showInfo(e.target.options.data.id);
			});
			lines.push(polyline);

		}

		var cMode = $('#calibration-mode').is(':checked');

		for( var i = 0; i < data.nodes.length; i++ ) {
			var pt = data.nodes[i].geom.Point.coordinates.split(',');
			if( isNaN(parseFloat(pt[1])) || isNaN(parseFloat(pt[0])) ) continue;

			ll = L.latLng(parseFloat(pt[1]), parseFloat(pt[0]));
			n = data.nodes[i];
			/*var marker = L.myMarker(ll, { 
				radius : 10,
				sides : 5,
				rotate : 20,
				color : '#333',
				fillColor : app.legend[n.type].d3,
				opacity: n.oneStep ? .4 : .9,
				fillOpacity : n.oneStep ? .2 : .7,
				data : data.nodes[i]
			}).addTo(map);*/
			var marker = getMarker(ll, n, cMode).addTo(map);
			marker.on('click', function(e) {
				app.showInfo(e.target.options.data.id);
			});
			markers.push(marker);
		}

	}

	function getMarker(ll, data, cMode) {
		var options = {
			radius : 10,
			color : '#333',
			fillColor : app.legend[data.type].d3,
			opacity: data.oneStep ? .4 : .9,
			fillOpacity : data.oneStep ? .2 : .7,
			data : data
		};

		if( cMode ) {
			options.strokeWidth = '3';
			if( data.cmode == 'both' ) options.color = 'red';
			else if( data.cmode == 'in' ) options.color = 'yellow';
			else if( data.cmode == 'out' ) options.color = 'blue';
		}

		if( data.type == 'Junction Node' || data.type == 'Pump Plant Node' || data.type == 'Power Plant Node' ) {

			return L.circleMarker(ll, options);

		} else if ( data.type == 'Water Treatment Node' ) {

			options.sides = 6;
			return L.myMarker(ll, options);
		
		} else if ( data.type == 'Surface Storage Node' || data.type == 'Groundwater Storage Node' ) {

			options.sides = 3;
			options.rotate = 90;
			return L.myMarker(ll, options);

		} else if ( data.type == 'Agricultural Demand Node' || data.type == 'Urban Demand Node' ) {

			options.sides = 5;
			options.rotate = 18;
			return L.myMarker(ll, options);

		} else {

			options.sides = 4;
			options.rotate = 45;
			return L.myMarker(ll, options);

		}

	}


	function getEdgePts(edge, nodes) {
		var from, to;
		for( var i = 0; i < nodes.length; i++ ) {
			if( nodes[i].id == edge.to ) to = nodes[i].geom.Point.coordinates.split(',');
			if( nodes[i].id == edge.from ) from = nodes[i].geom.Point.coordinates.split(',');
			if( to && from ) break;
		}
		return [to, from];
	}

	return {
		init : init,
		update : update
	}

})();