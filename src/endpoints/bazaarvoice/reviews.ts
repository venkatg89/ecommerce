import bazaarVoiceApiRequest from 'src/apis/bazaarVoice'
import config from 'config'

import { SubmitReviewDetailsModel, TagModel } from 'src/models/PdpModel'

const PASS_KEY = config.api.bazaarvoice.bazaarvoiceApiKey
const LIMIT = config.api.bazaarvoice.bazaarvoiceLimit
const API_VERSION = config.api.bazaarvoice.bazaarvoiceVersion

export const getReviews = (ean) =>
  bazaarVoiceApiRequest({
    method: 'GET',
    endpoint: '/reviews.json',
    params: {
      ApiVersion: API_VERSION,
      Passkey: PASS_KEY,
      Filter: `ProductId:${ean}`,
      Include: 'Products',
      Stats: 'Reviews',
      Limit: LIMIT,
    },
  })

export const submitReviews = (params) =>
  bazaarVoiceApiRequest({
    method: 'POST',
    endpoint: '/submitreview.json',
    params: {
      ApiVersion: API_VERSION,
      Passkey: PASS_KEY,
      ...params,
    },
  })

export const submitReviewDetailsNormalizer = (
  data,
): SubmitReviewDetailsModel => {
  try {
    const keys = Object.keys(data)
    const tagKeys = keys.filter((item) => item.includes('tagid_BookTags'))
    const tags: TagModel[] = []
    for (let i = 0; i < tagKeys.length; i++) {
      tags.push({ name: data[tagKeys[i]].Label, id: data[tagKeys[i]].Id })
    }
    const readers = data.contextdatavalue_ReaderType.Options
    const readerTypes = readers.map((reader) => {
      if (reader.Label.length !== 0)
        return {
          label: reader.Label,
          value: reader.Value,
          selected: reader.Selected,
        }
    })

    return {
      tags: tags,
      readerTypes: readerTypes,
    }
  } catch (e) {
    return {
      tags: [],
      readerTypes: [],
    }
  }
}
