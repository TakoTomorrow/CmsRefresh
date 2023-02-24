"use strict";
const AWS = require("aws-sdk");
const redis = require("ioredis");
// cluster config url or primary cache url
const elasticacheHost = process.env.CACHE_URL;
const elasticachePort = process.env.CACHE_PORT || 6379;
const region = process.env.AWS_REGION;
const envStage = process.env.STAGE;
AWS.config.update({ region: region });
let redisClient;
if (envStage == "DEV") {
  console.log("DEV");
  redisClient = new redis({
    host: elasticacheHost,
    port: elasticachePort,
    options: { enableReadyCheck: false },
  });
} else if (envStage == "UAT" || envStage == "PRD") {
  let clusterOptions = {
    enableReadyCheck: false,
    slotsRefreshTimeout: 2000
  };
  redisClient = new redis.Cluster([elasticacheHost, elasticachePort], clusterOptions);
}
// exports get, set, and del functions from redisClient
module.exports = {
  on: () => redisClient.on('error', function(error) { console.log(error); }),
  exists: (key) => redisClient.exists(key),
  del: (key) => redisClient.del(key),
};