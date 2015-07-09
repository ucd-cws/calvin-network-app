Polymer({
    is : 'cwn-info-page',

    behaviors : [InfoPageDomControllers],

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
        this.showDateRangeSlider = false;
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
      this.updateDateSliderVisibility();

      this.eacChart.data = [];

      this.loadClimateData();
    },

    loadClimateData : function() {
      this.showClimateData = false;
      if( !this.feature.properties.hasClimate ) return;

      this.climateLoading = true;
      this.inflows = [];

      var type;
      if( this.feature.properties.type == 'Diversion' || this.feature.properties.type == 'Return Flow' ) {
        type = 'link';
      } else {
        type = 'node';
      }

      var params = '?prmname='+ this.feature.properties.prmname +
        '&type=' + type + '&attribute=climate'

      $.ajax({
          url : '/rest/getAttribute'+params,
          success : function(resp) {
            this.climateLoading = false;
            if( !resp.climate ) return this.climateLoadError = true;

            this.showClimateData = true;
            this.renderClimateData(JSON.parse(resp.climate));

            this.async(function(){
              this.$.dateslider.resize();
            });
          }.bind(this),
          error : function(resp) {
            this.climateLoadError = true;
          }.bind(this)
      });
    },

    renderClimateData : function(data) {

      if( data.inflows ) {
        for( var i = 0; i < data.inflows.length; i++ ) {
          var inflow = {
            label : data.inflows[i].name,
            data : []
          };
          for( var j = 0; j < data.inflows[i].date.length; j++ ) {
            inflow.data.push([data.inflows[i].date[j], data.inflows[i].inflow[j]]);
          }
          this.inflows.push(inflow);
        }
      }

      this.eacChart.data = [];
      if( data.el_ar_cap ) {

        var max = 0;
        for( var i = 0; i < data.el_ar_cap.length; i++ ) {
          this.eacChart.data.push([
            data.el_ar_cap[i].capacity,
            data.el_ar_cap[i].elevation,
            data.el_ar_cap[i].area,
            null,
            null
          ]);
          if( data.el_ar_cap[i].elevation > max ) max = data.el_ar_cap[i].elevation;
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
          if( a[0] > b[0] ) return 1;
          if( a[0] < b[0] ) return -1;
          return 0;
        });
      }

      this.stampEacChart();
      this.updateDateSliderVisibility();
    },

    updateDateFilters : function(e) {
      var eles = this.querySelectorAll('cwn-date-linechart');

      for( var i = 0; i < eles.length; i++ ) {
        eles[i].startDate = e.detail.start;
        eles[i].stopDate = e.detail.end;

        eles[i].update();
      }

      this.setPathValue('filters.start', e.detail.start);
      this.setPathValue('filters.stop', e.detail.end);
    },

    back : function() {
      window.location.hash = 'map'
    },

    _setCostMonth : function(e) {
      this.$.costInfo.setMonth(parseInt(e.currentTarget.getAttribute('index')));
    }

});
