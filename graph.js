var socket = io();

var width = 1280,
    height = 720;

var color = d3.scale.linear()
    .domain([0, 50])
    .range(['#00ff00', '#ff0000']);

var force = d3.layout.force()
    .linkStrength(0.5)
    .charge(-500)
    .gravity(0.04)
    .linkDistance(200)
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
  // Nodes
  // No values to update
  var node = svg.selectAll(".node")
      .data(nodes);

  // Create new nodes
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .call(force.drag);
  nodeEnter.append("circle");
  nodeEnter.append("text")
      .text(function(d){
        return d.name;
      });

  // Remove old nodes
  node.exit().remove();


  // Links
  // Update existing links
  var link = svg.selectAll(".link")
      .data(links)
      .style("stroke", function(d){return color(d.value);});
  link.select("text")
      .text(function(d){return d.value;});

  // Create new links
  var linkEnter = link.enter().append("g")
      .attr("class", "link")
      .style("stroke", function(d){return color(d.value);});
  linkEnter.append("line")
      .attr("stroke-width", 3)
      .attr("marker-end", "url(#end)");
  linkEnter.append("text")
      .text(function(d){return d.value;})

  // Remove old links
  link.exit().remove();


  function draw(){
    // Update link location
    svg.selectAll(".link").selectAll("line").each(function(d) {
      var dx = (d.target.y - d.source.y) * -0.03,
          dy = (d.target.x - d.source.x) * 0.03;

      d3.select(this).attr("x1", d.source.x + dx)
          .attr("y1", d.source.y + dy)
          .attr("x2", d.target.x + dx)
          .attr("y2", d.target.y + dy);
    });
    svg.selectAll(".link").selectAll("text").attr("transform", function(d) {
      var dx = (d.target.y - d.source.y) * -0.09,
          dy = (d.target.x - d.source.x) * 0.09;

      return "translate(" + ((d.source.x + d.target.x)/2 + dx) + "," +
                            ((d.source.y + d.target.y)/2 + dy + 5) + ")";
    });

    // Update node location
    node.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
              });
  }

  // Draw nodes on top
  svg.selectAll(".node").each(function(index) {
        this.parentNode.appendChild(this);
  });

  force.on("tick", draw)
       .start();
};

socket.on('init', function(graph) {
  links.splice(0);
  nodes.splice(0);
  links.push.apply(links, graph.links);
  nodes.push.apply(nodes, graph.nodes);
  update();
});

socket.on('data', function(l) {
  links.splice(0);
  links.push.apply(links, l);
  update();
});
