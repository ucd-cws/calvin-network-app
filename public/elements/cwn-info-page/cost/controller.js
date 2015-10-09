
Polymer({
    is : 'cwn-cost-info',

    properties : {
        feature : {
            type : Object,
            observer : 'update'
        }
    },

    ready : function() {
      this.noCostData = true;
      this.costsMonths = [];
      this.costs = {
        label : '',
        data : {},
        cost : 0, // for constant costs
        selected : 0
      };



      this.months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],

      this.showCostData = false;
      this.showMonthlyVariableCost = false;
      this.showConstantCost = false;
      this.costChartLabel = '';
      this.costChartData = [];
      this.showBounds = false;
      this.showConstantBounds = false;
      this.showTimeSeriesBounds = false;
      this.showChartBounds = false;
      this.hasTimeSeries = false;
      this.charts = {};
    },

    update : function() {
        if( !this.feature ) return;

        this.hasTimeSeries = false;

        this.showCostData = false;
        this.showMonthlyVariableCost = false;

        this.showBounds = false;

        var hasBounds = false;
        if( this.feature.properties.extras && this.feature.properties.extras.bounds ) {
          hasBounds = true;
        }

        if( !this.feature.properties.costs || !hasBounds ) {
          $(this).parent().hide();
          return;
        }

        $(this).parent().show();
        this.showCostData = true;

        if( hasBounds ) this.loadBounds();


        this.renderCostData(this.feature.properties.costs);
    },



    renderCostData : function(d) {
      this.costs.label = d.type;


      if( d.type == 'Constant' ) {

        this.showConstantCost = true;
        this.costs.cost = d.cost;


      } else if( d.type == 'Monthly Variable' ) {

        this.showMonthlyVariableCost = true;

        this.costsMonths = {};
        var costArr;
        if( !d.costs ) return;

        if( d.costs.data ) {
          this.costMonths = d.costs.data;
        } else {
          this.costMonths = d.costs;
        }
        this.showMonthlyVariableCost = true;
        this.$.monthSelector.style.display = 'inline-block';

        this.setMonth('JAN');

      } else if( d.type == 'Annual Variable' ) {

        if( !d.costs ) return;

        var keys = Object.keys(d.costs);
        if( keys.length == 0 ) return;
        if( keys.length > 1 ) {
          console.log('! cwn-cost-info found multiple keys for costs data');
          console.log(keys);
        }

        this.costChartLabel = d.type+': '+keys[0];
        this.costChartData = d.costs[keys[0]];
        this.$.lineChart.update(this.costChartData);
        this.showMonthlyVariableCost = true;
        this.$.monthSelector.style.display = 'none';

      } else {
        alert('Unknown cost type: '+d.type);
      }
    },

    loadBounds : function() {
      CWN.ds.loadExtras(this.feature.properties.prmname, function(resp){
        this.renderBounds(resp.bounds);
      }.bind(this));
    },

    renderBounds : function(bounds) {
      this.$.boundChartRoot.innerHTML = '';

      if( bounds.length === 0 ) {
        this.showBounds = false;
        return;
      }
      this.showBounds = true;

      for( var i = 0; i < bounds.length; i++ ) {
        var ele = document.createElement('cwn-bound-chart');
        this.$.boundChartRoot.appendChild(ele);
        ele.render(bounds[i]);
      }
    },

    // used by the month selector to update Monthly Variable chart's current month
    // buttons for this UI are generated above.  Can take button click event
    // or month string
    setMonth : function(month) {
      if( typeof month == 'object' ) month = month.currentTarget.innerHTML;
      month = month.toUpperCase();

      this.costChartLabel = this.costs.label+' - '+month;
      this.costChartData = this.costMonths[month];

      // redraw chart
      this.$.lineChart.update(this.costChartData);
    }

});
