export type OrderSide = 'BUY' | 'SELL';
export type OrderStatus = 'OPEN' | 'FILLED' | 'CANCELLED';

export interface Order {
  id: number;
  symbol: string;
  side: OrderSide;
  price: number;
  quantity: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderInput {
  symbol: string;
  side: OrderSide;
  price: number;
  quantity: number;
}