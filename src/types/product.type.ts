export interface IProduct {
    id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    deliveryCharge: number;
    brand: string | null; 
    warrenty: string;  
    images: string[];
    category_name: string;
    date: Date;
    isFeatured: boolean;
    createdAt: Date;
    userId: string;
  }

  export type TResponseProduct<T = unknown> = IProduct & T;