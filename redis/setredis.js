const redis = require("redis");
// Kết nối tới Redis
const redisClient = redis.createClient({
  password: "CjNmqlQKkfYeYOjNiqTQzk8Ic3rkvCi4",
  socket: {
    host: "redis-12950.c292.ap-southeast-1-1.ec2.cloud.redislabs.com",
    port: 12950,
  },
});

redisClient.connect().catch(console.error);
const getOrSetCache = async (redisKey, cb) => {
  // Kiểm tra dữ liệu trong Redis
  const data = await redisClient.get(redisKey);
  if (!data) {
    const newdata = await cb();
    await redisClient.setEx(redisKey, 3600, JSON.stringify(newdata));
    return newdata;
  }
  let dataok = JSON.parse(data);
  return dataok;
};
module.exports = getOrSetCache;
