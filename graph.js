// Lifted from d3 wiki
var width = 1280,
    height = 720;

var color = d3.scale.category20();

var force = d3.layout.force()
  .charge(-1000)
  .linkDistance(function(d){
    return 1000/d.value + 100;
  })
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

  svg.append("defs").selectAll("marker")
    .data(["end"])
    .enter().append("marker")
    .attr("id", function(d) { return d; })
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 25)
    .attr("refY", 2)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .style("fill", "#999")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5");

  var link = svg.selectAll(".link")
    .data(graph.links)
    .enter()
    .append("g")
    .attr("class", "link")
    .append("path")
    .attr("class", "link-path")
    .style("fill", "transparent")
    .style("stroke-width", 3)
    .attr("marker-end", "url(#end)");

  var linkText = svg.selectAll(".link")
    .append("text")
    .attr("class", "link-label")
    //.attr("font-family", "Arial, Helvetica, sans-serif")
    //.attr("fill", "Black")
    //.style("font", "normal 12px Arial")
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

  var getCurvePoint = function(d, delta){
    return {"x": (d.source.x + d.target.x)/2 - (d.target.y - d.source.y) * delta,
            "y": (d.source.y + d.target.y)/2 + (d.target.x - d.source.x) * delta};
  }

  force.on("tick", function() {
    link.attr("d", function(d){
      var c = getCurvePoint(d, 0.5);
      return "M" + d.source.x + "," + d.source.y +
             "Q" +  c.x + "," + c.y + "," +
             d.target.x + "," + d.target.y;
    });

    linkText.attr("x", function(d) {
      return getCurvePoint(d, 0.2).x;
    })
    .attr("y", function(d) {
      return getCurvePoint(d, 0.2).y;
    });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    nodeText.attr("x", function(d) {return d.x;})
            .attr("y", function(d) {return d.y;});
  });
});
