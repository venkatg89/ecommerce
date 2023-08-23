import nodeJsApiRequest from 'src/apis/nodeJs'

interface SubmitOrderParams {
  sessionToken: string
  paymentToken: string
  atgUid: string
}

export const submitOrder = ({
  sessionToken,
  paymentToken,
  atgUid,
}: SubmitOrderParams) =>
  nodeJsApiRequest({
    method: 'POST',
    endpoint: '/v1/cafe/order',
    data: {
      sessionToken,
      paymentToken,
      atgUid,
    },
  })
