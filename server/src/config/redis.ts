// develop localhost mode
import { createClient } from "redis";

export const redisClient = createClient({
  url: "redis://localhost:6379",
});

redisClient.on("error", (err) => console.error("Redis Error:", err));
redisClient.connect();


// docker
// import { createClient } from "redis";

// export const redisClient = createClient({
//   url: `redis://${process.env.REDIS_HOST || "redis"}:${process.env.REDIS_PORT || 6379}`,
// });

// redisClient.on("connect", () => console.log("Redis connected"));
// redisClient.on("error", (err) => console.error("Redis Error:", err));

// redisClient.connect()
//   .then(() => console.log("Redis connected"))
//   .catch(err => console.error("Redis connection failed:", err));
