var colors = require('./colors');
var junction = require('./junction');

module.exports = function(ctx, config) {
    config.fill = colors.getColor('indigo', config.opacity);

    junction(ctx, config);

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
