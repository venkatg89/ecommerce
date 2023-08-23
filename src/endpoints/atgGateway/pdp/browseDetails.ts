import atgApiRequest from 'src/apis/atgGateway'
import { ContributorsModel } from 'src/models/BookModel'

export const getBrowseDetails = (url: string) =>
  atgApiRequest({
    method: 'GET',
    endpoint: '/browse/getBrowseDetails',
    params: {
      url,
      clientId: 'bnappp',
    },
  })

export type PromotionBookModel = {
  ean: string
  name: string
  cardTitle: string
  authors: ContributorsModel
  skuType: string
  averageRating: number
  description: string
}
export interface BrowseDetails {
  authorImage: string
  description: string
  promotionBook: PromotionBookModel
  bestsellersEans: string[]
  allEans: string[]
}

const extractRecordsByType = (type: string, browseDetails: any) => {
  return browseDetails.type === type && browseDetails.records.length > 0
    ? browseDetails.records.map((book) => book.attributes.commonId)
    : []
}

export const normalizeBrowseDetailsToModelArray = (browseDetails: any) => {
  const primaryMainContent = browseDetails?.primaryMainContent || []
  // will be replaced with data from BE
  let response: BrowseDetails = {
    authorImage: '',
    description: '',
    promotionBook: {
      ean: '',
      name: '',
      cardTitle: '',
      authors: {
        directors: [],
        cast: [],
        contributors: [{ name: '', url: '' }],
      },
      skuType: '',
      averageRating: 0,
      description: '',
    },
    bestsellersEans: [],
    allEans: [],
  }

  primaryMainContent.map((content) => {
    response = {
      ...response,
      bestsellersEans: [
        ...response.bestsellersEans,
        ...extractRecordsByType('RecordSpotlight', content),
      ],
      allEans: [
        ...response.allEans,
        ...extractRecordsByType('ResultsList', content),
      ],
    }
  })
  return response
}
