/*
    And the visibility of various panels and charts based on given features
*/
modulate('InfoPageDomControllers', function() {
    return {
        updateDateSliderVisibility : function() {
            this.showDateRangeSlider = this.inflows.length > 0 || this.hasTimeSeries
        },

        stampEacChart : function() {

            if( this.eacChart.data.length == 0 ) {

                this.charts.eacChart = null;
                this.$.eacChartRoot.innerHTML = '';

            } else if( !this.charts.eacChart ) {

                this.charts.eacChart = this.$.eacChart.stamp(this.eacChart);
                this.$.eacChartRoot.appendChild(this.charts.eacChart.root);
            }
        },

        onLoadingChange : function() {
            this.notifyPath('ds.loading', this.ds.loading);
        }

    }
});