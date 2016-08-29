var colors = require('./colors');
var utils = require('./utils');

module.exports = function(ctx, config) {
    var r = config.width / 2;

    var grd = ctx.createLinearGradient(config.x+r, config.y, config.x+r, config.y+config.height-(.25*config.height));
    grd.addColorStop(0, config.stroke || colors.getColor('blue', config.opacity));
    grd.addColorStop(1, config.fill || colors.getColor('green', config.opacity));
    ctx.fillStyle=grd;

    ctx.strokeStyle = config.stroke || colors.getColor('black', config.opacity);
    ctx.lineWidth = config.lineWidth || 2;

    utils.nSidedPath(ctx, config.x, config.y, r, 3, 90);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}