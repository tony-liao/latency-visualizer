var express = require('express');
var Redis = require('ioredis');

var app = express();
var redis = new Redis(6379, '127.0.0.1');

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.listen(3000, function () {
  console.log('Listening on port 3000');
});
