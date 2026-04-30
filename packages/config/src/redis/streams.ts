import { RedisClientType } from 'redis';
import client from './client';

export const enginePusher = client.duplicate() as RedisClientType;
enginePusher.on('error', (err) => console.error('[Redis Stream] Error:', err));