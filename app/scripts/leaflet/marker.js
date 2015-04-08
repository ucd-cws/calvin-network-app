// can we pass in type and then just use
L.Icon.Canvas = L.Icon.extend({
    options: {
        iconSize: new L.Point(20, 20), // Have to be supplied
        className: 'leaflet-canvas-icon'
    },

    createIcon: function () {
        var e = document.createElement('canvas');
        this._setIconStyles(e, 'icon');
        var s = this.options.iconSize;
        e.width = s.x;
        e.height = s.y;
        this.draw(e.getContext('2d'), s.x, s.y);

        // TODO: make sure this doesn't cause a memory leak...
        if( this.options.name ) {
            var popup = $('<div style="z-index:1000;position:absolute;padding:5px;background-color:white;border:1px solid #ccc">'+this.options.name+'</div>');
            $(e)
                .on('mouseover', function(e){
                    popup.css('top', e.clientY+30).css('left', e.clientX);
                    $('body').append(popup);
                })
                .on('mouseout', function(){
                    popup.remove();
                });
        }

        return e;
    },

    createShadow: function () {
        return null;
    },

    draw: function(ctx, width, height) {
        CWN.render[this.options.type](ctx, 2, 2, width-4, height-4);
    }
});