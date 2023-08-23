export enum SKU_TYPES {
  BOOK = 'book',
  MUSIC = 'music',
  MOVIE = 'movie',
  DEVICE = 'device',
  MAGAZINE = 'magazine',
  GIFT_CARD = 'giftCard',
  OTHER_NON_DIGITAL = 'otherNonDigital',
  TEXTBOOK = 'textbook',
  E_MAGAZINE = 'eMagazine',
  E_GIFT_CARDS = 'eGiftCards',
  E_TEXTBOOK = 'eTextbook',
  E_BOOK = 'eBook',
  AUDIO_BOOK = 'Audiobook',
  MEMBERSHIP = 'membership',
  NOOK_APP = 'nookApp',
  DIGITAL_VIDEO = 'digitalVideo',
  WARRANTY = 'Warranty',
  CA_RECYCLYING_FEE = 'caRecyclingFee',
  GIFT_WRAP = 'giftWrap',
  DEFAULT = '',
}

export const isDigital = (skuType: string) => {
  const digitalSkuTypes = [
    SKU_TYPES.E_BOOK,
    SKU_TYPES.E_GIFT_CARDS,
    SKU_TYPES.E_MAGAZINE,
    SKU_TYPES.E_TEXTBOOK,
    SKU_TYPES.MEMBERSHIP,
    SKU_TYPES.DIGITAL_VIDEO,
    SKU_TYPES.AUDIO_BOOK,
    SKU_TYPES.NOOK_APP,
  ]

  return digitalSkuTypes.find((item) => item === skuType) !== undefined
}
