function Events(obj) {
    var listeners = {};

    obj.on = function(event, fn) {
        if( !listeners[event] ) {
            listeners[event] = [fn];
        } else {
            listeners[event].push(fn);
        }
    }

    obj.fire = function(event, data) {
        if( !listeners[event] ) return;
        for( var i = 0; i < listeners[event].length; i++ ) {
            listeners[event][i](data);
        }
    }
}