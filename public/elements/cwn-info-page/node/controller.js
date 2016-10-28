Polymer({
    is : 'cwn-node-info',

    properties : {
        feature : {
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
      this.hasTerminalDescription = false;
      this.terminalDescription = '';
      this.type = '';
      this.origins = [];
      this.terminals = [];

      $(window).on('resize', this.updateSize.bind(this));
    },

    update : function() {
        if( !this.feature ) return;

        this.type = this.feature.properties.type;
        this.editUrl = '#edit/'+this.feature.properties.prmname;

        if( this.feature.properties.hobbes.type === 'link' ) {
          this.$.label.innerHTML = this.feature.properties.hobbes.origin.replace(/\//g, ' / ') + 
                                  '<br /><small>to</small><br />' +
                                  this.feature.properties.hobbes.terminus.replace(/\//g, ' / ');
        } else if( this.feature.properties.type == 'Region Link') {
          this.$.label.innerHTML = this.feature.properties.prmname.replace(/--/, ' <small>to</small> ').replace(/_/g, ' ');
        } else {
          this.$.label.innerHTML = this.feature.properties.hobbes.id.replace(/\//g, ' / ');
        }

        if( this.feature.properties.type == 'Region Link' ) {
          $(this).find('.node-info-header').css('display','none');
          this.$.origin.style.marginTop = '30px';
          this.$.terminal.style.marginTop = '30px';
        } else {
          $(this).find('.node-info-header').css('display','block');
          this.$.origin.style.marginTop = '0';
          this.$.terminal.style.marginTop = '0';
        }

        if( this.feature.properties.type == 'Region' ) {
          $(this).find('.node-info-list').addClass('overflow');
          this.renderRegionNodes();
        } else {
          $(this).find('.node-info-list').addClass('overflow');
          //$(this).find('.node-info-list').removeClass('overflow');
          this.$.regionNodes.innerHTML = '';
        }


        this.$.regions.update(this.feature);

        this.origins = [];
        this.terminals = [];
        this.$.originExtra.innerHTML = '';
        this.$.terminusExtra.innerHTML = '';

        var link, node, types = ['origins', 'terminals'];
        types.forEach(function(type){
          if( this.feature && this.feature.properties.hobbes[type] ) {
            for( var i = 0; i < this.feature.properties.hobbes[type].length; i++ ) {
              
              link = CWN.collections.nodes.getById(this.feature.properties.hobbes[type][i].link);
              node = CWN.collections.nodes.getById(this.feature.properties.hobbes[type][i].node);

              if( !link ) link = CWN.collections.nodes.getByPrmname(this.feature.properties.hobbes[type][i].link);
              if( !node ) node = CWN.collections.nodes.getByPrmname(this.feature.properties.hobbes[type][i].node);

              if( link && node ) {
                this[type].push({
                  name: node.properties.hobbes.id,
                  link: '#info/'+link.properties.hobbes.id.replace(/\//g,','),
                  hasLink : true
                });
              } else {
                this[type].push({
                    name: this.feature.properties.hobbes[type][i].node,
                    hasLink : false,
                    link: '',
                });
              }
            }
          }
        }.bind(this));


        // stupid polymer hack! when will this stop!!!!!!!!!!
        this.origins = $.extend(true, [], this.origins);
        this.terminals = $.extend(true, [], this.terminals);

        $(window).on('resize', this.updateSize.bind(this));

        if( this.$.btns.update ) {
          this.$.btns.update(this.feature);
        }
    },

    createRenderLinks : function(name) {
      var link, i, tmp = [];
      var links = this[name];
      if(!links) return;

      for( i = 0; i < links.length; i++ ) {
        link = links[i];

        tmp.push({
          name: link.properties.hobbes.id,
          link: '#info/'+link.properties.hobbes.id.replace(/\//g,','),
          hasLink : true
        });
      }

      // stupid polymer... when will this crap work right!?
      this[name] = tmp;
    },

    onOriginUpdate : function() {
        if( !this.feature.properties.hobbes.origin ) return this.$.origin.style.display = 'none';
        else this.$.origin.style.display = 'block';
    },

    onTerminalUpdate : function() {
        if( !this.feature.properties.hobbes.terminus ) return this.$.terminal.style.display = 'none';
        else this.$.terminal.style.display = 'block';
    },

    renderRegionNodes : function() {
      var cols = ['','',''], col, node, c = 0;

      var nodes = this.feature.properties.hobbes.nodes;
      for( var i = 0; i < nodes.length; i++ ) {
        col = c % 3;

        node = CWN.collections.nodes.getById(nodes[i]);


        cols[col] +=
          '<cwn-info-link hobbes-id="'+node.properties.hobbes.id+'"></cwn-info-link>';
        c++;
      }

      this.$.regionNodes.innerHTML =
        '<div><a class="btn btn-link btn-toggle">Node List</a></div>'+
        '<div class="well" style="display:none">'+
          '<div class="row">'+
            '<div class="col-sm-4">'+
              cols.join('</div><div class="col-sm-4">')+
            '</div>'+
          '</div>'+
        '</div>';

      $(this.$.regionNodes)
        .find('.btn-toggle')
        .on('click', function(){
          $(this.$.regionNodes).find('.well').toggle('slow');
        }.bind(this));
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

    setRegionLinkInfo : function(e) {
      var info = e.info;

      for( var i = 0; i < info.incomingLinks.length; i++ ) {
        this.origins.push({
            name: info.incomingLinks[i],
            hasLink : false,
            hideArrow : true,
            link: '#info/'+info.incomingLinks[i].replace(/\//g,','),
            description: ''
        });
      }

      if( this.origins.length > 0 ) {
        this.$.originExtra.innerHTML = '<h5 class="page-header" style="margin:0">Incoming Links From '+e.terminus.replace(/\//,' / ')+'</h5>';
      }

      for( var i = 0; i < info.outgoingLinks.length; i++ ) {
        this.terminals.push({
            name: info.outgoingLinks[i],
            hasLink : false,
            hideArrow : true,
            link: '#info/'+info.outgoingLinks[i].replace(/\//g,','),
            description: ''
        });
      }

      if( info.outgoingLinks.length > 0 ) {
        this.$.terminusExtra.innerHTML = '<h5 class="page-header" style="margin:0">Outgoing Links To '+e.terminus.replace(/\//,' / ')+'</h5>';
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
      window.location.hash = 'graph/'+this.feature.properties.hobbes.id.replace(/\//g,',');
    }
});
