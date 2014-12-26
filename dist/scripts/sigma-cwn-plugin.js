;(function() {
  'use strict';

  sigma.utils.pkg('sigma.canvas.nodes');

  /**
   *
   * @param  {object}                   node     The node object.
   * @param  {CanvasRenderingContext2D} context  The canvas context.
   * @param  {configurable}             settings The settings function.
   */
  sigma.canvas.nodes.Junction = function(node, context, settings) {
    var prefix = settings('prefix') || '';

    var s = node[prefix + 'size']*2;

    CWN.render.Junction(
      context, 
      node[prefix + 'x']-node[prefix + 'size'], 
      node[prefix + 'y']-node[prefix + 'size'],
      s,
      s
    ); 
  };

  sigma.canvas.nodes['Power Plant'] = function(node, context, settings) {
    var prefix = settings('prefix') || '';
    
    var s = node[prefix + 'size']*2;

    CWN.render['Power Plant'](
      context, 
      node[prefix + 'x']-node[prefix + 'size'], 
      node[prefix + 'y']-node[prefix + 'size'],
      s,
      s
    ); 
  };

  sigma.canvas.nodes['Pump Plant'] = function(node, context, settings) {
    var prefix = settings('prefix') || '';
    
    var s = node[prefix + 'size']*2;

    CWN.render['Pump Plant'](
      context, 
      node[prefix + 'x']-node[prefix + 'size'], 
      node[prefix + 'y']-node[prefix + 'size'],
      s,
      s
    ); 
  };

  sigma.canvas.nodes['Water Treatment'] = function(node, context, settings) {
    var prefix = settings('prefix') || '';
    
    var s = node[prefix + 'size']*2;

    CWN.render['Water Treatment'](
      context, 
      node[prefix + 'x']-node[prefix + 'size'], 
      node[prefix + 'y']-node[prefix + 'size'],
      s,
      s
    ); 
  };

  sigma.canvas.nodes['Surface Storage'] = function(node, context, settings) {
    var prefix = settings('prefix') || '';
    
    var s = node[prefix + 'size']*2;

    CWN.render['Surface Storage'](
      context, 
      node[prefix + 'x']-node[prefix + 'size'], 
      node[prefix + 'y']-node[prefix + 'size'],
      s,
      s
    ); 
  };

  sigma.canvas.nodes['Groundwater Storage'] = function(node, context, settings) {
    var prefix = settings('prefix') || '';
    
    var s = node[prefix + 'size']*2;

    CWN.render['Groundwater Storage'](
      context, 
      node[prefix + 'x']-node[prefix + 'size'], 
      node[prefix + 'y']-node[prefix + 'size'],
      s,
      s
    ); 
  };

  sigma.canvas.nodes['Agricultural Demand'] = function(node, context, settings) {
    var prefix = settings('prefix') || '';
    
    var s = node[prefix + 'size']*2;

    CWN.render['Agricultural Demand'](
      context, 
      node[prefix + 'x']-node[prefix + 'size'], 
      node[prefix + 'y']-node[prefix + 'size'],
      s,
      s
    ); 
  };

  sigma.canvas.nodes['Urban Demand'] = function(node, context, settings) {
    var prefix = settings('prefix') || '';
    
    var s = node[prefix + 'size']*2;

    CWN.render['Urban Demand'](
      context, 
      node[prefix + 'x']-node[prefix + 'size'], 
      node[prefix + 'y']-node[prefix + 'size'],
      s,
      s
    ); 
  };

  sigma.canvas.nodes.Sink = function(node, context, settings) {
    var prefix = settings('prefix') || '';
    
    var s = node[prefix + 'size']*2;

    CWN.render.Sink(
      context, 
      node[prefix + 'x']-node[prefix + 'size'], 
      node[prefix + 'y']-node[prefix + 'size'],
      s,
      s
    ); 
  };

  sigma.canvas.nodes['Non-Standard Demand'] = function(node, context, settings) {
    var prefix = settings('prefix') || '';
    
    var s = node[prefix + 'size']*2;

    CWN.render['Non-Standard Demand'](
      context, 
      node[prefix + 'x']-node[prefix + 'size'], 
      node[prefix + 'y']-node[prefix + 'size'],
      s,
      s
    ); 
  };

  sigma.canvas.nodes.Wetland = function(node, context, settings) {
    var prefix = settings('prefix') || '';
    
    var s = node[prefix + 'size']*2;

    CWN.render.Wetland(
      context, 
      node[prefix + 'x']-node[prefix + 'size'], 
      node[prefix + 'y']-node[prefix + 'size'],
      s,
      s
    ); 
  };
})();


