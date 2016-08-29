var colors = require('./colors');
var junction = require('./junction');

module.exports = function(ctx, config) {
  config.fill = colors.getColor('darkCyan', config.opacity);

  junction(ctx, config);
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