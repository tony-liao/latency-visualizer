var Redis = require('ioredis');
var redis = new Redis(6379, '127.0.0.1');

module.exports = function() {
  console.log("setting up test");
  redis.flushdb();
  redis.sadd('NodeSet', [ '2', '3', '1']);
  redis.hmset('1', '2', 3.6, '3', 40.9);
  redis.hmset('2', '1', 1.1, '3', 45.2);
  redis.hmset('3', '1', 36.2, '2', 38.2);
}
