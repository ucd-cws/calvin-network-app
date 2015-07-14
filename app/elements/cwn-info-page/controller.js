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
        if( this.feature = CWN.ds.lookupMap[loc[1]] ) {
          this.update();
        } else {
          this.feature = CWN.ds.lookupMap[loc[1]];
        }
      }
    },

    setFeature : function(feature) {
      this.feature = feature;
      this.update();
    },

    update : function() {
      if( CWN.ds.loading ) return;

      if( this.feature == null ) return alert('Feature not found');

      this.climateLoadError = false;
      this.climateLoading = false;

      this.eacChart.data = [];
      this.evaporationData = null;
      this.hasInflows = false;

      var props = this.feature.properties;
      if( props.inflows || props.el_ar_cap || props.evaporation) {
        this.showClimateData = true;
      } else {
        this.showClimateData = false;
      }

      this.renderClimateData(props.inflows, props.el_ar_cap, props.evaporation);
      this.updateDateSliderVisibility();

      this.async(function(){
        this.$.dateslider.resize();
      });

    },

    renderClimateData : function(inflows, el_ar_cap, evaporation) {

      if( inflows ) {
        this.hasInflows = true;
        this.$.inflowCharts.innerHTML = '';

        for( var name in inflows ) {
          /*var inflow = {
            label : name,
            description : inflows[name].description || '',
            data : inflows[name].inflow
          };*/

          var chart = document.createElement('cwn-date-linechart');
          chart.label = (inflows[name].description || name || ''),
          chart.data = inflows[name].inflow;

          this.$.inflowCharts.appendChild(chart);
        }

        this.$.inflows.style.display = 'block';
      } else {
        this.$.inflows.style.display = 'none';
      }

      if( evaporation ) {
        this.$.evaporationChart.update(evaporation);
        this.evaporationData = evaporation;
        this.$.evaporation.style.display = 'block';
      } else {
        this.$.evaporation.style.display = 'none';
      }

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

    back : function() {
      window.location.hash = 'map'
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
      this.$.dateRangeSlider.style.display = (this.hasInflows || this.hasTimeSeries) ? 'block' : 'none';
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
