/* global render functions for svg and canvas icons */

if( !window.CWN ) window.CWN = {};

/*
CWN.colors = {
  base : '#ffffca',
  lightGrey : '#7b7b79',
  green : '#8fd248',
  orange : '#ffcd96',
  lightBlue : '#91cbdd',
  red : '#ff0800',
  blue : '#4f7fbf',
  purple : '#7228a2',
  black : '#000000'
};

CWN.colors.rgb = {
  base : [255,255,202],
  lightGrey : [70,70,70],
  green : [143,210,72],
  orange : [255,205,150],
  lightBlue : [145,203,221],
  red : [255,8,0],
  blue : [79,127,191],
  purple : [114,40,162],
  black:[0,0,0]
}*/

CWN.colors = {
  base : '#1976D2',
  lightBlue : '#BBDEFB',
  blue : '#1976D2',
  lightGrey : '#727272',
  orange : '#FF5722',
  red : '#D32F2F',
  green : '#4CAF50',
  yellow : '#FFEB3B',
  black : '#212121',
  cyan : '#00BCD4',
  darkCyan : '#0097A7',
  indigo : '#3F51B5'
};

CWN.colors.rgb = {
  base : [25, 118, 210],
  lightBlue : [187, 222, 251],
  blue : [25, 118, 210],
  lightGrey : [114, 114, 114],
  orange : [255, 87, 34],
  green : [76, 175, 80],
  red : [211, 47, 47],
  yellow : [255, 235, 59],
  cyan : [0, 188, 212],
  darkCyan : [0, 151, 167],
  black:[21,21,21],
  indigo : [63, 81, 181]
};


// elements that need charts can push to this array callbacks for when charts are loaded
CWN.chartLoadHandlers = [];

google.load("visualization", '1', {
    packages:['corechart', 'table'],
    callback : function() {
        for( var i = 0; i < CWN.chartLoadHandlers.length; i++ ) {
            CWN.chartLoadHandlers[i]();
        }
    }
});


// reneder an icon on a canvas
CWN.render = {};


// create an icon on a canvas
CWN.icon = function(type, width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    if( !CWN.render[type] ) return canvas;

    var ctx = canvas.getContext('2d');
    CWN.render[type](ctx, 2, 2, width-4, height-4);

    return canvas;
}

CWN.getColor = function(name, opacity) {
  if( opacity === undefined ) opacity = 1;
  return 'rgba('+CWN.colors.rgb[name].join(',')+','+opacity+')';
}

