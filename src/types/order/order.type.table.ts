export type OrderStatus =
  | "PLACED"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "CANCELLED";
export type MealType = {
  id: string;
  title: string;
  category_name: string;
  price: number;
  image: string;
};

export type OrderItemType = {
  id: string;
  productId: string;
  orderId: string;
  quantity: number;
  price: number;
  meal: MealType;
};

export type OrderType = {
  id: string;
  sellerId: string;
  buyerId: string;
  address: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string; // API থেকে string আসবে
  updatedAt: string;
  order: OrderItemType[];
};