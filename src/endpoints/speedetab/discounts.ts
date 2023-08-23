import speedetabApiRequest from 'src/apis/speedetab'

interface PromoCodeParams {
  promoCode: string
}

interface GiftCardParams {
  giftCard: string
  pin: string
}

interface OtherDiscountsParams {
  otherDiscounts: string
}

export const speedetabAddPromoCode = ({ promoCode }: PromoCodeParams) =>
  speedetabApiRequest({
    method: 'POST',
    endpoint: '/users/v1/orders/promotion_code',
    data: {
      promotion_code: {
        code: promoCode,
      },
    },
  })

  export const speedetabAddOtherDiscounts = ({ otherDiscounts }: OtherDiscountsParams) =>
  speedetabApiRequest({
    method: 'POST',
    endpoint: '/users/v1/orders/other_discounts',
    data: {
      other_discounts: {
        code: otherDiscounts,
      },
    },
  })

export const speedetabAddGiftCard = ({ giftCard, pin }: GiftCardParams) =>
  speedetabApiRequest({
    method: 'POST',
    endpoint: '/users/v1/orders/giftcard_code',
    data: {
      giftcard_code: {
        code: giftCard,
        pin: pin,
      },
    },
  })

export const speedetabRemovePromoCode = () =>
  speedetabApiRequest({
    method: 'DELETE',
    endpoint: '/users/v1/orders/promotion_code',
  })

export const speedetabRemoveGiftCard = () =>
  speedetabApiRequest({
    method: 'DELETE',
    endpoint: '/users/v1/orders/giftcard_code',
  })

  export const speedetabRemoveOtherDiscounts = () =>
  speedetabApiRequest({
    method: 'DELETE',
    endpoint: '/users/v1/orders/other_discoints',
  })

export const speedetabGetPromoCode = () =>
  speedetabApiRequest({
    method: 'GET',
    endpoint: '/users/v1/orders/promotion_code',
  })

export const speedetabGetGiftCard = () =>
  speedetabApiRequest({
    method: 'GET',
    endpoint: '/users/v1/orders/promotion_code',
  })

  export const speedetabGetOtherDiscounts = () =>
  speedetabApiRequest({
    method: 'GET',
    endpoint: '/users/v1/orders/other_discoints',
  })

interface DiscountParams {
  discount: number
}

export const speedetabAddDiscount = ({ discount }: DiscountParams) =>
  speedetabApiRequest({
    method: 'POST',
    endpoint: '/users/v1/orders/discount',
    data: {
      discount: {
        amount: discount,
      },
    },
  })

export const speedetabRemoveDiscount = () =>
  speedetabApiRequest({
    method: 'DELETE',
    endpoint: '/users/v1/orders/discount',
  })
