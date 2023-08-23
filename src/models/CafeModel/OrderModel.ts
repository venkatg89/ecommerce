import { AddOrderToCart } from 'src/models/CafeModel/CartModel'

export interface CafeRecentOrder {
  id: string;
  subtotalAmount: number;
  taxAmount: number;
  totalAmount: number;
  discountAmount: number;
  items: AddOrderToCart[];
  orderStatus: string;
  venueId: string;
  imageUrl: string;
  dateCreated: string;
  dateFulfilled: string;
}

export interface CafeCurrentOrder {
  id: string;
  totalAmount: number;
  orderStatus: string;
  venueId: string;
  pickupCode?: string;
  date: string;
}

export enum CafeOrderStatus {
  AUTHORIZATION = 'pending_authorization',
  PAYMENT = 'pending_payment',
  APPROVAL = 'pending_approval',
  PREPARATION = 'pending_preparation',
  DELIVERY = 'pending_delivery',
}
