export type CandleInterval =
  | '1m'
  | '3m'
  | '5m'
  | '15m'
  | '30m'
  | '1h'
  | '2h'
  | '4h'
  | '6h'
  | '8h'
  | '12h'
  | '1d'
  | '3d'
  | '1w'
  | '1M';

export interface Candle {
  id: number;
  symbol: string;      // e.g. 'BTCUSDT', 'AAPL'
  interval: CandleInterval;

  open: number;        // opening price
  high: number;        // highest price
  low: number;         // lowest price
  close: number;       // closing price

  volume: number;      // traded volume

  timestamp: number;   // Unix timestamp (ms)
}