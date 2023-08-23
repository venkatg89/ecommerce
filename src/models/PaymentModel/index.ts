export interface PaymentCard {
  id: string;
  token: string;
  lastFourDigits: string;
  expiryDate: string;
  nickname: string;
  type: string;
}
