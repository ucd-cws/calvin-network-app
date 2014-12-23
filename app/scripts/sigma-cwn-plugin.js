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