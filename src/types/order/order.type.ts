import { CreateorderData } from "@/validations/order.validation";
import z from "zod";


export interface IOrderItem {
  productId: string;
  price: number;
  quantity: number;
}

// create orderdata type
export type ICreateorderData=z.infer<typeof CreateorderData>

// get own order data
export interface IGetOrderData {
  id: string;
  buyerId: string;
  sellerId: string;
  first_name: string;
  last_name: string;
  status: string;
  totalPrice: number;
  phone: string;
  address: string;
  createdAt: string;
  paymentStatus:string;
  updatedAt: string;
  orderitem: {
    id:string,
    productId:string,
    orderId:string,
    price:number,
    quantity:number,
    createdAt:string,
    updatedAt:string
  }[];

}


export type TResponseOrderData<T = unknown> = IGetOrderData & T;