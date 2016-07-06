var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Redis = require('ioredis');
//var test = require('./test.js')();

var redis = new Redis(6379, '127.0.0.1');
var sub = new Redis(6379, '127.0.0.1');

var data = {};

// Subscribe to redis keyspace notifications
redis.config('set', 'notify-keyspace-events', 'KEA');

sub.psubscribe('__keyspace@0__:*', function(err, count){
  if (err) throw err;
  console.log('subscribed to keyspace');
});

sub.on('pmessage', function(channel, message){
  //Reload to keep internal data accurate
  reload(function(d) {
    data = d;
    var node = message.replace('__keyspace@0__:', '');
    io.emit('data', data.links);
    // getLinks(node, function(links){
    //   io.emit('data', links);
    // });
  });
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('init', data);
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
  console.log('listening on port 3000');
});

// Access and process redis data
function getLinks(node, callback) {
  redis.hgetall(node, function (err, latencies){
    var links = Object.keys(latencies).map(function(key){
      return {'source': parseInt(node) - 1,
              'target': parseInt(key) - 1,
              'value': parseInt(latencies[key])};
    });
    callback(links);
  });
}

function reload(callback) {
  var newData = {'nodes':[], 'links':[]}

  redis.smembers('NodeSet', function(err, nodes){
    newData.nodes = nodes.map(function(node){
      return {'name': "Node " + node, 'group': 1};
    });

    //Keep track of number of completed db calls; simpler than using promises
    var loadedHashes = 0;
    nodes.forEach(function(node){
      getLinks(node, function(links){
        newData.links = newData.links.concat(links);
        if(++loadedHashes == nodes.length) //All hashes loaded
          callback(newData);
      });
    });
  });
}

// Load once on startup
reload(function(d) {
  data = d;
});
