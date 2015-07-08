/*
    And the visibility of various panels and charts based on given features
*/
var InfoPageDomControllers = {

    updateDateSliderVisibility : function() {
      if( !this.inflows ) return;
        this.showDateRangeSlider = this.inflows.length > 0 || this.hasTimeSeries
    },

    stampEacChart : function() {
      if( !this.eacChart ) return;

        if( this.eacChart.data.length == 0 ) {

            this.charts.eacChart = null;
            this.$.eacChartRoot.innerHTML = '';

        } else if( !this.charts.eacChart ) {

            this.charts.eacChart = this.$.eacChart.stamp(this.eacChart);
            this.$.eacChartRoot.appendChild(this.charts.eacChart.root);

            this.async(function(){
                this.$.eacChartRoot.querySelector('cwn-linechart').update(this.eacChart.data);
            });
        }
    }
}
