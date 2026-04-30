import { BinanceTicker, PriceUpdate } from './types';

const SYMBOLS = ['btcusdt', 'ethusdt'];
const STREAMS = SYMBOLS.map(s => `${s}@ticker`).join('/');
const WS_URL = `wss://stream.binance.com:9443/stream?streams=${STREAMS}`;

export function connectBinance(
  onPrice: (update: PriceUpdate) => void
): void {
  const ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    console.log('[Binance] Connected');
  };

  ws.onmessage = (event) => {
    const raw = JSON.parse(event.data);
    const ticker: BinanceTicker = raw.data;

    if (!ticker || !ticker.c) return;

    onPrice({
      symbol: ticker.s,
      price: ticker.c,
      high: ticker.h,
      low: ticker.l,
      volume: ticker.v,
      change: ticker.P,
      timestamp: Date.now(),
    });
  };

  ws.onclose = () => {
    console.log('[Binance] Disconnected — reconnecting in 5s...');
    setTimeout(() => connectBinance(onPrice), 5000);
  };

  ws.onerror = (err) => {
    console.error('[Binance] Error:', err);
  };
}