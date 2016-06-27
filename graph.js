// Lifted from d3 wiki
var width = 1600,
    height = 900;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(200)
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
      .text(function(l){
        return l.value;
      });

  var node = svg.selectAll(".node")
      .data(graph.nodes)
      .enter().append("g")
      .attr("class", "node")
      .call(force.drag)
      .append("circle")
      .attr("class", "node-circle")
      .style("fill", function(d) { return color(d.group); });


  var nodeText = svg.selectAll(".node")
      .append("text")
      .attr("class", "node-label")
      .text(function(n){
        return n.name;
      });

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

    nodeText.attr("x", function(d) {return d.x;})
            .attr("y", function(d) {return d.y;});
  });
});
