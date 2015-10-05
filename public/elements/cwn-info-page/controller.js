Polymer({
    is : 'cwn-info-page',

    properties : {
      hasTimeSeries : {
        type : Boolean,
        notify : true,
        observer : 'updateDateSliderVisibility'
      }
    },

    ready : function() {
      this.feature = null;

      this.hack = '';
      this.islocal = false;

      this.tableProperties = ['prmname'];

      // loading flags
      this.climateLoadError = false;
      this.costLoadError = false;
      this.climateLoading = false;
      this.costLoading = false;
      this.loading = false;

        // have to do long lookup right now, is there are better way?
      this.origins = [];
      this.terminals = [];

      // render data.  Data in a format ready to draw above
      this.inflows = [],

      this.map = {};

      // Elevation / Area / Capacity charts
      this.eacChart = {
        type : 'ComboChart',
        cols : [
          {id: 'capacity', label: 'capacity', type: 'number'},
          {id: 'elevation', label: 'elevation', type: 'number'},
          {id: 'area', label: 'area', type: 'number'},
          {id: 'initial', type: 'number', label: 'initial'},
          {id: 'tooltip', type: 'string', role:'tooltip'}
        ],
        data : [],
        options : {
          hAxis : {
            title : 'Capacity (kAF)'
          },
          vAxes : [
            {title:'Elevation (ft)'}, // axis 0
            {title:'Area (ac)'} // Axis 1
          ],
          seriesType: "bars",
          series :{
            0: {type: "line", targetAxisIndex:0},
            1: {type: "line", targetAxisIndex:1},
            2: {targetAxisIndex: 0},
          },
          interpolateNulls : true,
          legend : {
            position: 'top'
          }
        }
      };

      // date filtering
      this.filters = {
        start : null,
        stop : null
      },

      // dom controller stuff
      this.hasTimeSeries = false;
      this.showClimateData = false;
      this.charts = {};

    },

    init : function(map) {
      this.map = map;
      this.islocal = CWN.ds.islocal;

      CWN.ds.on('load', this.onLoad.bind(this));
    },

    onLoad : function() {
      if( CWN.ds.loading ) return;

      var loc = window.location.hash.replace('#','').split('/');
      if( loc[0] == 'info' && loc.length > 1) {
        if( this.feature && this.feature.prmname == loc[1] ) {
          this.update();
        } else {
          this.setFeature(loc[1]);
        }
      }
    },

    setFeature : function(prmname) {
      if( CWN.ds.lookupMap[prmname] ) {
        this.feature = CWN.ds.lookupMap[prmname];
      } else {
        // see if this is a region to feature
        this.setRegionToRegion(prmname);
      }

      this.update();
    },

    setRegionToRegion : function(prmname) {
      var parts = prmname.split('-');

      if( parts.length == 0 ) {
        this.feature = null;
        return;
      }

      var node = {
        properties : {
          prmname : prmname,
          origin : null,
          terminus : null,
          type : 'Region Link'
        }
      };

      if( CWN.ds.lookupMap[parts[0]] ) {
        node.properties.origin = CWN.ds.lookupMap[parts[0]].properties.prmname;
      } else if( CWN.ds.regionLookupMap[parts[0]] ) {
        node.properties.origin = CWN.ds.regionLookupMap[parts[0]].name;
      }

      if( CWN.ds.lookupMap[parts[1]] ) {
        node.properties.terminus = CWN.ds.lookupMap[parts[1]].properties.prmname;
      } else if( CWN.ds.regionLookupMap[parts[1]] ) {
        node.properties.terminus = CWN.ds.regionLookupMap[parts[1]].name;
      }

      if( !node.properties.origin || !node.properties.terminus ) {
        this.feature = null;
        return;
      }

      this.feature = node;
    },

    update : function() {
      if( CWN.ds.loading ) return;

      if( this.feature == null ) return alert('Feature not found');

      this.climateLoadError = false;
      this.climateLoading = false;

      this.hasOutputs = false;
      this.eacChart.data = [];
      this.evaporationData = null;
      this.hasInflows = false;
      this.hasEvaporation = false;

      var props = this.feature.properties;
      if( (props.extras && props.extras.inflows) || props.el_ar_cap || (props.extras && props.extras.evaporation)) {
        this.showClimateData = true;
      } else {
        this.showClimateData = false;
      }

      this.renderClimateData(props.el_ar_cap);


      this.$.outputs.update(this.feature);
      if( this.feature.properties.hasOutputs ) {
        this.hasOutputs = true;
      }

      this.updateReadme();

      this.updateDateSliderVisibility();

      this.async(function(){
        this.$.dateslider.resize();
      });

    },

    updateReadme : function() {
        if( !this.feature.properties.readme ) {
          this.$.readme.style.display = 'none';
          return;
        }

        this.$.readme.style.display = 'block';
        this.$.readmeMarkdown.innerHTML = marked(this.feature.properties.readme);
    },

    renderClimateData : function(el_ar_cap) {
      this.renderInflows();
      this.renderEvaporation();

      this.eacChart.data = [];
      if( el_ar_cap ) {

        var max = 0;
        var elevationCol = 0, capacityCol = 0, areaCol = 0;

        for( var i = 0; i < el_ar_cap.length; i++ ) {
          // make sure col labels are set correctly
          if( i == 0 ) {
            for( var j = 0; j < el_ar_cap[i].length; j ++ ) {
              if( el_ar_cap[i][j].toLowerCase() == 'elevation' ) elevationCol = j;
              else if( el_ar_cap[i][j].toLowerCase() == 'capacity' ) capacityCol = j;
              else if( el_ar_cap[i][j].toLowerCase() == 'area' ) areaCol = j;
            }
          } else {
            this.eacChart.data.push([
              el_ar_cap[i][capacityCol],
              el_ar_cap[i][elevationCol],
              el_ar_cap[i][areaCol],
              null,
              null
            ]);
          }

          if( el_ar_cap[i][elevationCol] > max ) max = el_ar_cap[i][elevationCol];
        }

        if( this.feature.properties.initialstorage ) {
          this.eacChart.data.push([
            this.feature.properties.initialstorage,
            null,
            null,
            max,
            'Initial: '+this.feature.properties.initialstorage
          ]);
        }

        this.eacChart.data.sort(function(a,b){
          if( a[capacityCol] > b[capacityCol] ) return 1;
          if( a[capacityCol] < b[capacityCol] ) return -1;
          return 0;
        });

        this.stampEacChart();
      }


      this.updateDateSliderVisibility();
    },

    renderInflows : function() {
      this.$.inflows.style.display = 'none';

      CWN.ds.loadExtras(this.feature.properties.prmname, function(resp){
        if( resp.inflows ) {
          this.hasInflows = true;
          this.$.inflowCharts.innerHTML = '';

          for( var name in resp.inflows  ) {
            var chart = document.createElement('cwn-date-linechart');
            chart.label = (resp.inflows[name].description || name || ''),
            chart.data = resp.inflows[name].inflow;

            this.$.inflowCharts.appendChild(chart);
          }

          this.$.inflows.style.display = 'block';
        } else {
          this.$.inflows.style.display = 'none';
        }
      }.bind(this));
    },

    renderEvaporation : function() {
      CWN.ds.loadExtras(this.feature.properties.prmname, function(resp){
        var evaporation = resp.evaporation;
        if( evaporation ) {
          this.hasEvaporation = true;
          this.$.evaporationChart.update(evaporation);
          this.evaporationData = evaporation;
          this.$.evaporation.style.display = 'block';
        } else {
          this.$.evaporation.style.display = 'none';
        }
      }.bind(this));
    },

    updateDateFilters : function(e) {
      var eles = this.querySelectorAll('cwn-date-linechart');

      for( var i = 0; i < eles.length; i++ ) {
        eles[i].startDate = e.detail.start;
        eles[i].stopDate = e.detail.end;

        eles[i].update();
      }

      this.notifyPath('filters.start', e.detail.start);
      this.notifyPath('filters.stop', e.detail.end);
    },

    _setCostMonth : function(e) {
      this.$.costInfo.setMonth(parseInt(e.currentTarget.getAttribute('index')));
    },

    // dom-template: http://polymer.github.io/polymer/
    // doesn't seem to take variables when you stamp now :(
    // setting manually.
    _stamp : function(ele, query, data) {
      var template = ele.stamp();

      if( query && data ) {
        var newEle = template.root.querySelector(query);
        if( newEle ) {
          for( var key in data ) newEle[key] = data[key];
        }
      }

      return template;
    },

    updateDateSliderVisibility : function() {
      var isRegionLink = false;
      if( this.feature && this.feature.properties.type == 'Region Link' ) {
        isRegionLink = true;
      }

      this.$.dateRangeSlider.style.display = (isRegionLink || this.hasOutputs || this.hasInflows || this.hasTimeSeries || this.hasEvaporation ) ? 'block' : 'none';
    },

    stampEacChart : function() {
      if( !this.eacChart ) return;

        if( this.eacChart.data.length == 0 ) {

            this.charts.eacChart = null;
            this.$.eacChartRoot.innerHTML = '';

        } else if( !this.charts.eacChart ) {

            this.charts.eacChart = this._stamp(this.$.eacChart, 'cwn-linechart', this.eacChart);
            this.$.eacChartRoot.appendChild(this.charts.eacChart.root);

            this.async(function(){
                this.$.eacChartRoot.querySelector('cwn-linechart').update(this.eacChart.data);
            });
        }
    }

});
