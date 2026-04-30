export interface BinanceTicker {
  e: string;   // event type
  E: number;   // event time
  s: string;   // symbol e.g BTCUSDT
  P: string;   // price change percent
  c: string;   // current price
  h: string;   // high price
  l: string;   // low price
  v: string;   // volume
}

export interface PriceUpdate {
  symbol: string;
  price: string;
  high: string;
  low: string;
  volume: string;
  change: string;
  timestamp: number;
}