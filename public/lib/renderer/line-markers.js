var colors = require('./colors');

module.exports = {
    cost : function(cxt, x, y, s){
      cxt.beginPath();
      cxt.arc(x, y, s, 0, 2 * Math.PI, false);
      cxt.fillStyle = colors.green;
      cxt.fill();
      cxt.closePath();
    },
    amplitude : function(cxt, x, y, s){
      cxt.beginPath();
      cxt.arc(x, y, s, 0, 2 * Math.PI, false);
      cxt.lineWidth = 2;
      cxt.strokeStyle = colors.black;
      cxt.stroke();
      cxt.closePath();
    },
    constraints : function(cxt, x, y, s, vX, vY){
      cxt.beginPath();
      var dx = vX * .4;
      var dy = vY * .4;

      cxt.beginPath();
      cxt.moveTo(x+vY+dx, y-vX+dy);
      cxt.lineTo(x+vY-dx, y-vX-dy);

      cxt.lineTo(x-vY-dx, y+vX-dy);
      cxt.lineTo(x-vY+dx, y+vX+dy);
      cxt.lineTo(x+vY+dx, y-vX+dy);
      cxt.strokeStyle = colors.black;
      cxt.stroke();
      cxt.closePath();
    },
    environmental : function(cxt, x, y, s){
      cxt.beginPath();
      cxt.arc(x, y, s, 0, 2 * Math.PI, false);
      cxt.lineWidth = 2;
      cxt.strokeStyle = colors.green;
      cxt.stroke();
      cxt.closePath();
    }
};