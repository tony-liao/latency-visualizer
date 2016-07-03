var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Redis = require('ioredis');
var test = require('./test.js')();

var redis = new Redis(6379, '127.0.0.1');
var sub = new Redis(6379, '127.0.0.1');

var data = {};

// Subscribe to redis keyspace notifications
sub.psubscribe('__keyspace@0__:*', function(err, count){
  if (err) throw err;
  console.log('subscribed to keyspace');
});

sub.on('pmessage', function(channel, message){
  console.log(message);
  var node = message.replace('__keyspace@0__:', '');
  getLinks(node, function(links){
    io.emit('data', links);
  });
});

io.on('connection', function(socket){
  console.log('a user connected');
});

// Routes
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

server.listen(3000, function () {
  console.log('Listening on port 3000');
});

// Access and process redis data
function getLinks(node, callback) {
  redis.hgetall(node, function (err, latencies){
    var links = Object.keys(latencies).map(function(key){
      return {'source': parseInt(node),
              'target': parseInt(key),
              'value': parseInt(latencies[key])};
    });
    callback(links);
  });
}

function reload() {
  console.log('reloading');
  var newData = {'nodes':[], 'links':[]}

  redis.smembers('nodes', function(err, nodes){
    newData.nodes = nodes.map(function(node){
      return {'name': "Node " + node, 'group': 1};
    });

    //Keep track of number of completed db calls; simpler than using promises
    var loadedHashes = 0;
    nodes.forEach(function(node){
      getLinks(node, function(links){
        newData.links = newData.links.concat(links);
        if(++loadedHashes == nodes.length) //All hashes loaded
          data = newData;
      });
    });
  });
};

reload(); //Load once on startup
