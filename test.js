var Redis = require('ioredis');
var redis = new Redis(6379, '127.0.0.1');

module.exports = function() {
  console.log("setting up test");
  redis.flushdb();
  redis.sadd('NodeSet', ['0', '1', '2', '3', '4', '5']);
  redis.hmset('0', '1', 3.6, '2', 40.9, '3', 13.7, '4', 20.6, '5', 48.9);
  redis.hmset('1', '0', 1.1, '2', 45.2);
  redis.hmset('2', '0', 36.2, '1', 38.2, '5', 8.9);
  redis.hmset('3', '0', 18.4, '4', 9.6);
  redis.hmset('4', '0', 30.0, '3', 25.3);
  redis.hmset('5', '0', 56.8, '2', 18);
}
