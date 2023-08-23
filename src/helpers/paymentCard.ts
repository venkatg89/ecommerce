import { ImageSourcePropType } from 'react-native'

import { cards } from 'assets/images'

export const paymentCardIconParser = (type: string): ImageSourcePropType => {
  switch (type) {
    case 'master':
      return cards.mastercard
    case 'VI':
    case 'Visa':
    case 'visa':
      return cards.visa
    case 'american_express':
      return cards.amex
    case 'discover':
      return cards.discover

    default:
      return cards.default
  }
}

export const paymentCardType = (type: string): string => {
  switch (type) {
    case 'master':
      return 'Mastercard'
    case 'VI':
    case 'Visa':
    case 'visa':
      return 'Visa'
    case 'american_express':
      return 'American Express'
    case 'discover':
      return 'Discover'

    default:
      return 'Card'
  }
}

// to be used when card is not saved for later use
export const paymentCardNetwork = (number: string): string => {
  // visa
  let re = new RegExp('^4')
  if (number.match(re) != null) {
    return 'visa'
  }

  // Mastercard
  if (
    /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(
      number,
    )
  ) {
    return 'master'
  }

  // AMEX
  re = new RegExp('^3[47]')
  if (number.match(re) != null) {
    return 'american_express'
  }

  // Discover
  re = new RegExp(
    '^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)',
  )
  if (number.match(re) != null) {
    return 'discover'
  }
  return 'card'
}
