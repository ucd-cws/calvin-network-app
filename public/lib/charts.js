// elements that need charts can push to this array callbacks for when charts are loaded
var chartLoadHandlers = [];

google.load("visualization", '1', {
    packages:['corechart', 'line'],
    callback : function() {
        for( var i = 0; i < chartLoadHandlers.length; i++ ) {
            chartLoadHandlers[i]();
        }
    }
});

module.exports = chartLoadHandlers;