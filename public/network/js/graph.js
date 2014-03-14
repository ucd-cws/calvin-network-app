app.graph = (function(){

	var visGraph;
	var scale = .3;

	function init() {
		// create a graph
	    var container = $('#mygraph')[0];
	    var data = getData('');

	    var h = $(window).width() * .60;
	    var options = {
	      width: '100%', 
	      height: h+'px',
	      stabilize : false
	    };

	    visGraph = new vis.Graph(container, data, options);
	    visGraph.scale = scale;

	    vis.events.addListener(visGraph, 'select', function(){
	      console.log(graph.getSelection());
	    });
	}

	function destroy() {
		var parent = $('#mygraph').parent();
		$('#mygraph').remove();
		delete visGraph;
		scale = .3;
		parent.html('<div id="mygraph" style="background-color:white;border: 1px solid #eee" ></div>');
	}

	function getData(filter) {
		var data = app.getData(filter);

		var nodes = [];
		var edges = [];
		for( var i = 0; i < data.nodes.length; i++ ) {
			nodes.push({
	          id: data.nodes[i].id,
	          label : data.nodes[i].label
	        });
		}
		for( var i = 0; i < data.edges.length; i++ ) {
			edges.push({
	          to : data.edges[i].to,
	          label : data.edges[i].label,
	          from : data.edges[i].from,
	          data : data.edges[i],
	          // TODO: fix this 300 
	          length : data.edges[i].l ? data.edges[i].l : 300,
	        });
		}

		return {
	      nodes: nodes,
	      edges: edges,
	    };
	}

	function redraw() {
		visGraph.redraw();
	}

	function zoomOut() {
	  scale -= .1;
	  if( scale < .1 ) scale = .1;
	  visGraph.scale = scale;
	}

	function zoomIn() {
	  scale += .1;
	  visGraph.scale = scale;
	}

	var lasth = 0;
	$(window).on('resize', function(){
	  var h = $(window).width() * .60;
	  if( lasth == h ) return;
	  lasth = h;
	  visGraph.setSize('100%', h+'px');
	  visGraph.redraw();
	});


	var filterTimer = -1;
	function filter(value) {
	  if( filterTimer != -1 ) clearTimeout(filterTimer);

	  filterTimer = setTimeout(function(){
	    filterTimer = -1;
	    visGraph.setData(getData(value));
	    visGraph.scale = scale;
	  }, 500);
	  
	}

	return {
		init : init,
		redraw : redraw,
		filter : filter,
		zoomIn : zoomIn,
		zoomOut : zoomOut,
		destroy : destroy
	}

})();