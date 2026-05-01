export interface Balance{
     id: number;
     userId: number;
     asset: string;
     available:number;
     locked:number;
     updatedAt:Date 
}
export interface CreateBalanceInput{
     userId:number,
     asset:string,
     available:number
}