import { speedetabPaymentApiRequest, spreedlyApiRequest } from 'src/apis/speedetab'

import { paymentCardNormalizer } from 'src/helpers/api/cafe/paymentCardNormalizer'

export const getSpreedlyEnvironmentKey = () => speedetabPaymentApiRequest({
  method: 'GET',
  endpoint: '/config',
})

export const getPaymentCards = () => speedetabPaymentApiRequest({
  method: 'GET',
  endpoint: '/cards',
})

interface DeletePaymentCardParams {
  cardId: string;
}

export const speedetabDeletePaymentCard = ({ cardId }: DeletePaymentCardParams) => speedetabPaymentApiRequest({
  method: 'DELETE',
  endpoint: `/cards/${cardId}`,
})

export const normalizeGetPaymentCardsResponseData = (data: any) => {
  const { cards } = data.data

  return cards.reduce((object, card) => {
    object[card.uuid] = paymentCardNormalizer(card) // eslint-disable-line
    return object
  }, {})
}

interface AddPaymentCardParams {
  nickname: string;
  token: string;
}

export const addPaymentCard = ({ nickname, token }: AddPaymentCardParams) => speedetabPaymentApiRequest({
  method: 'POST',
  endpoint: '/cards',
  data: {
    card: {
      display_name: nickname,
      token,
    },
  },
})

interface TokenizePaymentCardParams {
  environmentKey: string;
  email: string;
  name: string;
  cardNumber: string;
  cardCvc: string;
  month: string;
  year: string;
}

export const tokenizePaymentCard = ({
  environmentKey, email, name, cardNumber, cardCvc, month, year,
}: TokenizePaymentCardParams) => spreedlyApiRequest({
  method: 'POST',
  endpoint: '/v1/payment_methods.json',
  data: {
    payment_method: {
      credit_card: {
        email,
        full_name: name,
        number: cardNumber,
        verification_value: cardCvc,
        month,
        year,
      },
    },
  },
  params: {
    environment_key: environmentKey,
  },
})
