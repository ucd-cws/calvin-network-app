var colors = {
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

colors.rgb = {
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

colors.getColor = function(name, opacity) {
  if( opacity === undefined ) opacity = 1;
  return 'rgba('+colors.rgb[name].join(',')+','+opacity+')';
}

module.exports = colors;
