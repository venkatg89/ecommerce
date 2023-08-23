import atgApiRequest from 'src/apis/atgGateway'

import { Ean } from 'src/models/BookModel'
import { BookFormat } from 'src/models/PdpModel'

export const getBookAvailableFomats = (ean: Ean) =>
  atgApiRequest({
    method: 'GET',
    endpoint: '/product-details/getAllFormatsAndEditions',
    params: { ean },
  })

export const normalizeBookAvailableFormatsResponseData = (
  data: any,
): [BookFormat] => {
  const {
    availableFormats,
    sortedFormatPriorityOrder,
  } = data.response?.formatAndEditions
  const formats = sortedFormatPriorityOrder.map(
    (format) => availableFormats[format],
  )
  return formats
}
