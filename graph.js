var socket = io();

var width = 1280,
    height = 720;

var force = d3.layout.force()
    .charge(-100)
    .linkDistance(300)
    .size([width, height]);

var nodes = force.nodes(),
    links = force.links();

var svg = d3.select('body').append("svg")
    .attr("width", width)
    .attr("height", height)

svg.append("defs").selectAll("marker")
    .data(["end"])
  .enter().append("marker")
    .attr("id", function(d) { return d; })
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 26)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5");

function update(){
  var linkLine = svg.selectAll(".link-line")
      .data(links);

  linkLine.enter().append("line")
      .attr("class", "link-line")
      .attr("stroke-width", 3)
      .attr("marker-end", "url(#end)");

  linkLine.exit().remove();


  var linkLabel = svg.selectAll(".link-label")
      .data(links);

  linkLabel.enter().append("g")
      .attr("class", "link-label")
      .append("text")
      .text(function(d) {
        return d.value;
      });

  linkLabel.exit().remove();


  var node = svg.selectAll(".node")
      .data(nodes);

  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .call(force.drag);

  nodeEnter.append("circle")
      .attr("class", "node-circle");

  nodeEnter.append("text")
      .attr("class", "node-label")
      .text(function(d){
        return d.name;
      });

  node.exit().remove();

  function draw(){

    linkLine.each(function(d) {
      var dx = (d.target.y - d.source.y) * -0.03,
          dy = (d.target.x - d.source.x) * 0.03;

      d3.select(this).attr("x1", d.source.x + dx)
          .attr("y1", d.source.y + dy)
          .attr("x2", d.target.x + dx)
          .attr("y2", d.target.y + dy);
    });

    linkLabel.attr("transform", function(d) {
      var dx = (d.target.y - d.source.y) * -0.07,
          dy = (d.target.x - d.source.x) * 0.07;

      return "translate(" + ((d.source.x + d.target.x)/2 + dx) + "," +
                            ((d.source.y + d.target.y)/2 + dy + 7) + ")";
    });

    node.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
              });
  }

  force.on("tick", draw)
       .start();
};

socket.on('init', function(graph) {
  console.log(graph);
  links.splice(0);
  nodes.splice(0);
  links.push.apply(links, graph.links);
  nodes.push.apply(nodes, graph.nodes);
  console.log(links);
  console.log(nodes);
  update();
});

socket.on('data', function(links) {
//  console.log(links);
});
