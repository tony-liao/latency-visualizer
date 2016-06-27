var express = require('express');
var Redis = require('ioredis');
var test = require('./test.js')();

var app = express();
var redis = new Redis(6379, '127.0.0.1');

var data = {};

// var data = {
//   "nodes": [
//     { name: 'a', group: 1 },
//     { name: 'b', group: 1 },
//     { name: 'c', group: 1 },
//     { name: 'd', group: 1 } ],
//   "links": [
//     { source: 0, target: 1, value: 10 },
//     { source: 0, target: 3, value: 2 },
//     { source: 1, target: 3, value: 12 },
//     { source: 2, target: 0, value: 5 },
//     { source: 2, target: 1, value: 50 }
// ]};


app.get('/', function (req, res) {
  var newData = {nodes:[], links:[]};

  redis.smembers('nodes', function(err, nodes){
    newData.nodes = nodes.map(function(node){
      return {'name': "Node " + node, 'group': 1};
    });

    //Keep track of number of completed db calls; simpler than using promises
    var loadedHashes = 0;
    nodes.forEach(function(node){
      redis.hgetall(node, function (err, latencies){
        Object.keys(latencies).forEach(function(key){
          newData.links.push({'source': parseInt(node),
                              'target': parseInt(key),
                              'value': parseInt(latencies[key])});
        });
        if(++loadedHashes == nodes.length){ //All hashes loaded
          data = newData;
          //console.log(data);
          res.sendFile(__dirname + '/index.html');
        }
      });
    });
  });
});


app.get('/graph.js', function (req, res) {
  res.sendFile(__dirname + '/graph.js')
});

app.get('/data.json', function (req, res) {
  //console.log(data);
  res.send(JSON.stringify(data));
});

app.listen(3000, function () {
  console.log('Listening on port 3000');
});
