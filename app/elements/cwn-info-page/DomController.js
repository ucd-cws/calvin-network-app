/*
    And the visibility of various panels and charts based on given features
*/
var InfoPageDomControllers = function() {

    function updateDateSliderVisibility() {
        this.showDateRangeSlider = this.inflows.length > 0 || this.hasTimeSeries
    }

    function stampEacChart() {

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

    function onLoadingChange() {
        this.notifyPath('ds.loading', this.ds.loading);
    }

    return {
        updateDateSliderVisibility : updateDateSliderVisibility,
        stampEacChart : stampEacChart,
        onLoadingChange : onLoadingChange
    }
}
