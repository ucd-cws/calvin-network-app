function Datastore() {
    // add events to object
    Events(this);


    this.settings = {};
    this.islocal = false;
    this.loading = true;

    this.data = {
        nodes : [],
        links : [],
        regions : []
    }

    // look up any node or terminal by prmname
    this.lookupMap = {};
    // look up any link origin name
    this.originLookupMap = {};
    this.terminalLookupMap = {};
    this.regionLookupMap = {};
    this.filenameLookupMap = {};

    this.reset = function() {
        this.fire('load', this.loading);

        this.loading = true;
        this.data = {
            nodes : [],
            links : []
        };
        this.lookupMap = {};
        this.originLookupMap = {};
        this.terminalLookupMap = {};
        this.regionLookupMap = {};
        this.filenameLookupMap = {};
    }

    this.reload = function(callback) {
        //this.islocal = local;

        this.loadNetwork(this.network, function(err){
          this.loading = false;
          this.fire('load', this.loading);
          this.fire('loaded');

          if( callback && typeof callback === 'function' ) {
            callback();
          }
        }.bind(this));
    }

    this.loadNetwork = function(network, callback) {
        if( this.islocal ) {
            this.loadFromFileSystem(callback);
            return;
        }

        var networkLoaded = false;
        var regionsLoaded = false;
        function done() {
          if( networkLoaded && regionsLoaded ) callback();
        };

        var url = window.location.protocol+'//'+window.location.host+'/network/get';

        $.ajax({
            url : url,
            success : function(resp) {
                networkLoaded = true;
                if( resp.error ) {
                    alert('Server error loading network :(');
                    return done();
                }

                for( var i = 0; i < resp.length; i++ ) {
                  if( resp[i].properties.type == 'Diversion' || resp[i].properties.type == 'Return Flow' ) {
                    this.processLink(resp[i]);
                  } else {
                    this.processNode(resp[i]);
                  }
                }

                done();
            }.bind(this),
            error : function(resp) {
                networkLoaded = true;
                alert('Error retrieving data from network: '+network);
                done();
            }.bind(this)
        });

        url = window.location.protocol+'//'+window.location.host+'/regions/get';
        $.ajax({
            url : url,
            success : function(resp) {
                regionsLoaded = true;
                if( resp.error ) {
                    alert('Server error loading network :(');
                    return done();
                }

                this.data.regions = resp;

                for( var i = 0; i < this.data.regions.length; i++ ) {
                  this.processRegion(this.data.regions[i]);
                  this.regionLookupMap[this.data.regions[i].name] = this.data.regions[i];
                }

                done();
            }.bind(this),
            error : function(resp) {
                regionsLoaded = true;
                alert('Error retrieving data from network: '+network);
                done();
            }.bind(this)
        });
    }

    // cwne-fs-network-loader will be injected by the node-webkit app
    // TODO: let the nw app set this
    this.loadFromFileSystem = function(callback) {
        if( !CWN.rootDir ) return;
        document.querySelector('cwne-fs-network-loader').run(function(resp){
            for( var i = 0; i < resp.nodes.length; i++ ) {
                this.processNode(resp.nodes[i]);
            }
            for( var i = 0; i < resp.links.length; i++ ) {
                this.processLink(resp.links[i]);
            }
            callback();
        }.bind(this));
    }

    this.processNode = function(node) {
        if( !node ) return;
        if( !node.properties ) return;
        if( !node.properties.prmname ) return;

        this.markCalibrationNode(node);

        if( !this.lookupMap[node.properties.prmname] ) {
            this.data.nodes.push(node);
        }

        this.lookupMap[node.properties.prmname] = node;
        this.filenameLookupMap[node.properties.repo.dirNodeName] = node;
    }

    this.processLink = function(link) {
        if( !link ) return;
        if( !link.properties ) return;
        if( !link.properties.prmname ) return;

        // mark if this node is a calibration or not
        this.markCalibrationNode(link);

        // set up render info flags for markers
        this.markLinkTypes(link);

        if( !this.lookupMap[link.properties.prmname] ) {
            this.data.links.push(link);
        }

        this.lookupMap[link.properties.prmname] = link;
        this.filenameLookupMap[link.properties.repo.dirNodeName] = link;

        // set the origin lookup map
        if( !this.originLookupMap[link.properties.origin] ) {
            this.originLookupMap[link.properties.origin] = [link];
        } else {
            this.originLookupMap[link.properties.origin].push(link);
        }

        // set the terminal lookup map
        if( !this.terminalLookupMap[link.properties.terminus] ) {
            this.terminalLookupMap[link.properties.terminus] = [link];
        } else {
            this.terminalLookupMap[link.properties.terminus].push(link);
        }
    }

    this.processRegion = function(region) {
      if( region.subregions ) {
        region.subregions.sort();
      }

      if( !region.geo ) return;
      if( !region.geo.geometry ) return;

      //if( region.name == 'western-uplands' ) debugger;

      var polys = this.getXYPolygons(region.geo);

      region.simplified = [];
      for( var i = 0; i < polys.length; i++ ) {
        if( polys[i].length > 100 ) {
          region.simplified.push(L.LineUtil.simplify(polys[i], .001));
        } else {
          region.simplified.push(polys[i]);
        }
      }

      region.center = this.getCenter(region.simplified[0]);

      // todo calc bbox so we know if we need to render geometry or not

      for( var i = 0; i < region.simplified.length; i++ ) {
        for( var j = 0; j < region.simplified[i].length; j++ ) {
          region.simplified[i][j] = [region.simplified[i][j].x, region.simplified[i][j].y]
        }
      }

      // HACK
      if( isNaN(region.center[0]) ) region.center = region.simplified[0][0];
    }

    this.getXYPolygons = function(geojson) {
      var polys = [], tmp = [], i, j, p;
      if( geojson.geometry.type == 'Polygon' ) {
        // we only care about the outer ring.  no holes allowed.
        for( i = 0; i < geojson.geometry.coordinates[0].length; i++ ) {
          tmp.push({
            x : geojson.geometry.coordinates[0][i][0],
            y : geojson.geometry.coordinates[0][i][1]
          });
        }
        polys.push(tmp);

      } else if( geojson.geometry.type == 'MultiPolygon' ) {
        // we only care about the outer ring.  no holes allowed.
        for( i = 0; i < geojson.geometry.coordinates.length; i++ ) {
          tmp = [];
          p = geojson.geometry.coordinates[i][0];

          for( j = 0; j < p.length; j++ ) {
            tmp.push({
              x : p[j][0],
              y : p[j][1]
            });
          }

          polys.push(tmp);
        }
      }
      return polys;
    }

    this.markLinkTypes = function(link) {
        link.properties.renderInfo = {
            cost : link.properties.hasCosts ? true : false,
            amplitude : link.properties.amplitude ? true : false,
            // TODO: parser needs to sheet shortcut for contraint type
            // data will still need to be loaded on second call
            constraints : link.properties.hasConstraints ? true : false,
            environmental : link.properties.hasClimate ? true : false
        };

        try {

            // Flow to a sink
            if( this.lookupMap[link.properties.terminus] &&
                this.lookupMap[link.properties.terminus].properties.type == 'Sink' ) {
                link.properties.renderInfo.type = 'flowToSink';

            } else if( link.properties.type == 'Return Flow' ) {
                link.properties.renderInfo.type = 'returnFlowFromDemand';

            } else if ( this.isGWToDemand(link) ) {
                link.properties.renderInfo.type = 'gwToDemand';

            } else if( this.lookupMap[link.properties.origin] &&
                (this.lookupMap[link.properties.origin].properties.calibrationMode == 'in' ||
                this.lookupMap[link.properties.origin].properties.calibrationMode == 'both') ) {

                link.properties.renderInfo.type = 'artificalRecharge';
            } else {

                link.properties.renderInfo.type = 'unknown';
            }

        } catch(e) {
            debugger;
        }

        if( !link.geometry ) return;
        else if( !link.geometry.coordinates ) return;

        // finally, mark the angle of the line, so we can rotate the icon on the
        // map accordingly
        var width = link.geometry.coordinates[1][0] - link.geometry.coordinates[0][0];
        var height = link.geometry.coordinates[1][1] - link.geometry.coordinates[0][1];
        link.properties.renderInfo.rotate =  Math.atan(width / height) * (180 / Math.PI);
    }

    this.isGWToDemand = function(link) {
        var origin = this.lookupMap[link.properties.origin];
        var terminal = this.lookupMap[link.properties.terminal];

        if( !origin || !terminal ) return false;

        if( origin.properties.type != 'Groundwater Storage' ) return false;
        if( terminal.properties.type == 'Non-Standard Demand' ||
            terminal.properties.type == 'Agricultural Demand' ||
            terminal.properties.type == 'Urban Demand' ) return true;

        return false;
    }

    this.markCalibrationNode = function(node) {
        if( node.properties.prmname.indexOf('_') > -1 ) {
            var parts = node.properties.prmname.split('_');
            if( !(parts[0].match(/^CN.*/) || parts[1].match(/^CN.*/)) ) {
                return;
            }
        } else if( !node.properties.prmname.match(/^CN.*/) ) {
            return;
        }

        var hasIn = false;
        var hasOut = false;

        if( node.properties.terminals ) {
            for( var i = 0; i < node.properties.terminals.length; i++ ) {
                if( node.properties.terminals[i] != null ) {
                    hasOut = true;
                    break;
                }
            }
        }
        if( node.properties.origins ) {
            for( var i = 0; i < node.properties.origins.length; i++ ) {
                if( node.properties.origins[i] != null ) {
                    hasIn = true;
                    break;
                }
            }
        }

        node.properties.calibrationNode = true;
        if( !hasIn && !hasOut ) return;

        if( hasIn && hasOut ) node.properties.calibrationMode = 'both';
        else if ( hasIn ) node.properties.calibrationMode = 'in';
        else if ( hasOut ) node.properties.calibrationMode = 'out';
    }


    /** helper for processing region center **/
    this.getCenter = function (points) {
        var i, j, len, p1, p2, f, area, x, y,
        // polygon centroid algorithm; uses all the rings, may works better for banana type polygons

        area = x = y = 0;

        for (i = 0, len = points.length, j = len - 1; i < len; j = i++) {
                p1 = points[i];
                p2 = points[j];

                f = p1.y * p2.x - p2.y * p1.x;
                x += (p1.x + p2.x) * f;
                y += (p1.y + p2.y) * f;

        }

        f = this._getArea(points) * 6;

        //return [x / f, y / f]
        // wtf.  no idea
        return [-1 * (x / f), -1 * (y / f)];
    },

    /** helper for processing region center **/
    this._getArea = function(points){
        var area = 0;
        var lengthPoints = points.length;
        var j = lengthPoints - 1;
        var p1; var p2;
        for (var i = 0; i < lengthPoints; j = i++) {
            p1 = points[i]; p2 = points[j];
            area += p1.x * p2.y;
            area -= p1.y * p2.x;
        }
        area /= 2;
        return area;
    }
}

CWN.ds = new Datastore();
