import { ContributorsModel, ProductDetailsModel } from 'src/models/PdpModel'
import { productTypes } from 'src/strings/pdpTypes'
import { rankParser } from 'src/helpers/strings'

export const productDetailsHelper = (
  productDetails: ProductDetailsModel | null,
  salesRank: string,
  productType?: string,
) => {
  if (productDetails && productType) {
    if (productType.toLowerCase().includes(productTypes.BOOK)) {
      return [
        {
          fieldName: 'ISBN-13',
          content: productDetails.isbn,
        },
        {
          fieldName: 'Publisher',
          content: productDetails.publisher,
        },
        {
          fieldName: 'Publication Date',
          content: productDetails.publicationDate,
        },
        {
          fieldName: 'Series',
          content: productDetails.series,
        },
        {
          fieldName: 'Edition description',
          content: productDetails.editionDescription,
        },
        {
          fieldName: 'Pages',
          content: productDetails.pages,
        },
        {
          fieldName: 'Sales rank',
          content: rankParser(salesRank),
        },
        {
          fieldName: 'Product dimensions',
          content: productDetails.productDimensions,
        },
        {
          fieldName: 'Age Range',
          content: productDetails.ageRange,
        },
      ]
    }
    if (productType === productTypes.MUSIC) {
      return [
        {
          fieldName: 'Release Date',
          content: productDetails.publicationDate,
        },
        {
          fieldName: 'Label',
          content: productDetails.publisher,
        },
        {
          fieldName: 'UPC',
          content: productDetails.isbn,
        },
        {
          fieldName: 'Catalog Number',
          content: productDetails.catalogNumber,
        },
        {
          fieldName: 'Rank',
          content: salesRank,
        },
      ]
    }
    if (productType === productTypes.MOVIE) {
      return [
        {
          fieldName: 'Release Date',
          content: productDetails.publicationDate,
        },
        {
          fieldName: 'UPC',
          content: productDetails.isbn,
        },
        {
          fieldName: 'Original Release',
          content: productDetails.originalRelease,
        },
        {
          fieldName: 'Rating',
          content: productDetails.contentRating,
        },
        {
          fieldName: 'Source',
          content: productDetails.publisher,
        },
        {
          fieldName: 'Sales rank',
          content: rankParser(salesRank),
        },
      ]
    }
    if (productType === productTypes.OTHER_NON_DIGITAL) {
      return [
        {
          fieldName: 'UPC',
          content: productDetails.isbn,
        },
        {
          fieldName: 'Manufacturer',
          content: productDetails.publisher,
        },
        {
          fieldName: 'Publication Date',
          content: productDetails.publicationDate,
        },

        {
          fieldName: 'Age Range',
          content: productDetails.ageRange,
        },
      ]
    }
  } else {
    return null
  }
}

export const contributorsHelper = (
  contributors: ContributorsModel | null,
  productType?: string,
) => {
  if (productType) {
    if (productType === productTypes.MOVIE) {
      return [
        {
          title: 'Director',
          data: contributors?.production,
        },
        {
          title: 'Cast',
          data: contributors?.performance,
        },
      ]
    }
    if (productType === productTypes.MUSIC) {
      return contributors?.performance
    }
  } else {
    return []
  }
}
