var colors = require('./colors');
var utils = require('./utils');

module.exports = function(ctx, config) {
    ctx.fillStyle = config.fill || colors.getColor('cyan', config.opacity);
    ctx.strokeStyle = config.stroke || colors.getColor('black', config.opacity);
    ctx.lineWidth = config.lineWidth || 2;

    utils.nSidedPath(ctx, config.x, config.y, config.width/2, 8, 22.5);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}