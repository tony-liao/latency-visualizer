var express = require('express');
var Redis = require('ioredis');
var test = require('./test.js')();

var app = express();
var redis = new Redis(6379, '127.0.0.1');
var sub = new Redis(6379, '127.0.0.1');

var data = {};

sub.psubscribe('__keyspace@0__:*', function(err, count){
  if (err) throw err;
  console.log('subscribed!');
  update();
});

sub.on('pmessage', function(channel, message){
  console.log(message);
  update();
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/graph.js', function (req, res) {
  res.sendFile(__dirname + '/graph.js')
});

app.get('/data.json', function (req, res) {
  //console.log(data);
  res.send(data);
});

app.listen(3000, function () {
  console.log('Listening on port 3000');
});

var update = function(){
  console.log('updating');
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
        }
      });
    });
  });
};
