import atgApiRequest from 'src/apis/atgGateway'
import { productTypes, contributorsMovieTypes } from 'src/strings/pdpTypes'
import { Ean, BookModel, AvailabilityStatus } from 'src/models/BookModel'

const EMPTY_ARRAY = []

export const getBooksDetails = (eans: Ean[]) =>
  atgApiRequest({
    method: 'GET',
    endpoint: '/product-details/getProductDetails',
    params: { eanList: eans.join(',') },
  })

const filterMovieContributors = (bookDetails, role) => {
  return bookDetails.skuType === productTypes.MOVIE && bookDetails.contributors
    ? bookDetails.contributors
        .filter(
          (contributor) =>
            typeof contributor.role === 'string' &&
            contributor.role.toLowerCase() === role,
        )
        .map((contributor) => ({
          name: contributor.name,
          url: contributor.url,
        }))
    : []
}

const extractAuthors = (bookDetails) => {
  return bookDetails.skuType !== productTypes.MOVIE && bookDetails.contributors
    ? bookDetails.contributors.map((contributor) => ({
        name: contributor.name,
        url: contributor.url,
      }))
    : []
}

const extractContributors = (bookDetails) => ({
  directors: filterMovieContributors(
    bookDetails,
    contributorsMovieTypes.DIRECTOR,
  ),
  cast: filterMovieContributors(bookDetails, contributorsMovieTypes.CAST),
  contributors: extractAuthors(bookDetails),
})

export const getAvailabilityStatus = (status: number): AvailabilityStatus => {
  switch (status) {
    case 1000:
      return 'inStock'
    case 1001:
      return 'outOfStock'
    case 1002:
      return 'preorder'
    case 1003:
      return 'backorder'
    default:
      return 'outOfStock'
  }
}

const normalizeAtgBookDetailsToBookModel = (bookDetails): BookModel => ({
  ean: bookDetails.eanChar,
  workId: bookDetails.workId,
  name: bookDetails.displayName,
  authors: extractContributors(bookDetails),
  publisher: bookDetails.publisher,
  type: bookDetails.skyType,
  skuType: bookDetails?.skuType,
  imageList: bookDetails.imageUrlList,
  listPrice: bookDetails.listPrice,
  salePrice: bookDetails.salePrice,
  percentageSave: bookDetails.percentageSave,
  availabilityStatus: getAvailabilityStatus(bookDetails.availabilityStatus),
  averageRating: bookDetails.averageRating,
  reviewCount: bookDetails.reviewCount,
  parentFormat: bookDetails.parentFormat,
  webReaderUrl: bookDetails.webReaderUrl,
})

export const extractProductDetails = (data: any): any[] => {
  if (!data || !data.response || !data.response.productDetails) {
    return EMPTY_ARRAY
  }
  if (!Array.isArray(data.response.productDetails)) {
    return EMPTY_ARRAY
  }
  return data.response.productDetails
}

export const normalizeAtgBookDetailsToBookModelObject = (data: any) =>
  extractProductDetails(data).reduce((object, book) => {
    object[book.eanChar] = normalizeAtgBookDetailsToBookModel(book) // eslint-disable-line
    return object
  }, {})

export const normalizeAtgBookDetailsToBookModelArray = (data: any) =>
  extractProductDetails(data).map((e) => normalizeAtgBookDetailsToBookModel(e))
