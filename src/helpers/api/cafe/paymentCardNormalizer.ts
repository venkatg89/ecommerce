import { PaymentCard } from 'src/models/PaymentModel'

export const paymentCardNormalizer = (data: any): PaymentCard => ({
  id: data.uuid,
  token: data.token,
  lastFourDigits: data.last_four,
  expiryDate: data.expiration_date,
  nickname: data.display_name,
  type: data.card_type,
})
