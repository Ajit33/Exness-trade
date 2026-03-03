import { createClient } from "redis";

export const publisher = createClient({
  url: "redis://localhost:6379"
});

export const queueClient = createClient({
  url: "redis://localhost:6379"
});

export async function connectRedis() {
  await publisher.connect();
  await queueClient.connect();
  console.log("Redis connected");
}