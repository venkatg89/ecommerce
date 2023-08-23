import atgApiRequest from 'src/apis/atgGateway'

import { Ean } from 'src/models/BookModel'
import { BookOverview } from 'src/models/PdpModel'
import {
  ProductDetailsModel,
  TabsDataModel,
  ContributorsModel,
} from 'src/models/PdpModel'

export const getBookDescription = (ean: Ean) =>
  atgApiRequest({
    method: 'GET',
    endpoint: '/product-details/getProductTabInformation',
    params: { ean },
  })

export const normalizeBookDescriptionResponseData = (
  data: any,
): BookOverview => {
  try {
    const booksellerContent = data.response.productTabDetails.booksellerContent
    const editorialReviews = data.response.productTabDetails.EditorialReviews
    const overview = data.response.productTabDetails.Overview
    return {
      overview: overview,
      booksellerContent: booksellerContent || null,
      editorialReviews: editorialReviews,
    }
  } catch (e) {
    return {
      overview: '',
      booksellerContent: '',
      editorialReviews: '',
    }
  }
}

const normalizeProductDetails = (productDetails): ProductDetailsModel => {
  return {
    isbn: productDetails.isbn13,
    publisher: productDetails.publisher,
    publicationDate: productDetails.releaseDate,
    series: productDetails.seriesTitle,
    editionDescription: productDetails.edition,
    pages: productDetails.numberOfPages,
    productDimensions:
      productDetails.width && productDetails.height && productDetails.depth
        ? productDetails.width +
          '(w) x ' +
          productDetails.height +
          '(h) x ' +
          productDetails.depth +
          '(d)'
        : null,
    catalogNumber: productDetails.catalogNumber,
    originalRelease: productDetails.originalRelease,
    ageRange: productDetails.ageFrom,
    contentRating: productDetails.contentRating,
  }
}

const normalizeTracks = (tracks): [string] | null => {
  if (tracks) {
    return tracks.map((item) => {
      return item.trackTitle
    })
  } else {
    return null
  }
}

const normalizeContributors = (contributors): ContributorsModel | null => {
  if (
    contributors.contributorJobType &&
    contributors.contributorJobType.Performance
  ) {
    return {
      production: contributors.contributorJobType.Production?.filter(
        (item) => item.role === 'Director',
      ).map((item) => {
        return { name: item.name }
      }),
      performance: contributors.contributorJobType.Performance?.map((item) => {
        return { name: item.name, role: item.role }
      }),
    }
  } else {
    return null
  }
}

export const normalizeTabsInfoResponseData = (data: any): TabsDataModel => {
  try {
    const productDetails = normalizeProductDetails(
      data.response.productTabDetails.productDetails,
    )
    const tracks = normalizeTracks(data.response.productTabDetails.tracks)
    const contributors = normalizeContributors(
      data.response.productTabDetails.contributors,
    )
    const tableOfContents = data.response.productTabDetails.TOC

    return {
      productDetails: productDetails,
      tracks: tracks,
      contributors: contributors,
      tableOfContents: tableOfContents ? tableOfContents : null,
    }
  } catch (e) {
    return {
      productDetails: null,
      tracks: null,
      contributors: null,
      tableOfContents: null,
    }
  }
}
