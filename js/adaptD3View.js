define([
    'core/js/views/componentView',
    '../libs/d3.min',
    './d3Bar',
    './d3Pie',
    './d3Line'
], function(ComponentView, d3, d3Bar, d3Pie, d3Line) {


    var  AdaptD3View = ComponentView.extend({

        chartType: "",
        clickCounter: 0,
        length: 3,
        selector: "",
        width: 0,
        height: 0,
        data: [],
        svg: null,
        chartFile: null,
        events: {
            'click .js-trigger': 'triggerClicked'
        },



        postRender: function() {
            this.setReadyStatus();
            console.log('d3 component loaded');
            this.data = this.model.get('initialData');
            this.setupChart();
            this.chartSelector();
        },

        setupChart: function() {
            var idClass= this.model.get('_classes');
            this.selector = '.' + idClass + ' .m-d3__container';
            this.width = $(this.selector).parent().width();
            this.height = 300;

            this.svg = d3.select(this.selector)
                .append('svg')
                .attr('width', this.width)
                .attr('height', this.height)
                .attr('class', 'svg');
        },

        chartSelector: function() {
            var chartType = this.model.get('chartType');

            switch(chartType) {
                case 'bar':
                    this.chartFile = d3Bar;
                    break;
                case 'pie':
                    this.chartFile = d3Pie;
                    break;
                case 'line':
                    this.chartFile = d3Line;
                    break;
            }

            this.chartFile.initialize.call(this);

        },

        triggerClicked: function() {
            this.chartFile.triggerClicked.call(this);
        }


    },
    {
        template: 'adaptD3'
    });

    return AdaptD3View;

})
