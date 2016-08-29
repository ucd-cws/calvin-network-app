var colors = require('./colors');
var utils = require('./utils');

module.exports = function(ctx, config) {
    if( !config.stroke ) config.stroke = colors.getColor('black', config.opacity);
    if( !config.fill ) config.fill = colors.getColor('green', config.opacity);

    utils.oval(ctx, config);
}