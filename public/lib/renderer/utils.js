function oval(ctx, config) {
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
function nSidedPath(ctx, left, top, radius, sides, startAngle) {
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

module.exports = {
  oval : oval,
  nSidedPath : nSidedPath
}