/** render icon on canvas context **/
/** all icons take a canvas context, left, top, width and height, opacity **/
CWN.render.Junction = function(ctx, config) {
    ctx.fillStyle = config.fill ||  CWN.getColor('blue', config.opacity);
    ctx.strokeStyle = config.stroke || CWN.getColor('black', config.opacity);
    ctx.lineWidth = config.lineWidth || 2;

    var r = config.width / 2;

    ctx.beginPath();
    ctx.arc(config.x+r, config.y+r, r, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

CWN.render['Power Plant'] = function(ctx, config) {
    config.fill = CWN.getColor('darkCyan', config.opacity);

    CWN.render['Junction'](ctx, config);
    var r = config.width / 2;

    // horizontal line
    ctx.beginPath();
    ctx.moveTo(config.x, config.y+r);
    ctx.lineTo(config.x+config.width, config.y+r);
    ctx.stroke();
    ctx.closePath();

    // vertical line
    ctx.beginPath();
    ctx.moveTo(config.x+r, config.y);
    ctx.lineTo(config.x+r, config.y+config.width);
    ctx.stroke();
    ctx.closePath();
}

CWN.render['Pump Plant'] = function(ctx, config) {
    config.fill = CWN.getColor('indigo', config.opacity);

    CWN.render['Junction'](ctx, config);

    var r = config.width / 2;
    var cx = config.x + r;
    var cy = config.y + r;

    var x1 = cx + r * Math.cos(Math.PI/4);
    var y1 = cy + r * Math.sin(Math.PI/4);
    var x2 = cx + r * Math.cos(Math.PI * (5/4));
    var y2 = cy + r * Math.sin(Math.PI * (5/4));

    // line 1
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();

    x1 = cx + r * Math.cos(Math.PI * (3/4));
    y1 = cy + r * Math.sin(Math.PI * (3/4));
    x2 = cx + r * Math.cos(Math.PI * (7/4));
    y2 = cy + r * Math.sin(Math.PI * (7/4));

    // line 2
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}

CWN.render['Water Treatment'] = function(ctx, config) {
    ctx.fillStyle = config.fill || CWN.getColor('cyan', config.opacity);
    ctx.strokeStyle = config.stroke || CWN.getColor('black', config.opacity);
    ctx.lineWidth = config.lineWidth || 2;

    CWN.render._nSidedPath(ctx, config.x, config.y, config.width/2, 8, 22.5);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}

CWN.render['Surface Storage'] = function(ctx, config) {
    ctx.fillStyle = config.fill || CWN.getColor('yellow', config.opacity);
    ctx.strokeStyle = config.stroke || CWN.getColor('black', config.opacity);
    ctx.lineWidth = config.lineWidth || 2;

    CWN.render._nSidedPath(ctx, config.x, config.y, config.width/2, 3, 90);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}

CWN.render['Groundwater Storage'] = function(ctx, config) {
    var r = config.width / 2;

    var grd = ctx.createLinearGradient(config.x+r, config.y, config.x+r, config.y+config.height-(.25*config.height));
    grd.addColorStop(0, config.stroke || CWN.getColor('blue', config.opacity));
    grd.addColorStop(1, config.fill || CWN.getColor('green', config.opacity));
    ctx.fillStyle=grd;

    ctx.strokeStyle = config.stroke || CWN.getColor('black', config.opacity);
    ctx.lineWidth = config.lineWidth || 2;

    CWN.render._nSidedPath(ctx, config.x, config.y, r, 3, 90);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}

CWN.render['Sink'] = function(ctx, config) {
    ctx.fillStyle = config.fill || CWN.getColor('base', config.opacity);
    ctx.strokeStyle = config.stroke || CWN.getColor('black', config.opacity);
    ctx.lineWidth = config.lineWidth || 2;

    CWN.render._nSidedPath(ctx, config.x, config.y, config.width/2, 4, 45);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}

CWN.render['Non-Standard Demand'] = function(ctx, config) {
    ctx.fillStyle = config.fill || CWN.getColor('red', config.opacity);
    ctx.strokeStyle = config.stroke || CWN.getColor('black', config.opacity);
    ctx.lineWidth = config.lineWidth || 2;

    CWN.render._nSidedPath(ctx, config.x, config.y, config.width/2, 4, 45);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}

CWN.render['Agricultural Demand'] = function(ctx, config) {
    if( !config.stroke ) config.stroke = CWN.getColor('black', config.opacity);
    if( !config.fill ) config.fill = CWN.getColor('lightBlue', config.opacity);

    CWN.render._oval(ctx, config);
}

CWN.render['Urban Demand'] = function(ctx, config) {
    if( !config.stroke ) config.stroke = CWN.getColor('black', config.opacity);
    if( !config.fill ) config.fill = CWN.getColor('orange', config.opacity);

    CWN.render._oval(ctx, config);
}

CWN.render.Wetland = function(ctx, config) {
    if( !config.stroke ) config.stroke = CWN.getColor('black', config.opacity);
    if( !config.fill ) config.fill = CWN.getColor('green', config.opacity);

    CWN.render._oval(ctx, config);
}

CWN.render._oval = function(ctx, config) {
    ctx.fillStyle = config.fill;
    ctx.strokeStyle = config.stroke;
    ctx.lineWidth = config.lineWidth || 2;

    config.height -= config.width * .5;
    config.y += config.height / 2;

    var kappa = .5522848,
      ox = (config.width / 2) * kappa, // control point offset horizontal
      oy = (config.height / 2) * kappa, // control point offset vertical
      xe = config.x + config.width,           // x-end
      ye = config.y + config.height,           // y-end
      xm = config.x + config.width / 2,       // x-middle
      ym = config.y + config.height / 2;       // y-middle

    ctx.beginPath();
    ctx.moveTo(config.x, ym);
    ctx.bezierCurveTo(config.x, ym - oy, xm - ox, config.y, xm, config.y);
    ctx.bezierCurveTo(xm + ox, config.y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, config.x, ym + oy, config.x, ym);
    ctx.fill();
    ctx.stroke();
}

/** helper for treatment, surface storage and ground water **/
CWN.render._nSidedPath = function(ctx, left, top, radius, sides, startAngle) {
    // this is drawing from center
    left += radius;
    top += radius;

    var a = ((Math.PI * 2)/sides);
    var r = startAngle * (Math.PI / 180), x, y;

    // think you need to adjust by x, y
    ctx.beginPath();
    var xs = left + (radius * Math.cos(-1 * r));
    var ys = top + (radius * Math.sin(-1 * r));
    ctx.moveTo(xs, ys);
    for (var i = 1; i < sides; i++) {
        x = left + (radius * Math.cos(a*i-r));
        y = top + (radius * Math.sin(a*i-r));
        ctx.lineTo(x, y);
    }
    ctx.lineTo(xs, ys);

    // not painting, leave this to the draw function
}

/* Line Markers */
CWN.render.lineMarkers = {
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
