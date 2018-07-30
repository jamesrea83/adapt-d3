define([
    '../libs/d3.min',
], function(d3) {

    var d3Pie = {

        initialize: function() {
            console.log('d3Pie file called')
            this.data = [10, 20, 100];
            d3Pie.setupPie.call(this);
            d3Pie.updatePie.call(this);
        },

        setupPie: function() {

            var data = this.data;

            var width = this.width,
                height = this.height,
                radius = Math.min(width, height) / 2;

            this.colorArray = ['#AA3939', '#226666', '#AA8439'];

            var pie = d3.pie()
                .value(function(d) {return d;})(data);




            this.arc = d3.arc()
                .outerRadius(radius - 10)
                .innerRadius(.5);

            this.labelArc = d3.arc()
                .outerRadius(radius - 40)
                .innerRadius(radius - 70);


            this.innerSvg = this.svg.append('g')
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')'); //move centre point
        },


        updatePie: function() {

            var arc = this.arc,
                labelArc = this.labelArc;

            var pie = d3.pie()
                .sort(null)
                .value(function(d) { return d; })(this.data)


            /*CHART SECTIONS*/
            path = this.innerSvg
                .selectAll('path')
                .data(pie)

            /*remove elements for superflous data points*/
            path
                .exit()
                .transition()
                .remove()

            /*add elements for any new data points*/
            path
                .enter()
                .append('path')
                .attr('d', arc)
                .attr('class', 'path')
                .each(function(d) { this._current = d; });

            /*update exisiting elements*/
            path
                .transition()
                .duration(500)
                .attrTween('d', arcTween);



            /*LABELS*/
            labels = this.innerSvg.selectAll('text')
                .data(pie);

            /*remove elements for superflous data points*/
            labels
                .exit()
                .remove()

            /*add elements for any new data points*/
            labels
                .enter()
                .append('text')
                .attr('transform', function(d) { return 'translate(' + labelArc.centroid(d) + ')'; })
                .text(function(d) { return d.data; })
                .style('fill', '#fff')
                .each(function(d) { this._current = d; });

            /*update exisiting elements*/
            labels
                .transition()
                .duration(500)
                .text(function(d) { return d.data; })
                .attrTween('transform', labelArcTween)

            /*add random colours*/
            this.innerSvg
                .selectAll('path')
                .style('fill', function(d, i) { return this.colorArray[i]; }.bind(this));


            /*calculate arcs*/
            function arcTween(a) {
                var i = d3.interpolate(this._current, a);
                this._current = i(0);
                return function(t) {
                    return arc(i(t));
                };
            }

            function labelArcTween(a) {
                var i = d3.interpolate(this._current, a);
                this._current = i(0);
                return function(t) {
                    return "translate(" + labelArc.centroid(i(t)) + ")";
                };
            }

        },


        getRandomColor: function() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        },

        triggerClicked: function() {
            var data2 = [];
            //this.length = Math.floor(Math.random() * 4) + 2;
            for (var i = 0, j = 3; i < j; i++) {
                data2.push(Math.floor(Math.random() * 180) + 10)
            }
            this.data = data2;

            d3Pie.updatePie.call(this);
        }

    }

    return d3Pie

})
