import config from 'config'

import { asEan, BookOrEan, BookModel } from 'src/models/BookModel'
import { WebRoutes } from 'src/helpers/navigationService'

export const noImageUrl =
  'https://prodimage.images-bn.com/mimages/0000000000000_s550x406.jpg.jpg'

export type BookImageQuality = 'thumb' | 'normal' | 'best'

export const thumbImageSuffix = '_s192x300.jpg' // smaller image always
export const normalImageSuffix = '_s550x406.jpg' // almost best image. aspect of book output is usually 1/1.7.
export const bestImageSuffix = '_s1200x630.jpg' // best image. aspect of book output is usually 1/1.7.

const eanRegEx = new RegExp('^\\d+$')
const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0)

export const makeBookImageURL = (
  eanOrBook: BookOrEan | null | undefined,
  quality: BookImageQuality = 'normal',
) => {
  // Sometimes eanOrBook it comes as an empty object
  // and the app crushes on ```.trim()```
  if (!isEmpty(eanOrBook)) {
    const ean = asEan(eanOrBook!).trim()
    if (eanRegEx.test(ean)) {
      let url = config.api.atgGateway.prodImageUrl.replace('<ean>', ean)
      switch (quality) {
        case 'thumb':
          url += thumbImageSuffix
          break
        case 'normal':
          url += normalImageSuffix
          break
        case 'best':
          url += bestImageSuffix
          break
        default:
          url += thumbImageSuffix
          break
      }
      return url
    }
  }
  return noImageUrl
}

// make a product URL, but just leave the host out eg: '/b/9781234569/'
export const makeProductURLShort = (book: BookModel) => {
  const replaceObj = {
    '<WORK_ID>': (book.workId || '').toString(),
    '<EAN>': book.ean,
  }
  const mapRegex = new RegExp(Object.keys(replaceObj).join('|'), 'gi')
  const productUrl = WebRoutes.PRODUCT_URL.replace(
    mapRegex,
    (matched) => replaceObj[matched],
  )
  return productUrl
}

// make a product URL and return as a full url eg: 'https://www.bn.com/b/9781234569/'
const bnBaseURLForProductLinks = 'https://www.barnesandnoble.com'
export const makeProductURLFull = (book: BookModel) =>
  bnBaseURLForProductLinks + makeProductURLShort(book)

const bnStoreBaseURLForEventLinks = 'https://stores.barnesandnoble.com/event/'
export const makeEventURLFull = (eventId: string) =>
  bnStoreBaseURLForEventLinks + eventId
