// load the libraries
google.load("visualization", '1', {packages:['corechart', 'table']});


var app = (function(){

  var legend = {
      'Power Plant Node'         : {
          d3 : '#3366cc',
          google : 'small_red'
      },
      'Agricultural Demand Node' : {
          d3 : '#ff9900',
          google : 'small_yellow'
      },
      'Junction Node'            : {
          d3 : '#109618',
          google : 'small_green'
      },
      'Pump Plant Node'          : {
          d3 : '#990099',
          google : 'small_blue'
      },
      'Water Treatment Node'     : {
          d3 : '#0099c6',
          google : 'small_purple'
      },
      'Surface Storage Node'     : {
          d3 : '#dd4477',
          google : 'measle_brown',
      },
      'Urban Demand Node'        : {
          d3 : '#66aa00',
          google : 'measle_grey'
      },
      'Sink Node'                : {
          d3 : '#b82e2e',
          google : 'measle_white'
      },
      'Groundwater Storage Node' : {
          d3 : '#316395',
          google : 'measle_turquoise'
      },
      'Non-Standard Demand Node' : {
          d3 : '#22aa99',
          google : 'shaded_dot'
      }
  }

  var allData;
  var nodeData;
  var cGraphScale;
  var active = 'map';
  var xmlParser = new DOMParser();

  function init() {
    var query = new google.visualization.Query(
    'http://watershed.ice.ucdavis.edu/vizsource/rest?view=item&tq=SELECT%20*');
    query.send(onDataLoad);

    // init filters
    var ele = $("#filter-types"), cb;
    for( var key in app.legend ) {
      var cb = $('<label class="checkbox-inline"><input type="checkbox" value="'+key+'" id="input-map-'+key.replace(/\s/g,'_')+'" checked /> '+
          '<div style="display:inline-block;padding:2px 2px 0 2px;border: 2px solid '+app.legend[key].d3+';border-radius:4px"> <span id="filter-icon-'+
          key.replace(/\s/g,'_')+'"></span><div style="vertical-align:top;display:inline-block;padding:2px 0 0 2px"> '+key+'<div></div></label>');
      cb.on('click', function() {
        update();
      });
      ele.append(cb);

      // add icon
      var i = getIcon(key, 22, 22);
      $('#filter-icon-'+key.replace(/\s/g,'_')).append($(i));
    }
    var selectAll = $('<a class="btn btn-link">Select All</a>').on('click', function(){
      ele.find('input').prop('checked',true);
      update();
    });
    var unselectAll = $('<a class="btn btn-link">Unselect All</a>').on('click', function(){
      ele.find('input').removeAttr('checked');
      update();
    });
     ele.append($('<br />')).append(selectAll).append(unselectAll);

    // set filter handler
    $("#filter-input").on('keyup', function(e){
      if( e.which == 13 ) update();
    });

    $("#calibration-mode").on('click', function(){
      update();
    });

    // init modal
    $('#info-popup').modal({show:false});

    // init tabs
    $('.pill').on('click', function(e){
      $('#filter-input').attr('disabled','disabled').val('');
      $('.pill').parent().removeClass('active');
      $('.tab-pane').removeClass('active');
      $(e.currentTarget).parent().addClass('active');
      active = $(e.currentTarget).attr('tab');
      $('#'+active).addClass('active');

      // now check for some ui conditions
      if(active != 'table') {
        $('#filter-input').removeAttr('disabled');
      }

      update();

      if( active == 'graph' ) {
        app.d3.resize();
      }
      
      
    });

    getIcon('Power Plant Node', 200, 200);
  }

  function update() {
    var checked = $("#filter-types input:checked");
    var types = [];
    for( var i = 0; i < checked.length; i++ ) {
        types.push($(checked[i]).val().replace(/_/,' '));
    }

    if( active == 'map' ) {
      app.map.update(getData({
        query : $("#filter-input").val(),
        cMode : $('#calibration-mode').is(':checked'),
        types : types
      }));
    } else if ( active == 'graph' ) {
      app.d3.redraw(getData({
          query : $("#filter-input").val(),
          cMode : $('#calibration-mode').is(':checked'),
          types : types
      }));
    }
    
  }

  function getActive() {
    return active;
  }

  function onDataLoad(response) {
    if (response.isError()) {
      alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
      return;
    }

    var data = response.getDataTable();
    

    // create table
    var table = new google.visualization.Table(document.getElementById('table'));
    table.draw(data, {});
    
    var columnMap = [];
    for( var i = 0; i < data.getNumberOfColumns(); i++ ) {
      columnMap.push(data.getColumnLabel(i));
    }

    allData = [];
    nodeData = {};
    for( var i = 0; i < data.getNumberOfRows(); i++ ) {
      var d = {};
      for( var j = 0; j < data.getNumberOfColumns(); j++ ) {
        d[columnMap[j]] = data.getValue(i, j);
        if( columnMap[j] == 'geom' ) parseXmlGeo(d);
      }

      // parse embeded json data
      if( typeof d.json == 'string' ) d.json = JSON.parse(d.json);

      if( d.node_type == 'node' ) {
        d.label = d.prmname;
        d.id = d.json.prmname;
      } else if ( d.node_type == 'link' ) {
        d.label = d.prmname;
        d.id = d.json.prmname;
        d.from = d.json.origin;
        d.to = d.json.terminus;
      }

      //console.log(d.label);
      allData.push(d);
      if( d.id != null ) nodeData[d.id] = d;
    }

    for( var i = 0; i < allData.length; i++ ) {
      if( allData[i].node_type == 'node' ) continue;
      setLength(allData[i]);
    }

    var node, hasIn, hasOut;
    for( var i = 0; i < allData.length; i++ ) {
      if( allData[i].node_type == 'link' ) continue;
      node = allData[i];

      hasIn = false;
      hasOut = false;
      for( var j = 0; j < allData.length; j++ ) {
        if( allData[j] == 'node' ) continue;

        if( isCalibration(allData[j].prmname.replace(/\s/g, ' ')) ) {
          if( allData[j].to == node.prmname ) {
            hasIn = true;
          }
          if( allData[j].from == node.prmname ) {
            hasOut = true;
          }
          

          if( hasIn && hasOut ) break;
        }
      }

      if( hasOut && hasIn ) {
        node.cmode = 'both';
        console.log("Marking calibration: both "+node.prmname);
      } else if ( hasOut ) node.cmode = 'out';
      else if ( hasIn ) node.cmode = 'in';
      else node.cmode = '';
    }

    app.map.init();
    //app.d3.init();

    update();
  }

  function getData(filter) {
    if( !filter ) {
      filter = {
        query : '*',
      }
    }
    if( !filter.query ) filter.query = '*';
    if( filter.query.length == 0 ) filter.query = '*';
    
    var re = new RegExp('^'+filter.query.toLowerCase().replace(/\*/g,'.*')+'$');

    var nodes = [];
    var edges = [];
    var used = [];

    // find all matching nodes
    for( var i = 0; i < allData.length; i++ ) {
      if( allData[i].id != null && 
          allData[i].node_type == 'node' &&
          isMatch(re, filter.types, allData[i]) &&
          checkCalibration(allData[i], filter.cMode) ) {

        nodes.push(allData[i]);
        used.push(allData[i].id);
      }
    }
    
    // find all edges attached to matched nodes
    for( var i = 0; i < allData.length; i++ ) {
      if( allData[i].node_type == 'link' && 
          (used.indexOf(allData[i].to) != -1 || used.indexOf(allData[i].from) != -1) &&
          checkCalibration(allData[i], filter.cMode) ) {
        edges.push(allData[i]);
      }
    }

    // now loop through all matched edges and make sure both nodes are in
    var fused = [];
    for( var i = 0; i < edges.length; i++ ) {

      var to = used.indexOf(edges[i].to);
      var from = used.indexOf(edges[i].from);

      if( to == -1 && from != -1 && fused.indexOf(nodeData[edges[i].to].id) == -1 ) {
        if( filter.cMode && isCalibration(edges[i].to) ) continue;

        var n = $.extend(true, {}, nodeData[edges[i].to]);
        n.oneStep = true;
        nodes.push(n);
        fused.push(n.id);
      } else if( to != -1 && from == -1 && fused.indexOf(nodeData[edges[i].from].id) == -1) {
        if( filter.cMode && isCalibration(edges[i].from) ) continue;

        var n = $.extend(true, {}, nodeData[edges[i].from]);
        n.oneStep = true;
        nodes.push(n);
        fused.push(n.id);
      }
    }

    return {
      nodes: nodes,
      edges: edges,
    };
  }

  // check if calibration node or link, if so hide (return false).
  // set cmode status for nodes
  function checkCalibration(item, cMode) {
    if( !cMode ) return true;

    if( item.node_type == 'node' ) {
      if( isCalibration(item.prmname) ) return false;
      else return true;
    } else {
      if( isCalibration(item.prmname.replace(/_/g,' ')) ) return false;
      else if( isCalibration(item.to) ) return false;
      else if( isCalibration(item.from) ) return false;
      return true;
    }
  }

  function isCalibration(name) {
    name = name.split(' ');
    for( var i = 0; i < name.length; i++ ) {
      if( name[i].match(/^CN.*/) ) return true;
    }
    return false;
  }

  // see if regex matches node
  function isMatch(re, types, item) {
    if( !types ) {
      if( re.test(item.prmname.toLowerCase()) || re.test(item.description.toLowerCase()) ) return true;
      return false;
    }

    if( (re.test(item.prmname.toLowerCase()) || re.test(item.description.toLowerCase())) &&
        types.indexOf(item.type) > -1 ) return true;
    return false;
  }

  function parseXmlGeo(d) {
    if( !d.geom ) d.geom = '';
    if( d.geom.length == 0 ) {
       d.geom = {};
       return;
    }

    
    d.geom = JSON.parse(xml2json(xmlParser.parseFromString(d.geom,'text/xml'), "  "));

    // now create ids
    if( d.node_type == 'node' ) {
      d.label = d.prmname;
      //d.id = getIdFromPoint(d.geom.Point.coordinates, d);
    } else if ( d.node_type == 'link' && d.geom.LineString ) {
      var parts = d.geom.LineString.coordinates.split(' ');
      d.label = d.prmname;
      //d.from = getIdFromPoint(parts[0]);
      //d.to = getIdFromPoint(parts[1]);
    }

  }


  var ids = [];
  var objs = {};
  function getIdFromPoint(p, obj) {
    var parts = p.split(',');
    return parts[0]+'-'+parts[1];
  }

  function setLength(link) {
    if( !nodeData[link.to] || !nodeData[link.from] ) return;
    var p1 = nodeData[link.to].geom.Point.coordinates.split(',');
    var p2 = nodeData[link.from].geom.Point.coordinates.split(',');

    p1 = [parseFloat(p1[0]), parseFloat(p1[1])];
    p2 = [parseFloat(p2[0]), parseFloat(p2[1])];

    var x = Math.abs(p2[0] - p1[0]);
    var y = Math.abs(p2[1] - p1[1]);

    var l = Math.sqrt((x*x)+(y*y));

    if( isNaN(l) ) l = 300;
    else l = l*500;

    if( l < 50 ) l = 50;


    link.l = l;
  }

  function showInfo(id) {
    $('#info-body-nodes, #info-body-links').html('No items matched');

    var isLink = false;
    var start = '';
    var stop = '';
    if( id.match(/.*_.*/) ) {
      isLink = true;
      for( var i = 0; i < allData.length; i++) {
        if( allData[i].id == id ) {
          start = allData[i].json.origin;
          stop = allData[i].json.terminus;
          break;
        }
      }
    }

    var html = '';
    var matched = [];
    for( var i = 0; i < allData.length; i++) {
      if( allData[i].id == id && allData[i].node_type == 'node' ) {
        html += appendInfo(allData[i]);
        matched.push(id);
      }

      if( isLink && (allData[i].id == start || allData[i].id == stop)) {
        html += appendInfo(allData[i]);
        //matched.push(allData[i].id);
      }
    }
    if( html.length > 0 ) $('#info-body-nodes').html(html);

    var html = '';
    for( var i = 0; i < allData.length; i++) {
      if( allData[i].node_type == 'link' && 
          (matched.indexOf(allData[i].to) > -1 || matched.indexOf(allData[i].from) > -1) ) {
        
        var nested = '';
        if( matched.indexOf(allData[i].to) == -1 && matched.indexOf(allData[i].from) != -1 ) {
          nested = appendInfo(nodeData[allData[i].to]);
        } else if ( matched.indexOf(allData[i].to) != -1 && matched.indexOf(allData[i].from) == -1 ){ 
          nested = appendInfo(nodeData[allData[i].from]);
        }
        html += appendInfo(allData[i], nested);

      }

      if( allData[i].id == id && allData[i].node_type == 'link') {
        html += appendInfo(allData[i], nested);
      }
    }
    if( html.length > 0 ) $('#info-body-links').html(html);

    $('#info-popup').modal('show');

    // now add charts
    setTimeout(function(){
        for( var i = 0; i < allData.length; i++) {
          if( allData[i].id == id ) {
            getJsonInfo(allData[i]);
          }
        }

        for( var i = 0; i < allData.length; i++) {
          if( allData[i].node_type == 'link' && 
              (matched.indexOf(allData[i].to) > -1 || matched.indexOf(allData[i].from) > -1) ) {
              if( matched.indexOf(allData[i].to) == -1 && matched.indexOf(allData[i].from) != -1 ) {
                getJsonInfo(nodeData[allData[i].to]);
              } else if ( matched.indexOf(allData[i].to) != -1 && matched.indexOf(allData[i].from) == -1 ){ 
                getJsonInfo(nodeData[allData[i].from]);
              }
              getJsonInfo(allData[i]);
          }


        }
    }, 500);

    // draw icons
    var eles = $('.popup-icon');
    for( var i = 0; i < eles.length; i++ ) {
      var icon = getIcon($(eles[i]).attr('type'), 64, 64);
      $(eles[i]).append($(icon));
    }
    
  }

  function appendInfo(obj, nested) {
      return '<div class="media"><a class="pull-left">' +
        '<div style="width:64px;height:64px;text-align: center;color: #333" class="'+(legend[obj.type] ? 'popup-icon' : '')+'" type="'+obj.type+'" >'+
          ( legend[obj.type] ? '' : '<i style="font-size:48px" class="fa fa-code-fork"></i>')+
        '</div>' +
      '</a>'+
      '<div class="media-body">' +
        '<h4 class="media-heading"><b>'+obj.type+'</b>  '+obj.prmname+'</h4>'+
        obj.description+
        ((obj.json && obj.json.el_ar_cap) ? '<div id="'+getChartId(obj)+'-ar" class="svgchart"></div><div id="'+getChartId(obj)+'-cap" class="svgchart"></div>' : '')+
        ((obj.json && obj.json.areacapfactor) ? '<div class="chart-attr"><b>Area Capacity Factor:</b> '+obj.json.areacapfactor+'</div>' : '')+
        ((obj.json && obj.json.amplitude) ? '<div class="chart-attr"><b>Amplitude:</b> '+obj.json.amplitude+'</div>' : '')+
        ((obj.json && obj.json.costmethod) ? '<div class="chart-attr"><b>Cost Method:</b> '+obj.json.costmethod+'</div>' : '')+
        ((obj.json && obj.json.constraintmethod) ? '<div class="chart-attr"><b>Constraint Method:</b> '+obj.json.constraintmethod+'</div>' : '')+
        ((obj.json && obj.json.origin) ? '<div class="chart-attr"><b>Origin:</b> '+_wrapChartLinks(obj.json.origin)+'</div>' : '')+
        ((obj.json && obj.json.terminus) ? '<div class="chart-attr"><b>Terminus:</b> '+_wrapChartLinks(obj.json.terminus)+'</div>' : '')+
        ((obj.json && obj.json.origins) ? '<div class="chart-attr"><b>Origins:</b> '+_wrapChartLinks(obj.json.origins)+'</div>' : '')+
        ((obj.json && obj.json.terminals) ? '<div class="chart-attr"><b>Terminals:</b> '+_wrapChartLinks(obj.json.terminals)+'</div>' : '')+
        (nested ? '<br />'+nested : '')+
      '</div></div>';
  }

  function _wrapChartLinks(links) {
    if( typeof links == 'string' ) {
      return '<a style="cursor:pointer" onclick="app.showInfo(\''+links+'\')">'+links+'</a>';
    }
    
    var arr = [];
    for( var i = 0; i < links.length; i++ ) {
      if( !links[i] ) {
        continue;
      }
      var parts = links[i].split('_');
       arr.push('<a style="cursor:pointer" onclick="app.showInfo(\''+links[i]+'\')">'+links[i]+'</a> ');
    }
    return arr.join(', ');
  }


  function getChartId(obj) {
    var id = '';
    if( obj.id ) id = obj.id;
    else if( obj.to && obj.from ) id = obj.to+'_'+obj.from;

    return 'chart-'+obj.prmname.replace(/[:\s]/g,'_')+'-'+id.replace(/[,\.]/g, '-');
  }

  /** QUINNS CHART CODE

   getPoint (inp el_ar_cap, vals el_ar_cap[])
RETURNS el_ar_cap AS $$
var o = {};
var l = vals.length -1 ;
if (isFinite(inp.el)) {
  o.el = inp.el;
  if ((inp.el < vals[0].el) || (inp.el > vals[l].el)) {
    o.cap=NaN; o.ar=NaN;
  } else {
  var i=1; while ( inp.el > vals[i].el) {i++;};                                                                          
  o.cap= vals[i-1].cap + (vals[i].cap - vals[i-1].cap) * (inp.el - vals[i-1].el)/(vals[i].el - vals[i-1].el);            
  o.ar= vals[i-1].ar +(vals[i].ar - vals[i-1].ar) * (inp.el - vals[i-1].el)/(vals[i].el - vals[i-1].el);                 
 }
} else if (isFinite(inp.ar)) {
  o.ar = inp.ar;
  if ((inp.ar < vals[0].ar) || (inp.ar > vals[l].ar)) {
    o.cap=NaN; o.el=NaN;
  } else {
  var i=1; while ( inp.ar > vals[i].ar) {i++;};                                                                          
  o.cap= vals[i-1].cap +(vals[i].cap - vals[i-1].cap) * (inp.ar - vals[i-1].ar)/(vals[i].ar - vals[i-1].ar);             
  o.el = vals[i-1].el +(vals[i].el  - vals[i-1].el) * (inp.ar - vals[i-1].ar)/(vals[i].ar - vals[i-1].ar);               
 }
} else if (isFinite(inp.cap)) {
  o.cap = inp.cap;
  if ((inp.cap < vals[0].cap) || (inp.cap > vals[l].cap)) {
    o.el=NaN; o.ar=NaN;                                                                                                  
  } else {
  var i=1; while ( inp.cap > vals[i].cap) {i++;};                                                                        
  o.ar= vals[i-1].ar + (vals[i].ar - vals[i-1].ar) * (inp.cap - vals[i-1].cap)/(vals[i].cap - vals[i-1].cap);            
  o.el = vals[i-1].el + (vals[i].el  - vals[i-1].el) * (inp.cap - vals[i-1].cap)/(vals[i].cap - vals[i-1].cap);          
 }
}

**/

  function getJsonInfo(obj) {
    if( !obj.json ) return;
    if( !obj.json.el_ar_cap ) return;

    var id = getChartId(obj);

    var data = [];
    for( var i = 0; i < obj.json.el_ar_cap.length; i++ ) {
      data.push([obj.json.el_ar_cap[i].cap, obj.json.el_ar_cap[i].el, obj.json.initialstorage, obj.json.endingstorage]);
    }
    data.sort(function(a, b){
      if( a[0] > b[0] ) return 1;
      if( a[0] < b[0] ) return -1;
      return 0;
    });
    data.splice(0,0,['Capacity','Elevation','Initial Storage','Final Storage']);

    data = google.visualization.arrayToDataTable(data);
    options = {
      hAxis : {
        title : 'Volume [kAc ft]'
      },
      vAxis : {
        title : 'Elevation [ft]'
      },
      legend : {
        position : 'none'
      }
    }

    var chart = new google.visualization.LineChart(document.getElementById(id+'-cap'));
    chart.draw(data, options);


    var data2 = [];
    for( var i = 0; i < obj.json.el_ar_cap.length; i++ ) {
      data2.push([obj.json.el_ar_cap[i].ar, obj.json.el_ar_cap[i].el]);
    }
    data2.sort(function(a, b){
      if( a[0] > b[0] ) return 1;
      if( a[0] < b[0] ) return -1;
      return 0;
    });
    data2.splice(0,0,['Area','Elevation']);

    data2 = google.visualization.arrayToDataTable(data2);
    var options2 = {
      hAxis : {
        title : 'Area [kAc]'
      },
      vAxis : {
        title : 'Elevation [ft]'
      },
      legend : {
        position : 'none'
      }
    }

    var chart2 = new google.visualization.LineChart(document.getElementById(id+'-ar'));
    chart2.draw(data2, options2);
      
  }

  function getIcon(type, width, height) {
      var canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      var c2 = canvas.getContext('2d');

      width -= 4;
      height -= 4;

      var x = width / 2;
      var y = height / 2;
      var r = x;
      if( y < r ) r = y;
      
      if( type == 'Junction Node' || type == 'Pump Plant Node' || type == 'Power Plant Node' ) {
        circle(c2, x+2, y+2, r, type);
      } else if ( type == 'Water Treatment Node' ) {
        polygon(c2, x+2, y+2, r, 6, 0, type);    
      } else if ( type == 'Surface Storage Node' || type == 'Groundwater Storage Node' ) {
        polygon(c2, x+2, y+2, r, 3, 90, type);
      } else if ( type == 'Agricultural Demand Node' || type == 'Urban Demand Node' ) {
        polygon(c2, x+2, y+2, r, 5, 18, type);    
      } else {
        polygon(c2, x+2, y+2, r, 4, 45, type);
      }
  
      return canvas;
  }

  function polygon(cxt, x, y, radius, sides, startAngle, type) {
      if (sides < 3) return;
      var a = (Math.PI * 2)/sides;
      var r = startAngle * (Math.PI / 180);
      cxt.beginPath();

      for (var i = 0; i <= sides; i++ ) {
          if( i == 0 ) cxt.lineTo(x+radius*Math.cos(i*a-r), y + radius*Math.sin(i*a-r));
          else cxt.lineTo(x+radius*Math.cos(i*a-r), y+radius*Math.sin(i*a-r));
      }
      cxt.closePath();

      cxt.fillStyle = legend[type].d3;
      cxt.fill();

      cxt.strokeStyle = "#333";
      cxt.lineWidth = 1;
      cxt.stroke();
  }

  function circle(cxt, x, y, r, type) {
    cxt.beginPath();
    cxt.arc(x,y,r-2,0,2*Math.PI);
    cxt.closePath();

    cxt.fillStyle = legend[type].d3;
    cxt.fill();

    cxt.strokeStyle = "#333";
    cxt.lineWidth = 1;
    cxt.stroke();
  }
  

  return {
    init : init,
    getData : getData,
    legend : legend,
    showInfo : showInfo
  }

})();

// on ready load initialize the app
google.setOnLoadCallback(function(){
  app.init();
});

