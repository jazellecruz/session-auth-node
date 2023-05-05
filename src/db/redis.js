const redisClient = require("redis").createClient();
const RedisStore = require("connect-redis").default;

const connectToRedis = async() => {
  try{
    await redisClient.connect("connect");
    console.log("Redis Storage connected...");
  } catch(err) {
    console.log("Error in connecting to Redis Store...", err)
  }
} 

// session storage
const redisStore = new RedisStore({
  client: redisClient
});

module.exports = {connectToRedis, redisClient, redisStore}