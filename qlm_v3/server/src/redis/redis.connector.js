import { createClient } from "redis";
import config from "../config/index.js";

const { host, port, password } = config.redis;

export const redis = createClient({
  socket: {
    host,
    port,
  },
  password,
});

redis.on("error", (err) => {
  console.error("[Redis] Client error:", err);
});
redis.on("connecet", () => console.log("[Redis] Connecting..."));
redis.on("ready", () => console.log("[Redis] Ready to use..."));
redis.on("end", () => console.log("[Redis] Client disconnected..."));

export async function initRedis() {
  if (!redis.isOpen) {
    await redis.connect();
    console.log(`[Redis] Client connected to ${host}:${port}`);
  }
}
