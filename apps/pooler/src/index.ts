import WebSocket from "ws";
import { connectRedis, publisher, queueClient } from "./utils/redis";

const SYMBOL = "BTCUSDT";

async function start() {
  await connectRedis();

  const ws = new WebSocket(
    "wss://stream.binance.com:9443/ws/btcusdt@trade"
  );

  ws.on("message", async (data) => {
    const trade = JSON.parse(data.toString());

    const formattedTrade = {
      symbol: SYMBOL,
      price: Math.round(parseFloat(trade.p) * 1e8), // integer storage
      quantity: Math.round(parseFloat(trade.q) * 1e8),
      trade_time: new Date(trade.T).toISOString()
    };

    // 1️⃣ Push into Redis Queue (for DB storage later)
    await queueClient.lPush("trades_queue", JSON.stringify(formattedTrade));

    // 2️⃣ Publish to Redis channel (real-time broadcast)
    await publisher.publish(
      "trades_channel",
      JSON.stringify(formattedTrade)
    );
  });
}

start();