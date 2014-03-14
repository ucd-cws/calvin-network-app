L.MyMarker = L.CircleMarker.extend({

	initialize: function (latlng, options) {
		L.Circle.prototype.initialize.call(this, latlng, null, options);
		this._radius = this.options.radius;
		this._sides = this.options.sides ? this.options.sides : 6;
		this._rotate = this.options.rotate ? this.options.rotate : 0;
	},


	getPathString: function () {
		var p = this._point;
		if (this._checkIfEmpty()) {
			return '';
		}

		if (L.Browser.svg) {
			return this.polygon(p.x, p.y, this._radius, this._sides, this._rotate);
		} else {
			console.error("MyMarker not using svg!!!");
		}
	},

	polygon : function(x, y, radius, sides, startAngle) {
	  if (sides < 3) return;
	  var a = ((Math.PI * 2)/sides);
	  var r = startAngle * (Math.PI / 180);

	  // think you need to adjust by x, y
	  var p = "M";
	  for (var i = 0; i < sides; i++) {
	     p += (x+(radius*Math.cos(a*i-r)))+","+(y+(radius*Math.sin(a*i-r)))+" ";
	  }
	  p +=" z";
	  return p;
	}

});

L.myMarker = function (latlng, options) {
	return new L.MyMarker(latlng, options);
};