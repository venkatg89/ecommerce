export interface SearchTypeAheadModel {
  pageLinkSuggestion: SearchTypeAheadResultModel[]
  categorySuggestions: SearchTypeAheadResultModel[]
  productSuggestions: SearchTypeAheadResultModel[]
}

export interface SearchOtherResultsModel {
  type: string
  term: string
}

export interface SearchTypeAheadResultModel {
  name?: string
  searchTerm: string
  filterTerm: string
  category?: string
  searchUrl: string
}

export interface FilterModel {
  name: string
  term: string
}

export interface FilterGroupsModel {
  name: string
  filters: FilterModel[]
}

export interface ResultModel {
  rating: number
  ean: string
  name: string
  skuType: string
  contributor: string
  format: string
  listPrice: number
  originalPrice: number
  percentageSaveText?: string
  outOfStock?: boolean
  isDisabled?: boolean
}

export interface SortModel {
  name: string
  term: string
  selected: boolean
}

export interface SearchResultsModel {
  appliedFilters: FilterModel[]
  filterGroups: FilterGroupsModel[]
  results: ResultModel[]
  page: number
  totalPages: number
  totalResults: number
  sort: SortModel[]
  currentSortTerm?: string
  currentFilterTerm?: string
  type?: string
}
