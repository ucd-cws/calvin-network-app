L.Icon.LineCanvas = L.Icon.extend({
    options: {
        iconSize: new L.Point(20, 20), // Have to be supplied
        className: 'LineCanvas'
    },
    _transformProps : ['webkitTransform', 'MozTransform', 'msTransform', 'transform'],

    createIcon: function () {
        var icon = document.createElement('div');
        var canvas = document.createElement('canvas');
        icon.appendChild(canvas);

        this._setIconStyles(icon, 'icon');

        var s = this.options.iconSize;
        canvas.width = s.x;
        canvas.height = s.y;
        this.draw(canvas.getContext('2d'), s.x, s.y);

        // now we need to rotate the icon
        var rotate = this.options.renderInfo.rotate || 0;

        for( var i = 0; i < this._transformProps.length; i++ ) {
            canvas.style[this._transformProps[i]] = 'rotate('+rotate+'deg)';
        }
        if( this.options.hide ) icon.style.display = 'none';
        return icon;
    },

    createShadow: function () {
        return null;
    },

    draw: function(ctx, width, height) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(width, 0);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.moveTo(0, 0);
        ctx.closePath();
        ctx.stroke();

        var mX = 5;
        var mY = height / 2;
        var vX = 10;
        var vY = 10;


        if( this.options.renderInfo ) {
          for( var key in CWN.render.lineMarkers ) {
            if( this.options.renderInfo[key] ) {
              CWN.render.lineMarkers[key](ctx, mX, mY, 4, vX, vY);
              mX += vX * 1.75;
              //mY += vY * 1.75;
            }
          }
        }
    }
});