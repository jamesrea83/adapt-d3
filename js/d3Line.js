define([
    '../libs/d3.min'
], function(d3) {

    var d3Line = {

        initialize: function() {
            console.log('d3Line file called');
            this.data = [10, 20, 100];
            d3Line.setupLine.call(this);
            //d3Line.updateLine.call(this);
        },


        setupLine: function() {

            //set up dimensions
            var margin = {top: 20, right: 25, bottom: 20, left: 25},
                width = this.width - margin.left - margin.right,
                height = this.height - margin.top - margin.bottom;

            //number of elements to be used
            this.n = 21;

            //create random data set of length n
            this.dataSet = d3.range(this.n)
                .map(function(d) { return { 'y': d3.randomUniform(1)() }; })

            //setup scales
            this.xScale = d3.scaleLinear()
                .domain([0, this.n - 1])
                .range([0, width]);

            this.yScale = d3.scaleLinear()
                .domain([0, 1])
                .range([height, 0]);

            this.line = d3.line()
                .x(function(d, i) { return this.xScale(i)}.bind(this))
                .y(function(d) { return this.yScale(d.y)}.bind(this))
                .curve(d3.curveMonotoneX);

            //create main g to be used
            this.innerSvg = this.svg
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            //add axes
            this.innerSvg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + height + ')')
                .call(d3.axisBottom(this.xScale));

            this.innerSvg.append('g')
                .attr('class', 'y axis')
                .call(d3.axisLeft(this.yScale));

            //create initial line element
            this.path = this.innerSvg.append('path')
                .datum(this.dataSet)
                .attr('class', 'line')
                .attr('d', this.line);

            //create initial data point elements
            this.dot = this.innerSvg.selectAll('.dot')
                .data(this.dataSet)
                .enter()
                .append('circle')
                .attr('class', 'dot')
                .attr('cx', function(d, i) { return this.xScale(i); }.bind(this))
                .attr('cy', function(d) { return this.yScale(d.y); }.bind(this))
                .attr('r', 5);
        },

        updateLine: function() {

            //update line element
            this.path
                .datum(this.dataSet)
                .transition()
                .duration(500)
                .attr('class', 'line')
                .attr('d', this.line);

            //update data point elements
            this.dot 
                .data(this.dataSet)
                .transition()
                .duration(500)
                .attr('cx', function(d, i) { return this.xScale(i); }.bind(this))
                .attr('cy', function(d) { return this.yScale(d.y); }.bind(this));

        },

 
        triggerClicked: function() {
            console.log('d3Line trigger clicked');
            this.dataSet = d3.range(this.n)
                .map(function(d) { return { 'y': d3.randomUniform(1)() }; });
            d3Line.updateLine.call(this);
        }

    }

    return d3Line;

})
