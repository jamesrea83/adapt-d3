define([
    '../libs/d3.min'
], function(d3) {


    var d3Tree = {


        initialize: function() {
            console.log('d3Tree file called');
            d3Tree.drawTree.call(this);
            this.$('.js-trigger').addClass('disabled');
        },

        drawTree: function() {

            var treeData = {
                'name': 'Top Level',
                'children': [
                    {
                        'name': 'Level 2: A',
                        'children': [
                            {
                                'name': '2-A-One'
                            },
                            {
                                'name': '2-A-Two'
                            }
                        ]
                    },
                    {
                        'name': 'Level 2: B'
                    }
                ]
            };

            var margin = {top: 20, right: 90, bottom: 30, left: 90},
                width = this.width - margin.left - margin.right,
                height = this.height - margin.top - margin.bottom;

            var innerSvg = this.svg
                    .attr('width', width + margin.right + margin.left)
                    .attr('height', height + margin.top + margin.bottom)
                .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            var i = 0,
                duration = 750,
                root;


            var treeMap = d3.tree()
                .size([height, width]);

            root = d3.hierarchy(treeData, function(d) { return d.children; });
            root.x0 = height / 2;
            root.y0 = 0;

            root.children.forEach(collapse);

            update(root);

            function collapse(d) {
                if (d.children) {
                    d._children = d.children;
                    d._children.forEach(collapse);
                    d.children = null;
                }
            }

            function update(source) {
                var treeData = treeMap(root);

                var nodes = treeData.descendants(),
                    links = treeData.descendants().slice(1);

                nodes.forEach(function(d) { return d.y = d.depth * 180; });

                var node = innerSvg.selectAll('g.node')
                    .data(nodes, function(d) { return d.id || (d.id = ++i); });


                var nodeEnter = node.enter()
                    .append('g')
                    .attr('class', 'node')
                    .attr('transform', function(d) {
                        return 'translate(' + source.y0 + ',' + source.x0 + ')';
                    })
                    .on('click', click);

                nodeEnter.append('circle')
                    .attr('class', 'node')
                    .attr('r', 1e-6)
                    .style('fill', function(d) {
                        return d._children ? 'lightsteelblue' : '#fff';
                    });

                nodeEnter.append('text')
                    .attr('dy', '.35em')
                    .attr('x', function(d) {
                        return d.children || d._children ? -13 : 13;
                    })
                    .attr('text-anchor', function(d) {
                        return d.children || d._children ? 'end' : 'start';
                    })
                    .text(function(d) { return d.data.name; });


                var nodeUpdate = nodeEnter.merge(node);

                nodeUpdate.transition()
                    .duration(duration)
                    .attr('transform', function(d) {
                        return 'translate(' + d.y + ',' + d.x + ')';
                    });

                nodeUpdate.select('circle.node')
                    .attr('r', 10)
                    .style('fill', function(d) {
                        return d._children ? 'lightsteelblue' : '#fff';
                    })
                    .attr('cursor', 'pointer');
                /**/

                // Remove any exiting nodes
                  var nodeExit = node.exit().transition()
                      .duration(duration)
                      .attr("transform", function(d) {
                          return "translate(" + source.y + "," + source.x + ")";
                      })
                      .remove();

                  // On exit reduce the node circles size to 0
                  nodeExit.select('circle')
                    .attr('r', 1e-6);

                  // On exit reduce the opacity of text labels
                  nodeExit.select('text')
                    .style('fill-opacity', 1e-6);

                  // ****************** links section ***************************

                  // Update the links...
                  var link = innerSvg.selectAll('path.link')
                      .data(links, function(d) { return d.id; });

                  // Enter any new links at the parent's previous position.
                  var linkEnter = link.enter().insert('path', "g")
                      .attr("class", "link")
                      .attr('d', function(d){
                        var o = {x: source.x0, y: source.y0}
                        return diagonal(o, o)
                      });

                  // UPDATE
                  var linkUpdate = linkEnter.merge(link);

                  // Transition back to the parent element position
                  linkUpdate.transition()
                      .duration(duration)
                      .attr('d', function(d){ return diagonal(d, d.parent) });

                  // Remove any exiting links
                  var linkExit = link.exit().transition()
                      .duration(duration)
                      .attr('d', function(d) {
                        var o = {x: source.x, y: source.y}
                        return diagonal(o, o)
                      })
                      .remove();

                  // Store the old positions for transition.
                  nodes.forEach(function(d){
                    d.x0 = d.x;
                    d.y0 = d.y;
                  });

                  // Creates a curved (diagonal) path from parent to the child nodes
                  function diagonal(s, d) {

                    path = `M ${s.y} ${s.x}
                            C ${(s.y + d.y) / 2} ${s.x},
                              ${(s.y + d.y) / 2} ${d.x},
                              ${d.y} ${d.x}`

                    return path
                  }

                  // Toggle children on click.
                  function click(d) {
                    if (d.children) {
                        d._children = d.children;
                        d.children = null;
                      } else {
                        d.children = d._children;
                        d._children = null;
                      }
                    update(d);
                  }


                /**/
            }


        },

        triggerClicked: function() {
            return;
        }


    }

    return d3Tree;

})
