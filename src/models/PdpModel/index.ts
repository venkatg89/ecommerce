import { Ean } from 'src/models/BookModel'

export type BookDescription = string

export interface BookFormat {
  ean: string
  salePrice: string
  format: string
}

export interface BookOverview {
  overview: string
  booksellerContent: string | null
  editorialReviews: string
}

export interface BookDetails {
  ean: string
  description: BookOverview
  // categoryIds: string[]; TODO
  availableFormats: BookFormat[]
  bookTabs: TabsDataModel
  salesRank: string
}

export interface ProductDetailsModel {
  isbn: string
  publisher: string
  publicationDate: string
  series: string | null
  editionDescription: string | null
  pages: number | null
  productDimensions: string | null
  catalogNumber: string | null
  originalRelease: string | null
  ageRange: string | null
  contentRating: string | null
}

interface Contributor {
  name: string
  role?: string
}

export interface ContributorsModel {
  production?: [Contributor]
  performance: [Contributor]
}

export interface TabsDataModel {
  productDetails: ProductDetailsModel | null
  tracks: [string] | null
  contributors: ContributorsModel | null
  tableOfContents: string | null
}
export interface BookRecommendedProduct {
  ean: Ean
  imageUrl: string
}

export type ReviewsStateModel = {
  ratings: number
  reviewsCount: number
  reviewsResults: any[]
  reviewStatistics: any[]
  recommend: number
  submitReviewDetails: SubmitReviewDetailsModel
}

export interface TagModel {
  id: string
  name: string
}

export interface ReaderTypeModel {
  label: string
  value: string
  selected: boolean
}

export interface SubmitReviewDetailsModel {
  tags: TagModel[]
  readerTypes: ReaderTypeModel[]
}
