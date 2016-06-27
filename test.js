var Redis = require('ioredis');
var redis = new Redis(6379, '127.0.0.1');

module.exports = function() {
  console.log("setting up test");
  redis.flushdb();
  redis.sadd('nodes', ['0', '1', '2', '3']);
  redis.hmset('0', '1', 10, '3', 2);
  redis.hmset('1', '3', 12);
  redis.hmset('2', '0', 5, '1', 50);
}
