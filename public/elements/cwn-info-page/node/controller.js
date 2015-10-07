Polymer({
    is : 'cwn-node-info',

    properties : {
        feature : {
          type : Object,
          observer : 'update'
        },
        ds : {
          type : Object,
          observer : 'update'
        },
        leaflet : {
          type : Object
        },
        islocal : {
          type : Boolean
        }
    },

    ready : function() {
      this.hasOriginDescription = false;
      this.originDescription = '';
      this.editUrl = '';
      this.originUrl = '';
      this.terminalUrl = '';
      this.showNavLinks = false;
      this.hasTerminalDescription = false;
      this.terminalDescription = '';
      this.type = '';
      this.origins = [];
      this.terminals = [];

      $(window).on('resize', this.updateSize.bind(this));
    },

    update : function() {
        if( !CWN.ds || !this.feature ) return;

        this.type = this.feature.properties.type;
        this.editUrl = '#edit/'+this.feature.properties.prmname;

        if( this.feature.properties.type == 'Diversion' || this.feature.properties.type == 'Return Flow' ) {
          this.$.label.innerHTML = this.feature.properties.origin.replace(/_/g, ' ')+' <small>to</small> '+this.feature.properties.terminus.replace(/_/g, ' ');
        } else if( this.feature.properties.type == 'Region Link') {
          this.$.label.innerHTML = this.feature.properties.prmname.replace(/--/, ' <small>to/from</small> ').replace(/_/g, ' ');
        } else {
          this.$.label.innerHTML = this.feature.properties.prmname.replace(/_/g, ' ');
        }

        if( this.feature.properties.type == 'Region Link') {
          $(this).find('.node-info-header').css('display','none');
          this.$.origin.style.marginTop = '30px';
          this.$.terminal.style.marginTop = '30px';
        } else {
          $(this).find('.node-info-header').css('display','block');
          this.$.origin.style.marginTop = '0';
          this.$.terminal.style.marginTop = '0';
        }

        this.$.regions.update(this.feature);

        this.origins = [];
        this.terminals = [];
        this.$.originExtra.innerHTML = '';
        this.$.terminusExtra.innerHTML = '';

        var link, node, types = ['origins', 'terminals'];
        types.forEach(function(type){
          if( this.feature && this.feature.properties[type] ) {
            for( var i = 0; i < this.feature.properties[type].length; i++ ) {
              link = CWN.ds.lookupMap[this.feature.properties[type][i].link_prmname];
              node = CWN.ds.lookupMap[this.feature.properties[type][i].prmname];

              if( link && node ) {
                this[type].push({
                  name: node.properties.prmname,
                  link: '#info/'+link.properties.prmname,
                  hasLink : true,
                  description: node ? node.properties.description : ''
                });
              } else {
                this.origins.push({
                    name: this.feature.properties.origins[i].prmname,
                    hasLink : false,
                    link: '',
                    description: ''
                });
              }
            }
          }
        }.bind(this));

        if( this.feature.properties.repo ) {
          this.$.githubLink.innerHTML = '<a class="btn btn-link" href="'+
            this.feature.properties.repo.github+'" target="_blank">'+
            '<i class="fa fa-github"></i> Show on GitHub</a>';
        } else {
          this.$.githubLink.innerHTML = '';
        }

        // stupid polymer hack! when will this stop!!!!!!!!!!
        this.origins = $.extend(true, [], this.origins);
        this.terminals = $.extend(true, [], this.terminals);

        $(window).on('resize', this.updateSize.bind(this));

        this.onTypeUpdate();
        this.onOriginUpdate();
        this.onTerminalUpdate();
    },

    createRenderLinks : function(name) {
      var link, i, tmp = [];
      var links = this[name];
      if(!links) return;

      for( i = 0; i < links.length; i++ ) {
        link = links[i];

        tmp.push({
          name: link.properties.prmname,
          link: '#info/'+link.properties.prmname,
          hasLink : true,
          description: link.properties.description ? link.properties.description : ''
        });
      }

      // stupid polymer... when will this crap work right!?
      this[name] = tmp;
    },

    onOriginUpdate : function() {
        if( !CWN.ds ) return;

        if( !this.feature.properties.origin ) return this.$.origin.style.display = 'none';
        else this.$.origin.style.display = 'block';

        this.hasOriginDescription = false;
        this.originDescription = '';

        if( CWN.ds.lookupMap[this.feature.properties.origin] ) {
            this.hasOriginDescription = true;
            this.originDescription = CWN.ds.lookupMap[this.feature.properties.origin].properties.description
        }
    },

    onTerminalUpdate : function() {
        if( !CWN.ds ) return;

        if( !this.feature.properties.terminus ) return this.$.terminal.style.display = 'none';
        else this.$.terminal.style.display = 'block';

        this.hasTerminalDescription = false;
        this.terminalDescription = '';

        if( CWN.ds.lookupMap[this.feature.properties.terminus] ) {
            this.hasTerminalDescription = true;
            this.terminalDescription = CWN.ds.lookupMap[this.feature.properties.terminus].properties.description
        }
    },

    onTypeUpdate : function() {
        if( !CWN.ds ) return;

        this.showNavLinks = true;

        if( this.feature.properties.type == 'Diversion' || this.feature.properties.type == 'Return Flow' ) {
          this.showNavLinks = false;
        } else if( this.feature.properties.type == 'Region Link' ) {
          this.showNavLinks = false;
        }
    },

    updateSize : function() {
      var w = $(window).width();

      if( w < 992 ) {
        this.$.middleCol.style.marginTop = '0px';
        return;
      }

      var ele = $(this.$.middleCol);

      var h = ele.next().height();
      if( h < ele.prev().height() ) h = ele.prev().height();
      if( h < ele.height() ) h = ele.height();


      this.$.middleCol.style.marginTop = Math.floor(((h-ele.height()) / 2)) + 'px';
    },

    setRegionLinkInfo : function(info) {
      for( var i = 0; i < info.origin.links.length; i++ ) {
        this.origins.push({
            name: info.origin.links[i],
            hasLink : false,
            hideArrow : true,
            link: '#info/'+info.origin.links[i],
            description: ''
        });
      }

      if( info.origin.links.length > 0 ) {
        this.$.originExtra.innerHTML = '<h5 class="page-header" style="margin:0;text-transform:capitalize">Links to '+this.feature.properties.terminus.replace(/_/g,' ')+'</h5>';
      }

      for( var i = 0; i < info.terminus.links.length; i++ ) {
        this.terminals.push({
            name: info.terminus.links[i],
            hasLink : false,
            hideArrow : true,
            link: '#info/'+info.terminus.links[i],
            description: ''
        });
      }

      if( info.terminus.links.length > 0 ) {
        this.$.terminusExtra.innerHTML = '<h5 class="page-header" style="margin:0;text-transform:capitalize">Links to '+this.feature.properties.origin.replace(/_/g,' ')+'</h5>';
      }

      this.origins = $.extend(true, [], this.origins);
      this.terminals = $.extend(true, [], this.terminals);
    },

    goTo : function() {
      window.location.hash = 'map';
      this.async(function() {
        var pts = this.feature.geometry.coordinates;
        this.leaflet.setView([pts[1], pts[0]], 12);
      });
    },

    goToGraph : function() {
      window.location.hash = 'graph/'+this.feature.properties.prmname;
    }
});
