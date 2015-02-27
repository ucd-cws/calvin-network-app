Polymer({
    is : 'cwn-info-page',

    mixins : ['InfoPageDomControllers'],

    configure : function() {
      return {
        feature : null,

        hack : '',
        islocal : false,

        tableProperties : ['prmname'],

        // loading flags
        climateLoadError : false,
        costLoadError : false,
        climateLoading : false,
        costLoading : false,
        loading : false,

        // have to do long lookup right now, is there are better way?
        origins : [],
        terminals : [],

        // render data.  Data in a format ready to draw above
        inflows : [],
        costsMonths : [],
        costs : {
          label : '',
          data : {},
          cost : 0, // for constant costs
          selected : 0
        },
        // Elevation / Area / Capacity charts
        eacChart : {
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
        },

        constraintChart : {
          constant: -1,
          label : '',
          isTimeSeries : false,
          cols : [
            {id:'date', type:'string'},
            {id:'upper_value', type:'number'},
            {id:'upper_interval', type:'number', role:'interval'},
            {id:'lower_interval', type:'number', role:'interval'},
            {id: 'tooltip', type: 'string', role:'tooltip'}
          ],
          data : [],
          options : {
            series: [{'color': '#F1CA3A'}],
            intervals: { 'style':'area' },
            vAxis : {
              viewWindow:{ min: 0 }
            }
          }
        },

        months : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],

        // date filtering
        filters : {
          start : null,
          stop : null
        },

        // dom controller stuff
        showDateRangeSlider : false,
        showClimateData : false,
        charts : {},
        showCostData : false,
        showMonthlyVariableCost : false,
        showConstantCost : false,
        costChartLabel : '',
        costChartData : [],
        showConstraints : false,
        showConstantConstraints : false,
        showTimeSeriesConstraints : false,
        showChartConstraints : false
      }
    },

    bind : {
        feature : 'update',
        inflow : 'updateDateSliderVisibility',
        'constraintChart.isTimeSeries' : 'updateDateSliderVisibility'
    },

    init : function(map, ds, islocal) {
      this.map = map;
      this.ds = ds;
      this.islocal = islocal;

      this.ds.addEventListener('load', function(e){
        this.loading = e.detail;
        if( !this.loading ) this.onLoad();
      }.bind(this));
    },

    onLoad : function() {
      if( this.loading ) return;

      var loc = window.location.hash.replace('#','').split('/');
      if( loc[0] == 'info' && loc.length > 1) {
        this.feature = this.ds.lookupMap[loc[1]];
      }

    },


    update : function() {
      if( !this.ds ) return;
      if( this.feature == null ) return alert('Feature not found');

      

      this.climateLoadError = false;
      this.costLoadError = false;
      this.climateLoading = false;
      this.costLoading = false;

      this.eacChart.data = [];
      this.constraintChart.data = [];
      this.constraintChart.isTimeSeries = false;
      this.constraintChart.constant = -1;
      this.constraintChart.label = '';

      this.loadClimateData();
      this.loadCostData();
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
    },

    loadCostData : function() {
      this.showCostData = false;
      this.showMonthlyVariableCost = false;
      this.showConstantCost = false;

      if( !this.feature.properties.hasCosts ) return;
      this.costLoading = true;
      this.costLoadError = false;

      var type;
      if( this.feature.properties.type == 'Diversion' || this.feature.properties.type == 'Return Flow' ) {
        type = 'link';
      } else {
        type = 'node';
      }

      var params = '?prmname='+ this.feature.properties.prmname +
        '&type=' + type + '&attribute=costs'

      $.ajax({
          url : '/rest/getAttribute'+params,
          success : function(resp) {
            this.costLoading = false;
            if( !resp.costs ) return this.costLoadError = true;

            this.showCostData = true;

            this.renderCostData(JSON.parse(resp.costs));
          }.bind(this),
          error : function(resp) {
            this.costLoadError = true;
          }.bind(this)
      });
    },

    renderCostData : function(d) {
      if( d.constraints ) this.renderConstraints(d.constraints);

      if( !d.costs ) return;

      this.costs.label = d.costs.type;
      this.costs.data = {};
      this.costsMonths = [];
      this.costs.selected = 0;

      this.costs.cost = d.costs.cost;

      if( !d.costs.costs ) return;
      if( d.costs.costs.length == 0 ) return;

      for( var i = 0; i < d.costs.costs.length; i++ ) {
        var m = d.costs.costs[i];

        var label = m.label;
        if( (!label || label == '') && i < 12 ) label = this.months[i];

        this.costs.data[label] = [];
        this.costsMonths.push({
          index : i,
          label : label
        });

        for( var j = 0; j < m.costs.length; j++ ) {
          this.costs.data[label].push([
            m.costs[j].capacity,
            m.costs[j].cost
          ]);
        }

        this.costs.data[label].sort(function(a, b){
          if( a[0] > b[0] ) return 1;
          if( a[0] < b[0] ) return -1;
          return 0;
        });
        this.costs.data[label].splice(0,0, ['Capacity','Cost']);
      }

      if( this.costs.label == 'Monthly Variable' ) this.showMonthlyVariableCost = true;
      if( costs.label == 'Constant' ) this.showConstantCost = true;
    },

    renderConstraints : function(constraints) {
      this.showConstraints = false;
      this.showConstantConstraints = false;

      if( constraints.constraint_type == 'Bounded' ) {
        var length = this.getContraintsLength(constraints);
        if( length < 12 ) length = 12;

        for( var i = 0; i < length; i++ ) {
          this.constraintChart.data.push(this.getConstraintRow(constraints, i));
        }

      } else if( constraints.constraint_type == 'Constrained' ) {

        if( constraints.constraint.bound_type == 'Constant') {
          this.constraintChart.constant = constraints.constraint.bound;
        } else if( constraints.constraint.bound_type == 'Monthly') {
          for( var i = 0; i < 12; i++ ) {
            this.constraintChart.data.push([
              this.months[i],
              constraints.constraint.bound[i],
              null,
              null,
              'Constrained: '+constraints.constraint.bound[i]
            ]);
          }
        } if( constraints.constraint.bound_type == 'TimeSeries') {

          this.constraintChart.isTimeSeries = true;
          for( var i = 0; i < constraints.constraint.bound.length; i++ ) {
            this.constraintChart.data.push([
              constraints.constraint.date[i],
              constraints.constraint.bound[i],
              null,
              null,
              'Constrained: '+constraints.constraint.bound[i]
            ]);
          }

        }

      } else {
        console.log('Unknown Constraint Type: '+constraints.constraint_type);
      }

      this.updateConstraintUi();
    },

    getConstraintRow : function(constraints, index) {
      var row = [];

      if( constraints.lower && constraints.lower.bound_type == 'TimeSeries' ) {
        row.push(constraints.lower.date[index]);
      } else if ( constraints.upper && constraints.upper.bound_type == 'TimeSeries' ) {
        row.push(constraints.upper.date[index]);
      } else {
        row.push(this.months[index]);
      }

      var tooltip = row[0]+'\n';

      if( constraints.upper ) {
        if( constraints.upper.bound_type == 'Constant' ) {
          row.push(constraints.upper.bound);
          row.push(constraints.upper.bound);
          tooltip += 'Upper: '+constraints.upper.bound;
        } else if ( constraints.upper.bound_type == 'TimeSeries' || constraints.upper.bound_type == 'Monthly') {
          var i = index;
          if( i > 11 && constraints.upper.bound_type == 'Monthly' ) {
            i = parseInt(row[0].split("-")[1])-1;
          }

          row.push(constraints.upper.bound[i]);
          row.push(constraints.upper.bound[i]);
          tooltip += 'Upper: '+constraints.upper.bound[i];
        } else if ( constraints.upper.bound_type == 'None' ) {
          tooltip += 'Upper: None';
        }
      }

      if( constraints.lower ) {

        if( constraints.lower.bound_type == 'Constant' ) {
          row.push(constraints.lower.bound);
          tooltip += ', Lower: '+constraints.lower.bound;
        } else if ( constraints.lower.bound_type == 'TimeSeries' || constraints.lower.bound_type == 'Monthly' ) {
          var i = index;
          if( i > 11 && constraints.upper.bound_type == 'Monthly' ) {
            i = parseInt(row[0].split("-")[1])-1;
          }

          row.push(constraints.lower.bound[i]);
          tooltip += ', Lower: '+constraints.lower.bound[i];
        } else if ( constraints.lower.bound_type == 'None' ) {
          row.push(0);
          tooltip += ', Lower: 0';
        } else {
           tooltip += ', Lower: Unknown';
        }

      } 

      while(row.length < 4) row.push(null);

      row.push(tooltip);

      return row;
    },

    getContraintsLength : function(constraints) {
      var l = 0;
      if( constraints.lower ) {
        if( constraints.lower.bound_type == 'Constant' ) {
          l = 1;
        } else if ( constraints.lower.bound_type == 'TimeSeries' ) {
          this.constraintChart.isTimeSeries = true;
          l = constraints.lower.bound.length;
        } else if ( constraints.lower.bound_type == 'Monthly' ) {
          l = constraints.lower.bound.length;
        }
      }
      if (constraints.upper ) {
        if( constraints.upper.bound_type == 'Constant' && l == 0 ) {
          l = 1;
        } else if(constraints.upper.bound_type == 'TimeSeries' && l < constraints.upper.bound.length ) {
          this.constraintChart.isTimeSeries = true;
          l = constraints.upper.bound.length;
        } else if ( constraints.upper.bound_type == 'Monthly' && l < constraints.upper.bound.length ) {
          l = constraints.upper.bound.length;
        }
      }
      return l;
    },

    updateDateFilters : function(e) {
      this.filters.start = e.detail.start;
      this.filters.stop = e.detail.end;
    },  

    back : function() {
      window.location.hash = 'map'
    },

    _setCostMonth : function(e) {
      var index = parseInt(e.currentTarget.getAttribute('index'));
      this.costs.selected = index;

      this.costChartLabel = this.costs.label+' - '+this.costsMonths[this.costs.selected].label;
      this.costChartData = this.costs.data[this.costsMonths[this.costs.selected]];
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