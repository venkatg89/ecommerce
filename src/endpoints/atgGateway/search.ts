import atgApiRequest from 'src/apis/atgGateway'

import {
  SearchTypeAheadModel,
  SearchTypeAheadResultModel,
  SearchResultsModel,
  ResultModel,
  FilterModel,
  FilterGroupsModel,
  SortModel,
} from 'src/models/SearchModel'
import { getReviews } from 'src/endpoints/bazaarvoice/reviews'

export const SEARCH_LOOK_AHEAD = '/type-ahead/typeahead'
export const SEARCH_RESULTS = '/search/getSearchDetails'

export const fetchSearchLookAhead = (query, requestKey?) => {
  return atgApiRequest({
    method: 'GET',
    endpoint: SEARCH_LOOK_AHEAD,
    params: {
      Ntt: query,
    },
    requestKey,
  })
}

const CATEGORY_REGEX = new RegExp('<([A-Za-z][A-Za-z0-9]*)\\b[^>]*>(.*?)</\\1>')
const FILTER_TERM_URL_SPLIT = '/_/N-'
const FILTER_TERM_REGEX = new RegExp('/_/N-([a-zA-Z0-9]*)')

const extractFilterTerm = (url) => {
  const currentFilter = FILTER_TERM_REGEX.exec(`${url}/`)
  const currentFilterTerm = (currentFilter && currentFilter[1]) || ''
  return currentFilterTerm
}

export const normalizeSearchLookAheadResponseData = (
  data,
): SearchTypeAheadModel => {
  const content = data.mainContent[0]

  // TODO: make this redirect to browse?
  const pageLinkSuggestion: SearchTypeAheadResultModel[] = content.pageLinkSuggestion.map(
    (_pageLinkSuggestion) => ({
      name: _pageLinkSuggestion.pageLink,
      searchTerm: _pageLinkSuggestion.searchTerm || '',
      searchUrl: _pageLinkSuggestion.url,
      filterTerm: _pageLinkSuggestion.url.split(FILTER_TERM_URL_SPLIT)[1] || '',
    }),
  )

  const categorySuggestions: SearchTypeAheadResultModel[] = content.categorySuggestions.map(
    (categorySuggestion) => {
      const regexResponse = CATEGORY_REGEX.exec(categorySuggestion.suggestion)
      const category = (regexResponse && regexResponse[2]) || ''
      return {
        searchTerm: categorySuggestion.term || '',
        category,
        searchUrl: categorySuggestion.url,
        filterTerm:
          categorySuggestion.url.split(FILTER_TERM_URL_SPLIT)[1] || '',
      }
    },
  )

  const productSuggestions: SearchTypeAheadResultModel[] = content.productSuggestions.map(
    (productSuggestion) => ({
      searchTerm: productSuggestion.term || '',
      searchUrl: productSuggestion.url,
      filterTerm: productSuggestion.url.split(FILTER_TERM_URL_SPLIT)[1] || '',
    }),
  )

  return {
    pageLinkSuggestion,
    categorySuggestions,
    productSuggestions,
  }
}

export const fetchSearchResults = ({
  searchTerm,
  filterTerm,
  page,
  sortTerm,
  searchMode,
}) => {
  return atgApiRequest({
    method: 'POST',
    endpoint: SEARCH_RESULTS,
    data: {
      queryTerm: searchTerm,
      ...(filterTerm && { searchType: filterTerm }),
      pageNumber: page,
      ...(sortTerm && { sortBy: sortTerm }),
      ...(searchMode && { searchMode: searchMode }),
    },
  })
}

export const normalizeSearchResultsResponseData = async (
  data,
): Promise<SearchResultsModel | undefined> => {
  try {
    const searchDetails = data.response.searchDetails // data.response.noResultsDetails will return null
    const _breadcrumbs = searchDetails.primaryMainContent[0]
    const _results = searchDetails.primaryMainContent[1]
    const _leftContent = searchDetails.leftContent[0]

    const totalResults = _results.totalNumRecs
    let page = 1
    let totalPages = 1
    if (_results.pagination) {
      const _page = Object.keys(_results.pagination.pages).find(
        (key) => _results.pagination.pages[key] === '',
      )
      page = (_page && parseInt(_page, 10)) || 0
      const _totalPages = Object.keys(_results.pagination.pages).pop()
      totalPages = (_totalPages && parseInt(_totalPages, 10)) || 0
    }

    // results rating isnt accurate, pull from bazaar instead
    const resultEans = (_results.records || []).map(
      (item) => item.attributes.commonId,
    )
    const bazaarResponse = await getReviews(resultEans)
    let bazaarReviews = {}
    if (
      bazaarResponse.ok &&
      Object.keys(bazaarResponse.data.Includes).length > 0
    ) {
      bazaarReviews = bazaarResponse.data.Includes.Products
    }

    const results: ResultModel[] = (_results.records || []).map((item) => ({
      rating:
        bazaarReviews?.[item.attributes.commonId]?.ReviewStatistics
          .AverageOverallRating,
      ean: item.attributes.commonId,
      name: item.attributes.displayName,
      skuType: item.attributes.skuType,
      contributor: item.attributes.srchContributor,
      format: item.attributes.ParentFormat,
      listPrice: item.attributes.priceDetails[0].formats[0].listPrice,
      originalPrice: item.attributes.priceDetails[0].formats[0].oldPrice,
      percentageSaveText:
        item.attributes.priceDetails[0].formats[0].percentageSaveText,
      outOfStock: item.attributes.outOfStock,
      isDisabled: item.attributes.isDisabled,
    }))

    const appliedFilters: FilterModel[] = (
      _breadcrumbs.refinementCrumbs || []
    ).map((refinementCrumb) => ({
      name: refinementCrumb.label,
      term: extractFilterTerm(refinementCrumb.removeAction.navigationState),
    }))

    const filterGroups: FilterGroupsModel[] = (_leftContent.navigation || [])
      .filter((filterGroup) => filterGroup.dimensionName !== 'List_Price') // ignore duplicate price
      .map((filterGroup) => ({
        name: filterGroup.name,
        filters: filterGroup.refinements.map(
          (refinement): FilterModel => ({
            name: refinement.label,
            term: extractFilterTerm(refinement.navigationState),
          }),
        ),
      }))

    const sort: SortModel[] = (_results.sortOptions || []).map(
      (sortOption) => ({
        name: sortOption.label,
        term: sortOption.label,
        selected: sortOption.selected === 'true',
      }),
    )

    const currentSort = sort.find((_sort) => _sort.selected)
    const currentSortTerm = currentSort && currentSort.term

    const currentFilterTerm = extractFilterTerm(_breadcrumbs.navState)

    return {
      totalResults,
      page,
      totalPages,
      results,
      appliedFilters,
      filterGroups,
      sort,
      currentFilterTerm,
      currentSortTerm,
    }
  } catch (e) {
    return undefined
  }
}
