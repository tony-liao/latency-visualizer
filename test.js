var Redis = require('ioredis');
var redis = new Redis(6379, '127.0.0.1');

module.exports = function() {
  console.log("setting up test");
  redis.flushdb();
  redis.sadd('NodeSet', ['1', '2', '3', '4', '5', '6']);
  redis.hmset('1', '2', 3.6, '3', 40.9, '4', 13.7, '5', 20.6, '6', 48.9);
  redis.hmset('2', '1', 1.1, '3', 45.2);
  redis.hmset('3', '1', 36.2, '2', 38.2, '6', 8.9);
  redis.hmset('4', '1', 18.4, '5', 9.6);
  redis.hmset('5', '1', 30.0, '4', 25.3);
  redis.hmset('6', '1', 56.8, '3', 18);
}
