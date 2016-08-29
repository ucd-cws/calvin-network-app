module.exports = function(type, width, height) {
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  if( !CWN.render[type] ) return canvas;

  var ctx = canvas.getContext('2d');
  CWN.render[type](ctx, 2, 2, width-4, height-4);

  return canvas;
}