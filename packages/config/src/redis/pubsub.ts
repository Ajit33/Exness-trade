import { RedisClientType } from 'redis';
import client from './client';

export const publisher = client.duplicate() as RedisClientType;
publisher.on('error', (err) => console.error('[Redis Publisher] Error:', err));