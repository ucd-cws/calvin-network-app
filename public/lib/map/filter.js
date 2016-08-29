var collection = require('../collections/nodes');

// marker nodes that are linked to a visible node with the 'nodeStep' attribute
var behavior = {
    filter : function(mapFilters) {
        var re, i, d, d2, d3, id;
        // three loops, first mark nodes that match, then mark one step nodes
        // finally mark links to hide and show
        try {
            re = new RegExp('.*'+mapFilters.text.toLowerCase()+'.*');
        } catch (e) {}
        for( i = 0; i < collection.nodes.length; i++ ) {
            d = collection.nodes[i];

            if( !d.properties._render ) {
                d.properties._render = {
                    filter_id : d.properties.type.replace(' ','_').replace('-','_')
                };
            }


            if( mapFilters[d.properties._render.filter_id] && isTextMatch(re, d.properties, mapFilters) ) {
                if( !checkSinkMode(mapFilters.inflowSinkMode,  d.properties) ) {
                    d.properties._render.show = false;
                } else {
                    d.properties._render.show = true;
                }
            } else {
                d.properties._render.show = false;
            }
        }

        // now mark links that should be show
        for( var i = 0; i < collection.links.length; i++ ) {
            d = collection.links[i];
            d2 = collection.getByPrmname(d.properties.origin);
            d3 = collection.getByPrmname(d.properties.terminus);

            checkRenderNs(d);
            checkRenderNs(d2);
            checkRenderNs(d3);

            if( d2 && d3 &&
                (d2.properties._render.show || (mapFilters.oneStepMode && d2.properties._render.oneStep) ) &&
                (d3.properties._render.show || (mapFilters.oneStepMode && d3.properties._render.oneStep) ) &&
                !(d2.properties._render.oneStep && d3.properties._render.oneStep ) ) {
                d.properties._render.show = true;
            } else {
                d.properties._render.show = false;
            }
        }
    }
}

function checkRenderNs(node) {
  if( !node ) return;
  if( !node.properties._render ) {
    node.properties._render = {};
  }
}

function isTextMatch(re, props, mapFilters) {
    if( mapFilters.text == '' || !re ) return true;

    if( re.test(props.prmname.toLowerCase()) ) return true;
    if( props.description && re.test(props.description.toLowerCase()) ) return true;
    return false;
}

function checkSinkMode(inflowSinkMode,  properties) {
  if( !inflowSinkMode ) {
    properties._render.stroke = null;
    return true;
  }

  if( properties.extras ) {
    if( properties.extras.inflows ) {
      properties._render.stroke = 'green';
      return true;
    } else if( properties.extras.sinks ) {
      properties._render.stroke = 'red';
      return true;
    }
  }

  properties._render.stroke = null;
  return false;
}

module.exports = behavior;