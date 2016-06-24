// Lifted from d3 wiki
var width = 960,
    height = 500;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(50)
    .size([width, height]);

var svg = d3.select('body').append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json('data.json', function(error, graph){
  if (error) throw error;

  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  var link = svg.selectAll(".link")
      .data(graph.links)
      .enter()
      .append("g")
      .attr("class", "link")
      .append("line")
      .attr("class", "link-line")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  var linkText = svg.selectAll(".link")
      .append("text")
      .attr("class", "link-label")
      //.attr("font-family", "Arial, Helvetica, sans-serif")
      //.attr("fill", "Black")
      .style("font", "normal 12px Arial")
      .text(function(d){
        return d.value;
      });

  var node = svg.selectAll(".node")
      .data(graph.nodes)
      .enter().append("circle")
      .attr("class", "node")
      .style("fill", function(d) { return color(d.group); })
      .call(force.drag);

  node.append("title")
      .text(function(d) { return d.name; });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    linkText
        .attr("x", function(d) {
            return ((d.source.x + d.target.x)/2);
        })
        .attr("y", function(d) {
            return ((d.source.y + d.target.y)/2);
        });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });

});
