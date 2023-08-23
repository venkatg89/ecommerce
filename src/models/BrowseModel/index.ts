import { FilterModel, FilterGroupsModel } from 'src/models/SearchModel'
import {
  HomeCardTypeOneModel,
  HomeCardTypeTwoModel,
  HomeCardTypeFiveModel,
  HomeCardTypeSixModel,
  HomeCardTypeThreeModel,
  HomeCardTypeFourModel,
  HomeCardTypeSevenModel,
  HomeCardTypeEightnModel,
  HomeCardTypeNineModel,
  HomeCardTypeTenModel,
  HomeCardTypeElevenModel,
  HomeCardTypeTwelveModel,
  FilteredBrowseContent,
  HomeCardCQ,
} from '../HomeModel'
export { FilterModel, FilterGroupsModel }

export interface BrowseTopNavDetailsModel {
  name: string
  url: string
  iconUrl?: string
}

export interface SortModel {
  name: string
  term: string
  selected: boolean
}

export type BrowseSectionModel =
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

export interface BrowseDetailsModel {
  name: string
  url: string
  type: string
  title: string
  appliedFilters: FilterModel[]
  filterGroups: FilterGroupsModel[]
  page: number
  totalPages: number
  nextPageUrl: string
  totalResults: number
  sort: SortModel[]
  filterResults: FilteredBrowseContent
  browseSections: BrowseSectionModel[]
  errorMessage: string
  CSS: string
  JS: string
}
