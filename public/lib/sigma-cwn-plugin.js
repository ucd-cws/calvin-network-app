'use strict';

var renderer = require('./renderer');

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

  renderer.Junction(context, {
    x: node[prefix + 'x']-node[prefix + 'size'],
    y: node[prefix + 'y']-node[prefix + 'size'],
    width: s,
    height: s
  });
};

sigma.canvas.nodes['Power Plant'] = function(node, context, settings) {
  var prefix = settings('prefix') || '';

  var s = node[prefix + 'size']*2;

  renderer['Power Plant'](context, {
    x: node[prefix + 'x']-node[prefix + 'size'],
    y: node[prefix + 'y']-node[prefix + 'size'],
    width: s,
    height: s
  });
};

sigma.canvas.nodes['Pump Plant'] = function(node, context, settings) {
  var prefix = settings('prefix') || '';

  var s = node[prefix + 'size']*2;

  renderer['Pump Plant'](context, {
    x: node[prefix + 'x']-node[prefix + 'size'],
    y: node[prefix + 'y']-node[prefix + 'size'],
    width: s,
    height: s
  });
};

sigma.canvas.nodes['Water Treatment'] = function(node, context, settings) {
  var prefix = settings('prefix') || '';

  var s = node[prefix + 'size']*2;

  renderer['Water Treatment'](context, {
    x: node[prefix + 'x']-node[prefix + 'size'],
    y: node[prefix + 'y']-node[prefix + 'size'],
    width: s,
    height: s
  });
};

sigma.canvas.nodes['Surface Storage'] = function(node, context, settings) {
  var prefix = settings('prefix') || '';

  var s = node[prefix + 'size']*2;

  renderer['Surface Storage'](context, {
    x: node[prefix + 'x']-node[prefix + 'size'],
    y: node[prefix + 'y']-node[prefix + 'size'],
    width: s,
    height: s
  });
};

sigma.canvas.nodes['Groundwater Storage'] = function(node, context, settings) {
  var prefix = settings('prefix') || '';

  var s = node[prefix + 'size']*2;

  renderer['Groundwater Storage'](context, {
    x: node[prefix + 'x']-node[prefix + 'size'],
    y: node[prefix + 'y']-node[prefix + 'size'],
    width: s,
    height: s
  });
};

sigma.canvas.nodes['Agricultural Demand'] = function(node, context, settings) {
  var prefix = settings('prefix') || '';

  var s = node[prefix + 'size']*2;

  renderer['Agricultural Demand'](context, {
    x: node[prefix + 'x']-node[prefix + 'size'],
    y: node[prefix + 'y']-node[prefix + 'size'],
    width: s,
    height: s
  });
};

sigma.canvas.nodes['Urban Demand'] = function(node, context, settings) {
  var prefix = settings('prefix') || '';

  var s = node[prefix + 'size']*2;

  renderer['Urban Demand'](context, {
    x: node[prefix + 'x']-node[prefix + 'size'],
    y: node[prefix + 'y']-node[prefix + 'size'],
    width: s,
    height: s
  });
};

sigma.canvas.nodes.Sink = function(node, context, settings) {
  var prefix = settings('prefix') || '';

  var s = node[prefix + 'size']*2;

  renderer.Sink(context, {
    x: node[prefix + 'x']-node[prefix + 'size'],
    y: node[prefix + 'y']-node[prefix + 'size'],
    width: s,
    height: s
  });
};

sigma.canvas.nodes['Non-Standard Demand'] = function(node, context, settings) {
  var prefix = settings('prefix') || '';

  var s = node[prefix + 'size']*2;

  renderer['Non-Standard Demand'](context, {
    x: node[prefix + 'x']-node[prefix + 'size'],
    y: node[prefix + 'y']-node[prefix + 'size'],
    width: s,
    height: s
  });
};

sigma.canvas.nodes.Wetland = function(node, context, settings) {
  var prefix = settings('prefix') || '';

  var s = node[prefix + 'size']*2;


  renderer.Wetland(context, {
    x: node[prefix + 'x']-node[prefix + 'size'],
    y: node[prefix + 'y']-node[prefix + 'size'],
    width: s,
    height: s
  });
};



sigma.utils.pkg('sigma.canvas.edges');

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

  var color = renderer.colors.salmon;
  if( edge.calvin.renderInfo ) {
      if( edge.calvin.renderInfo.type == 'flowToSink' ) {
        color = renderer.colors.lightGrey;
      } else if( edge.calvin.renderInfo.type == 'returnFlowFromDemand' ) {
          color = renderer.colors.red;
      } else if( edge.calvin.renderInfo.type == 'gwToDemand' ) {
          color = renderer.colors.black;
      } else if( edge.calvin.renderInfo.type == 'artificalRecharge' ) {
          color = renderer.colors.purple;
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
  context.lineTo(aX + vY * 0.8, aY - vX * 0.8);
  context.lineTo(aX - vY * 0.8, aY + vX * 0.8);
  context.lineTo(aX + vX, aY + vY);
  context.closePath();
  context.fill();

};

