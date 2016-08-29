var colors = require('./colors');

module.exports = function(ctx, config) {
    ctx.fillStyle = config.fill ||  colors.getColor('blue', config.opacity);
    ctx.strokeStyle = config.stroke || colors.getColor('black', config.opacity);
    ctx.lineWidth = config.lineWidth || 2;

    var r = config.width / 2;

    ctx.beginPath();
    ctx.arc(config.x+r, config.y+r, r, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}