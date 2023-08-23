import { ResultModel } from 'src/models/SearchModel'

export interface HomeDetailsModel {
  results: (
    | HomeCardTypeOneModel
    | HomeCardTypeTwoModel
    | HomeCardTypeThreeModel
    | HomeCardTypeFourModel
    | HomeCardTypeFiveModel
    | HomeCardTypeSixModel
    | HomeCardTypeSevenModel
    | HomeCardTypeEightnModel
    | HomeCardTypeNineModel
    | HomeCardTypeTenModel
    | HomeCardCQ
    | HomeCardTypeElevenModel
    | HomeCardTypeTwelveModel
  )[]
}

export interface HomeCardCQ {
  type: 'CQType'
  name: string
  imageSource: string
}

export interface HomeCardTypeOneModel {
  type: 'TypeOne'
  name: string
  items: HomeCardTypeOneItemModel[]
}

export interface HomeCardTypeOneItemModel {
  name: string
  description?: string
  imageSource: string
  url: string
}

export interface HomeCardTypeTwoModel {
  type: 'TypeTwo'
  name: string
  seeAllBrowseUrl: string | null
  items: HomeCardTypeTwoItemModel[]
  showFeatured?: boolean
}

export interface HomeCardTypeTwoItemModel {
  ean: string
}

export interface HomeCardTypeThreeModel {
  type: 'TypeThree'
  name: string
  title: string
  contributor: string
  averageRating?: number
  description: string
  ean: string
}

export interface HomeCardTypeFourModel {
  type: 'TypeFour'
  contents: HomeCardTypeFourContentModel[]
  title?: string
}

export interface HomeCardTypeFourContentModel {
  name: string
  items: HomeCardTypeFourItemModel[]
  url?: string
}

export interface HomeCardTypeFourItemModel {
  ean: string
  title?: string
  contributor?: string
}

export interface HomeCardTypeFiveModel {
  type: 'TypeFive'
  name: string
  title: string
  contributor: string
  averageRating?: number
  description: string
  ean: string
  format?: string
  listPrice?: number
  originalPrice?: number
  percentageSaveText?: string
}

export interface HomeCardTypeSixItemModel {
  ean: string
}

export interface HomeCardTypeSixModel {
  type: 'TypeSix'
  name: string
  subtitle: string
  description: string
  seeAllText: string
  seeAllBrowseUrl: string | null
  items: HomeCardTypeSixItemModel[]
}

export interface HomeCardTypeSevenModel {
  type: 'TypeSeven'
  name: string
  items: HomeCardTypeSevenItemModel[]
}

export interface HomeCardTypeSevenItemModel {
  text: string
  imageUrl: string
  seeAllBrowseUrl: string
  sublinks?: HomeCardTypeEightSublinkModel[]
}
export interface HomeCardTypeEightSublinkModel {
  text: string
  url: string
}

export interface HomeCardTypeEightnModel {
  type: 'TypeEight'
  name: string
  items: HomeCardTypeSevenItemModel[]
}

export interface FilteredBrowseContent {
  type: string
  results: ResultModel[]
}

export interface HomeCardTypeNineModel {
  type: 'TypeNine'
  name: string
  items: HomeCardTypeNineItemModel[]
  seeAllLinkUrl?: string | null
}

export interface HomeCardTypeNineItemModel {
  ean: string
}

export interface HomeCardTypeTenModel {
  type: 'TypeTen'
  name: string
  seeAllBrowseUrl: string | null
  items: HomeCardTypeTenItemModel[]
  backgroundColor: string
  description: string
}

export interface HomeCardTypeTenItemModel {
  ean: string
}

export interface HomeCardTypeElevenModel {
  type: 'TypeEleven'
  contents: HomeCardTypeElevenContentModel[]
  title: string
}

export interface HomeCardTypeElevenContentModel {
  name: string
  items: HomeCardTypeElevenItemModel[]
  url: string
}

export interface HomeCardTypeElevenItemModel {
  ean: string
}

export interface HomeCardTypeTwelveModel {
  type: 'TypeTwelve'
  name: string
  items: HomeCardTypeTwelveItemModel[]
}

export interface HomeCardTypeTwelveItemModel {
  name: string
  url: string
  iconUrl: string
}
