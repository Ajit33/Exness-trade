import { OrderSide } from './order';

export interface Trade {
  id: number
  userId: number
  orderId: number    
  symbol: string  
  side: OrderSide         
  price: number     
  quantity: number       
  pnl: number      
  createdAt: Date    
}

export interface CreateTradeInput{
    userId:number
    symbol:string
    side: OrderSide
    quantity: number
    price:number,
    orderId: number,
    pnl: number
}