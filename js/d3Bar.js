
define(function() {

    var d3Bar = {

        initialize: function() {
            console.log('d3Bar file called');

            d3Bar.drawBar.call(this);
        },

        drawBar: function() {
            var barWidth = this.width / this.data.length;
            var data = this.data;
            var height = this.height;
            var barWidth = this.width / data.length;
            this.length = this.data.length;


            var bars = this.svg.selectAll('rect')
                .data(data);

            bars
                .exit()
                .remove();

            bars
                .enter()
                .append('rect')
                .attr('y', function(d) {return height - d})
                .attr('height', function(d) {return d})
                .attr('width', barWidth - 1)
                .attr('transform', function(d, i) {
                    var translate = [barWidth * i, 0];
                    return 'translate(' + translate + ')';
                });


            bars
                .transition()
                .attr('y', function(d) {return height - d})
                .attr('height', function(d) {return d})
                .attr('width', barWidth - 1)
                .attr('transform', function(d, i) {
                    var translate = [barWidth * i, 0];
                    return 'translate(' + translate + ')';
                });

            var labels = this.svg.selectAll('text')
                .data(data);

            labels
                .exit()
                .remove();

            labels
                .enter()
                .append('text')
                .attr('x', function(d, i) {return barWidth * i + (barWidth / 2);})
                .attr('y', function(d) {return height - d + 20})
                .attr('text-anchor', 'middle')
                .text(function(d) {return d;})

            labels
                .transition()
                .attr('x', function(d, i) {return barWidth * i + (barWidth / 2);})
                .attr('y', function(d) {return height - d + 20})
                .attr('text-anchor', 'middle')
                .text(function(d) {return d;})

            this.svg.selectAll('rect')
                .style('fill', d3Bar.getRandomColor())
        },

        triggerClicked: function() {
            this.clickCounter++;
            if (this.clickCounter % 3 === 0) {
                this.length = Math.floor(Math.random() * 8) + 4;
            }
            var data2 = [];
            for (var i = 0; i < this.length; i++) {
                data2.push(Math.floor(Math.random() * 120) + 40)
            }
            this.data = data2;
            d3Bar.drawBar.call(this);
        },

        getRandomColor: function() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

    }
    return d3Bar;
})
