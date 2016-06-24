var express = require('express');
var Redis = require('ioredis');

var app = express();
var redis = new Redis(6379, '127.0.0.1');

// Testing setup begin
redis.flushdb();
redis.sadd('nodes', ['1', '2', '3', '4']);
redis.hmset('1', '2', 10, '4', 2);
redis.hmset('3', '1', 5, '2', 50);

var data = {
  "nodes":[
    {"name":"A"},
    {"name":"B"}
  ],
  "links":[
    {"source":0, "target":1, "value":5}
  ]
};
// Testing setup end

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
  redis.hgetall('1', function(error, nodes){
    if (error) throw error;
    console.log(nodes);
  });
});

app.get('/graph.js', function (req, res) {
  res.sendFile(__dirname + '/graph.js')
});

app.get('/data.json', function (req, res) {
  res.send(data);
});

app.listen(3000, function () {
  console.log('Listening on port 3000');
});
