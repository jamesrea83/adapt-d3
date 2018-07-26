define([
    '../libs/d3.min'
], function(d3) {


    var d3Force = {

        initialize: function() {
            console.log('d3Force file called')
            d3Force.drawForce.call(this);
        },

        drawForce: function() {

            var range = 20,
                width = this.width,
                height = this.height;

            this.data = {
                nodes: d3.range(0, range)
                        .map(function(d) {
                            return {label: 'l' + d, r:~~d3.randomUniform(8, 20)(), color: getRandomColor()};
                        }),
                links: d3.range(0, range)
                        .map(function() {
                            return {source: ~~d3.randomUniform(range)(), target: ~~d3.randomUniform(range)()}
                        })
            }


            this.margin = {top:0, left:0, bottom:0, right:0 };


            this.simulation = d3.forceSimulation()
                .force('link', d3.forceLink().id(function(d) { return d.index; }))
                .force('collide', d3.forceCollide(function(d) { return d.r + 8; }).iterations(16))
                .force('charge', d3.forceManyBody())
                .force('center', d3.forceCenter(this.width / 2, this.height / 2))
                .force('y', d3.forceY(0))
                .force('x', d3.forceX(0));

            var link = this.svg.append('g')
                .attr('class', 'links')
                .selectAll('line')
                .data(this.data.links)
                .enter()
                .append('line');

            var node = this.svg.append('g')
                .attr('class', 'nodes')
                .selectAll('circle')
                .data(this.data.nodes)
                .enter()
                .append('circle')
                .attr('r', function(d) { return d.r; })
                .attr('fill', function(d) { return d.color; })
                .call(d3.drag()
                    .on('start', dragStarted.bind(this))
                    .on('drag', dragged)
                    .on('end', dragEnded.bind(this)));

            var ticked = function() {
                node
                    .attr('cx', function(d) { return d.x = Math.max(d.r, Math.min(width - d.r, d.x)); })
                    .attr('cy', function(d) { return d.y = Math.max(d.r, Math.min(height - d.r, d.y)) });

                link
                    .attr('x1', function(d) { return d.source.x; })
                    .attr('y1', function(d) { return d.source.y; })
                    .attr('x2', function(d) { return d.target.x; })
                    .attr('y2', function(d) { return d.target.y; })
            }

            this.simulation
                .nodes(this.data.nodes)
                .on('tick', ticked);

            this.simulation
                .force('link')
                .links(this.data.links);


            function dragStarted(d) {
                if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y
            }

            function dragged(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            }

            function dragEnded(d) {
                if (!d3.event.active) this.simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }

            function getRandomColor() {
                var letters = '0123456789ABCDEF';
                var color = '#';
                for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            }
        },

        triggerClicked: function() {
            var strength = [-50, -500];

            this.clickCounter++;
            var force = strength[this.clickCounter % 2];

            this.simulation
                .force('charge', d3.forceManyBody().strength(force))
                .alpha(1).restart()
        }



    }

    return d3Force;

})


/*
            var width = this.width,
                height = this.height;


            var nodes_data =  [
                {"id": "1"},
                {"id": "2"},
                {"id": "3"},
                {"id": "4"},
                {"id": "5"},
                {"id": "6"}
                ]

            var links_data = [
                {"source": "1", "target": "2"},
                {"source": "3", "target": "2"},
                {"source": "3", "target": "4"},
                {"source": "4", "target": "2"},
                {"source": "4", "target": "5"},
                {"source": "6", "target": "4"}
            ]



            this.simulation = d3.forceSimulation()
                .nodes(nodes_data);

            this.simulation
                .force('charge_force', d3.forceManyBody())
                .force('center_force', d3.forceCenter(width / 2, height / 2));

            var node = this.svg.append('g')
                .attr('class', 'nodes')
                .selectAll('circle')
                .data(nodes_data)
                .enter()
                .append('circle')
                .attr('r', 10)
                .attr('fill', 'red')


            this.simulation.on('tick', tickActions);

            var link_force = d3.forceLink(links_data)
                .id(function(d) { return d.id; });


            this.simulation.force('links', link_force);

            var link = this.svg.append('g')
                .attr('class', 'links')
                .selectAll('line')
                .data(links_data)
                .enter()
                .append('line')
                .attr('stroke-width', 2)





            function tickActions() {

                node
                    .attr('cx', function(d) { return d.x; })
                    .attr('cy', function(d) { return d.y; });

                link
                    .attr('x1', function(d) { return d.source.x; })
                    .attr('y1', function(d) { return d.source.y; })
                    .attr('x2', function(d) { return d.target.x; })
                    .attr('y2', function(d) { return d.target.y; })

            }
*/