(function() {
  'use strict';

  sigma.utils.pkg('sigma.canvas.edges');
  var markers = {
    cost : function(cxt, x, y, s){
      cxt.beginPath();
      cxt.arc(x, y, s, 0, 2 * Math.PI, false);
      cxt.fillStyle = CWN.colors.green;
      cxt.fill();
      cxt.closePath();
    },
    amplitude : function(cxt, x, y, s){
      cxt.beginPath();
      cxt.arc(x, y, s, 0, 2 * Math.PI, false);
      cxt.lineWidth = 2;
      cxt.strokeStyle = CWN.colors.black;
      cxt.stroke();
      cxt.closePath();
    },
    constraints : function(cxt, x, y, s, vX, vY){
      cxt.beginPath();
      /*cxt.moveTo(x + vY, y - vX);
      cxt.lineTo(x + vY, y + vX);
      cxt.lineTo(x - vY, y + vX);
      cxt.lineTo(x - vY, y - vX);
      cxt.lineTo(x + vY, y - vX);
      cxt.lineWidth = 2;
      cxt.strokeStyle = CWN.colors.black;
      cxt.stroke();*/
      var dx = vX * .4;
      var dy = vY * .4;   

      cxt.beginPath();
      cxt.moveTo(x+vY+dx, y-vX+dy);
      cxt.lineTo(x+vY-dx, y-vX-dy);
      
      cxt.lineTo(x-vY-dx, y+vX-dy);
      cxt.lineTo(x-vY+dx, y+vX+dy);
      cxt.lineTo(x+vY+dx, y-vX+dy);
      cxt.strokeStyle = CWN.colors.black;
      cxt.stroke();
      cxt.closePath();
      
    }, 
    environmental : function(cxt, x, y, s){
      cxt.beginPath();
      cxt.arc(x, y, s, 0, 2 * Math.PI, false);
      cxt.lineWidth = 2;
      cxt.strokeStyle = CWN.colors.green;
      cxt.stroke();
      cxt.closePath();
    }
  };

  /**
   * This edge renderer will display edges as arrows going from the source node
   *
   * @param  {object}                   edge         The edge object.
   * @param  {object}                   source node  The edge source node.
   * @param  {object}                   target node  The edge target node.
   * @param  {CanvasRenderingContext2D} context      The canvas context.
   * @param  {configurable}             settings     The settings function.
   */
  sigma.canvas.edges.cwn = function(edge, source, target, context, settings) {

    var color = edge.color,
        prefix = settings('prefix') || '',
        edgeColor = settings('edgeColor'),
        defaultNodeColor = settings('defaultNodeColor'),
        defaultEdgeColor = settings('defaultEdgeColor'),
        size = edge[prefix + 'size'] || 1,
        tSize = target[prefix + 'size'],
        sX = source[prefix + 'x'],
        sY = source[prefix + 'y'],
        tX = target[prefix + 'x'],
        tY = target[prefix + 'y'],
        aSize = Math.max(size * 2.5, settings('minArrowSize')),
        d = Math.sqrt(Math.pow(tX - sX, 2) + Math.pow(tY - sY, 2)),
        aX = sX + (tX - sX) * (d - aSize - tSize) / d,
        aY = sY + (tY - sY) * (d - aSize - tSize) / d,
        vX = (tX - sX) * aSize / d,
        vY = (tY - sY) * aSize / d;

    var color = CWN.colors.salmon;
    if( edge.calvin.renderInfo ) {
        if( edge.calvin.renderInfo.type == 'flowToSink' ) {
          color = CWN.colors.lightGrey;
        } else if( edge.calvin.renderInfo.type == 'returnFlowFromDemand' ) {
            color = CWN.colors.red;
        } else if( edge.calvin.renderInfo.type == 'gwToDemand' ) {
            color = CWN.colors.black;
        } else if( edge.calvin.renderInfo.type == 'artificalRecharge' ) {
            color = CWN.colors.purple;
        }
    }

    context.strokeStyle = color;
    context.lineWidth = size;
    context.beginPath();
    context.moveTo(sX, sY);
    context.lineTo(
      aX,
      aY
    );
    context.stroke();

    context.fillStyle = color;
    context.beginPath();
    context.moveTo(aX + vX, aY + vY);
    context.lineTo(aX + vY * 0.6, aY - vX * 0.6);
    context.lineTo(aX - vY * 0.6, aY + vX * 0.6);
    context.lineTo(aX + vX, aY + vY);
    context.closePath();
    context.fill();

    /* Now lets line add markers */
    var mX = sX+vX*3, mY = sY+vY*3;
    if( edge.calvin.renderInfo ) {
      for( var key in markers ) {
        if( edge.calvin.renderInfo[key]) {
          markers[key](context, mX, mY, 4, vX, vY);
          mX += vX * 1.75;
          mY += vY * 1.75;
        }
      }
    }

  };
})();