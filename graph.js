var socket = io();

socket.on('data', function(links) {
  console.log(links);
});

var width = 1280,
    height = 720;

var force = d3.layout.force()
    .charge(-1000)
    .linkDistance(300)
    .size([width, height]);

var svg = d3.select('body').append("svg")
    .attr("width", width)
    .attr("height", height);

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

function update(error, graph){
  if (error) throw error;

  var link = svg.selectAll(".link")
      .data(graph.links);

  var linkEnter = link.enter().append("g")
      .attr("class", "link");

  var linkPath = linkEnter.append("path")
      .attr("class", "link-path")
      .style("fill", "transparent")
      .style("stroke-width", 3)
      .attr("marker-end", "url(#end)");

  var linkText = linkEnter.append("text")
      .attr("class", "link-label")
      .text(function(l){
        return l.value;
      });

  link.exit().remove();

  var node = svg.selectAll(".node")
      .data(graph.nodes);

  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .call(force.drag);

  nodeEnter.append("circle")
      .attr("class", "node-circle");

  nodeEnter.append("text")
      .attr("class", "node-label")
      .text(function(n){
        return n.name;
      });

  node.exit().remove();

  function getCurvePoint(d, delta){
    return {"x": (d.source.x + d.target.x)/2 - (d.target.y - d.source.y) * delta,
            "y": (d.source.y + d.target.y)/2 + (d.target.x - d.source.x) * delta};
  }

  force.on("tick", function() {
    linkPath.attr("d", function(d){
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

    node.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
              });
  });

  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();
};

d3.json('data.json', update);
