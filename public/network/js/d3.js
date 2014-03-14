
app.d3 = (function(){

  var path, force, svg, eventPanel;
  var width = 960,
      height = 500;

  var aspect = 2.5;
  var originX = 0;
  var originY = 0;


  function redraw(data) {
    $("#mygraph").html('');

    width = $("#mygraph").width();
    if( width < 250 ) width = 250;

    path = d3.geo.path(),
    force = d3.layout.force().size([width, height]);

    svg = d3.select("#mygraph").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("preserveAspectRatio","xMinYMin meet")
        .attr("viewBox",originX+" "+originY+" "+(width*aspect)+" "+(height*aspect));


    var zoom = d3.behavior.zoom()
      .translate([0, 0])
      .scale(1)
      .scaleExtent([1, 8])
      .on("zoom", zoomed);

    function zoomed() {
      // TODO: only using manual controls for now
      //console.log(d3.event);
      //console.log(d3.event.scale);
      //aspect = d3.event.scale * aspect;
      originX = d3.event.translate[0] * -1;
      originY = d3.event.translate[1] * -1;
      updateView();
    }

    eventPanel = svg.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", "translate(" + originX + "," + originY + ")")
      .call(zoom)


    draw(data);
  }

  function draw(data) {

    var nodes = [];
    var hash = {};
    for( var i = 0; i < data.nodes.length; i++ ) {
      var pt = data.nodes[i].geom.Point.coordinates.split(',');
      var n = {
        properties : data.nodes[i],
        id         : data.nodes[i].id,
        group      : [],
      };
      n.geometry = {
        coordinates : [parseFloat(pt[0]), parseFloat(pt[1])],
        type : 'Point'
      }
      n.type =  "Feature";

      var node = path.centroid(n);
      if (node.some(isNaN)) continue;
      node.x = node[0];
      node.y = node[1];
      node.feature = n;

      if( hash[data.nodes[i].id] ) {
        hash[data.nodes[i].id].feature.group.push(node);
      } else {
        nodes.push(node);
        hash[data.nodes[i].id] = node;
      }
    }
  
    var links = [];
    for( var i = 0; i < data.edges.length; i++ ) {
      var link = {
        source : getNode(data.edges[i].from, nodes),
        target : getNode(data.edges[i].to, nodes)
      }

      if( !link.source || !link.target ) continue;

      var dx = link.source.x - link.target.x,
          dy = link.source.y - link.target.y;
      link.distance = Math.sqrt(dx * dx + dy * dy);
      links.push(link);
    }

    force
      .charge([-150])
      .nodes(nodes)
      .links(links)
      .linkDistance(function(d) { return d.distance; })
      .start();

    var link = svg
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .classed('link', true)
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

    var gnodes = svg.selectAll('g.gnode')
      .data(nodes)
      .enter()
      .append('g')
      .attr("transform", function(d) { return "translate(" + -d.x + "," + -d.y + ")"; })
      .classed('gnode', true)
      
      .text(function(d) {
        var g = d3.select(this);

        setTimeout(function(){
          var y = 0, x = 9;
          for( var i = 0; i < d.feature.group.length; i++ ) {
              g.append('svg:path')
                .attr("d", function(d){
                  return getPath(d)
                })
               .attr("stroke", '#333')
               .attr('stroke-width', 1)
               .attr('stroke-opacity', function(d){
                  if( d.feature.group[i].feature.properties.oneStep ) return .4;
                  return 1;
               })
               .attr('fill-opacity', function(d){
                  if( d.feature.group[i].feature.properties.oneStep ) return .2;
                  return 1;
               })
               .attr("transform", "translate(" + x + ","+y+")")
               .attr("fill", app.legend[d.feature.group[i].feature.properties.type] ?  
                                app.legend[d.feature.group[i].feature.properties.type].d3 : '#000000');

               if( i % 2 == 0 ) {
                y += 9;
                x = 0;
               } else {
                x += 9;
               }
          }
        }, 500);
        return '';
      })
      .on("dblclick", function(d){
        app.showInfo(d.feature.properties.id);
      })
      .call(force.drag);

    /*var node = gnodes
      .append("circle")
      .attr("r", 10)
      .attr("stroke", '#333')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', function(d){
          if( d.feature.properties.oneStep ) return .4;
          return 1;
       })
       .attr('fill-opacity', function(d){
          if( d.feature.properties.oneStep ) return .2;
          return 1;
       })
      .attr("fill", function(d){
        if( app.legend[d.feature.properties.type] ) return app.legend[d.feature.properties.type].d3;
        return '#000000';
      });*/
    var pnodes = gnodes
      .append('svg:path')
      .attr("d", function(d){
        return getPath(d)
      })
      .attr('stroke-linejoin',"round")
      .attr('stroke-linecap',"round")
      .attr('fill-rule',"evenodd" )
      .attr("stroke", '#333')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', function(d){
          if( d.feature.properties.oneStep ) return .4;
          return 1;
       })
       .attr('fill-opacity', function(d){
          if( d.feature.properties.oneStep ) return .2;
          return 1;
       })
      .attr("fill", function(d){
        if( app.legend[d.feature.properties.type] ) return app.legend[d.feature.properties.type].d3;
        return '#000000';
      });

    /*var labels = gnodes
      .append("text")
      .text(function(d) { return d.feature.properties.label.replace(/\n/, ' ') });*/

    force.on("tick", function(e) {
      link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      gnodes.attr("transform", function(d) {
       return "translate(" + d.x + "," + d.y + ")";
      });

      //pnodes.attr("d", function(d) {
      //    return  getPath(d);
      //});
    });
  }

  function getPath(d) {
      var type = d.feature.properties.type;
      if( type == 'Junction Node' || type == 'Pump Plant Node' || type == 'Power Plant Node' ) {
        return "M" + .2  + "," + .2  + "A10,10,0,1,1," + -.01  + "," + -.01+" z"
      } else if ( type == 'Water Treatment Node' ) {
        return polygon(0, 0, 10, 6, 0);
      } else if ( type == 'Surface Storage Node' || type == 'Groundwater Storage Node' ) {
        return polygon(0, 0, 10, 3, 90);
      } else if ( type == 'Agricultural Demand Node' || type == 'Urban Demand Node' ) {
        return polygon(0, 0, 10, 5, 18);
      } else {
        return polygon(0, 0, 10, 4, 45);
      }
  }

  function polygon(x, y, radius, sides, startAngle) {
    if (sides < 3) return;
    var a = ((Math.PI * 2)/sides);
    var r = startAngle * (Math.PI / 180);

    // think you need to adjust by x, y
    var p = "M";
    for (var i = 0; i < sides; i++) {
       p += (x+(radius*Math.cos(a*i-r)))+","+(y+(radius*Math.sin(a*i-r)))+" ";
    }
    p +=" z";
    return p;
  }

  function resize() {
        width = $("#mygraph").width();
        updateView();
  }

  function updateView() {
    if( !svg ) return;
    if( width < 250 ) width = 250;

    // update panel size and change view
    svg.attr('width', width)
       .attr("viewBox",originX+" "+originY+" "+(width*aspect)+" "+(height*aspect));

    // update the background 'touch' panel handling pan events
    eventPanel.attr('width', width*aspect)
        .attr('height', height*aspect)
        .attr('transform', function(d) {
          return 'translate(' + originX + ',' + originY + ')';
        });
  }

  function getNode(id, nodes) {
    for( var i = 0; i < nodes.length; i++ ) {
      if( nodes[i].feature.id == id ) return nodes[i];
    }
    return null;
  }

  function zoomIn() {
    aspect -= .2;
    updateView();
  }

  function zoomOut() {
    aspect += .2;
    updateView();
  }

  $(window).on('resize', function(){
    width = $("#mygraph").width();
    updateView();
  });

  return {
    redraw : redraw,
    zoomIn : zoomIn,
    zoomOut : zoomOut,
    resize  : resize
  }

})();







