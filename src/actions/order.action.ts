'use server'
export interface IOrderUpdateStatus {
  status: string;
}
import { OrderService } from "@/services/order.service";
import { ICreateorderData } from "@/types/order/order.type";
import { revalidateTag } from "next/cache";

export const getownorder = async (params:any) => {
  const res = await OrderService.getownorder(params);
  return res;
};

export const updateorderstatus = async (id:string,data:IOrderUpdateStatus) => {
  const res = await OrderService.updateOrderStatus(id,data);
  revalidateTag("order",'max');
  return res;
};

export const CreateOrder = async (payload:ICreateorderData) => {
  const res = await OrderService.createorder(payload);
  revalidateTag("order",'max');
  return res;
};


export const getsingleorder=async(params?:any)=>{
  const res= await OrderService.getorderbyid(params)
  return res
  
}

export const getOwnPaymentActions = async (id:string,paymentId:any) => {
  const response = await OrderService.getOwnPayment(id,paymentId);
  return response;
};

export const getAllOrders = async (params?: any) => {
  const res = await OrderService.getAllOrders(params);
  return res;
};

export const deleteOrder = async (id: string) => {
  const res = await OrderService.deleteOrder(id);
  revalidateTag("order", "max");
  return res;
};