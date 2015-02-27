/*
    And the visibility of various panels and charts based on given features
*/
modulate('InfoPageDomControllers', function() {
    return {
        updateDateSliderVisibility : function() {
            this.showDateRangeSlider = this.inflows.length > 0 || this.constraintChart.isTimeSeries
        },

        stampEacChart : function() {
            if( this.eacChart.data.length > 0 ) {
                this.charts.eacChart = null;
                this.$.eacChartRoot.innerHTML = '';
            } else if( !this.charts.eacChart ) {
                this.charts.eacChart = this.$.eacChart.stamp();
                this.$.eacChartRoot.append(this.charts.eacChart.root);
            }
        },

        updateConstraintUi : function() {
            if( this.constraintChart.data.length != 0 && this.constraintChart.constant != -1 ) {
                this.showConstraints = true;
            }
            if( constraintChart.constant != -1 ) {
                this.showConstantConstraints = true;
            }
            
            this.$.constraintChart.innerHTML = '';
            this.charts.constraintChart = null;
            if( this.constraintChart.data.length == 0 ) {
                if( constraintChart.isTimeSeries ) {
                    this.charts.constraintChart = this.$.constraintChartTimeSeries.stamp();
                } else {
                    this.charts.constraintChart = this.$.constraintChart.stamp();
                }

                this.$.constraintChart.append(this.charts.constraintChart.root);
            }
        },

        onLoadingChange : function() {
            debugger;
            this.notifyPath('ds.loading', this.ds.loading);
        }

    }
});
