/* global render functions for svg and canvas icons */

var CWN = {
    colors : {
        base : '#ffffca',
        lightGrey : '#7b7b79',
        green : '#8fd248',
        salmon : '#ffcd96',
        lightBlue : '#91cbdd',
        red : '#ff0800',
        blue : '#4f7fbf',
        purple : '#7228a2',
        black : '#000000'
    },
    // reneder an icon on a canvas
    render : {},
};

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

/** render icon on canvas context **/
/** all icons take a canvas context, left, top, width and height **/
CWN.render.Junction = function(ctx, l, t, w, h) {
    ctx.fillStyle = CWN.colors.base;
    ctx.strokeStyle = CWN.colors.lightGrey;
    ctx.lineWidth = 1;

    var r = w / 2;

    ctx.beginPath();    
    ctx.arc(l+r, t+r, r, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

CWN.render['Power Plant'] = function(ctx, l, t, w, h) {
    CWN.render['Junction'](ctx, l, t, w, h);
    var r = w / 2;

    // horizontal line
    ctx.beginPath();
    ctx.moveTo(l,t+r);
    ctx.lineTo(l+w,t+r);
    ctx.stroke();
    ctx.closePath();

    // vertical line
    ctx.beginPath();
    ctx.moveTo(l+r,t);
    ctx.lineTo(l+r,t+w);
    ctx.stroke();
    ctx.closePath();
}

CWN.render['Pump Plant'] = function(ctx, l, t, w, h) {
    CWN.render['Junction'](ctx, l, t, w, h);
    var r = w / 2;
    var cx = l + r;
    var cy = t + r;

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

CWN.render['Water Treatment'] = function(ctx, l, t, w, h) {
    ctx.fillStyle = CWN.colors.base;
    ctx.strokeStyle = CWN.colors.lightGrey;
    ctx.lineWidth = 1;

    CWN.render._nSidedPath(ctx, l, t, w/2, 8, 22.5);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}

CWN.render['Surface Storage'] = function(ctx, l, t, w, h) {
    ctx.fillStyle = CWN.colors.base;
    ctx.strokeStyle = CWN.colors.lightGrey;
    ctx.lineWidth = 1;

    CWN.render._nSidedPath(ctx, l, t, w/2, 3, 90);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}

CWN.render['Groundwater Storage'] = function(ctx, l, t, w, h) {
    var r = w / 2;
    
    var grd = ctx.createLinearGradient(l+r, t, l+r, t+h-(.1*h));
    grd.addColorStop(0, CWN.colors.lightGrey);
    grd.addColorStop(1, CWN.colors.base);
    ctx.fillStyle=grd;

    ctx.strokeStyle = CWN.colors.lightGrey;
    ctx.lineWidth = 1;

    CWN.render._nSidedPath(ctx, l, t, r, 3, 90);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}

CWN.render['Agricultural Demand'] = function(ctx, l, t, w, h) {
    CWN.render._oval(ctx, l, t, w, h, CWN.colors.lightBlue);
}

CWN.render['Urban Demand'] = function(ctx, l, t, w, h) {
    CWN.render._oval(ctx, l, t, w, h, CWN.colors.salmon);
}

CWN.render.Wetland = function(ctx, l, t, w, h) {
    CWN.render._oval(ctx, l, t, w, h, CWN.colors.green);
}

CWN.render._oval = function(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;

    h -= w * .5;
    y += h / 2;

    var kappa = .5522848,
      ox = (w / 2) * kappa, // control point offset horizontal
      oy = (h / 2) * kappa, // control point offset vertical
      xe = x + w,           // x-end
      ye = y + h,           // y-end
      xm = x + w / 2,       // x-middle
      ym = y + h / 2;       // y-middle

    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
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

