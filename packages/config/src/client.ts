import { createClient, RedisClientType } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const client: RedisClientType = createClient({
  url: redisUrl,
  socket: {
    reconnectStrategy(retries) {
      return Math.min(retries * 500, 3000);
    }
  }
}) as RedisClientType;

client.on('error', (err) => console.error('[Redis] Error:', err));

export type RedisClient = RedisClientType;
export default client;