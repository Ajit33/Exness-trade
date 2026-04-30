import 'dotenv/config';
import { publisher, enginePusher } from '@exness/config/src/redis';
import { connectBinance } from './binance';
import { PriceUpdate } from './types';

let latestPrices: Record<string, PriceUpdate> = {};
let redisReady = false;

async function main() {
  // connect redis
  try {
    await Promise.all([
      publisher.connect(),
      enginePusher.connect(),
    ]);
    redisReady = true;
    console.log('[Redis] All clients connected');
  } catch (err) {
    console.error('[Redis] Failed to connect:', err);
    process.exit(1);
  }

  // connect binance
  connectBinance((update: PriceUpdate) => {
    latestPrices[update.symbol] = update;
  });

  // push to redis every 100ms
  setInterval(async () => {
    if (!redisReady || Object.keys(latestPrices).length === 0) return;

    const payload = JSON.stringify(latestPrices);

    try {
      await publisher.publish('live:prices', payload);

      await enginePusher.xAdd('stream:prices', '*', {
        data: payload,
        timestamp: Date.now().toString(),
      });

    } catch (err) {
      console.error('[Redis] Push error:', err);
    }
  }, 100);
}

main();