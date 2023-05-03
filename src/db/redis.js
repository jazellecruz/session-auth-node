const redisClient = require("redis").createClient();
const RedisStore = require("connect-redis").default;

const connectToRedis = async() => {
  try{
    await redisClient.connect("connect");
    console.log("Redis Storage connected...");
  } catch(err) {
    throw err;
  }
} 

// session storage
const redisStore = new RedisStore({
  client: redisClient
});

module.exports = {connectToRedis, redisClient, redisStore}