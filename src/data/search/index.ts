import LLLocalytics from 'localytics-react-native'
import {
  fetchSearchResults,
  normalizeSearchResultsResponseData,
} from 'src/endpoints/atgGateway/search'
import {
  SearchResultsModel,
  SearchOtherResultsModel,
  ResultModel,
} from 'src/models/SearchModel'
import { getBooksDetails } from 'src/endpoints/atgGateway/pdp/booksDetails'
import { LL_SEARCHED } from 'src/redux/actions/localytics'

interface Params {
  searchTerm: string
  filterTerm?: string
  page?: number
  sortTerm?: string
  searchMode?: string
}

export const getSearchResultsData = async ({
  searchTerm,
  filterTerm,
  page = 1,
  sortTerm,
  searchMode,
}: Params): Promise<
  undefined | SearchResultsModel | SearchOtherResultsModel
> => {
  const response = await fetchSearchResults({
    searchTerm,
    filterTerm,
    page,
    sortTerm,
    searchMode,
  })
  if (response.ok) {
    if (response.data.response.browseDetails) {
      return {
        type: 'browse',
        term: response.data.response.browseDetails.canonicalRequestUri,
      } as SearchOtherResultsModel
    }
    const data = await normalizeSearchResultsResponseData(response.data)
    if (data) {
      const searched = {
        term: searchTerm,
        resultNumber: data.totalResults,
      }
      LLLocalytics.tagEvent({ name: LL_SEARCHED, attributes: { ...searched } })
    }
    return data
  }
  return undefined
}

export const getPdpDetailsData = async (
  eans: string[],
): Promise<ResultModel[]> => {
  const response = await getBooksDetails(eans)
  if (response.ok) {
    return response.data.response.productDetails.map(
      (product): ResultModel => ({
        rating: product.averageRating,
        ean: product.bnSKUId,
        skuType: product.skuType,
        name: product.displayName,
        contributor:
          product && product.contributors && product.contributors.length > 0
            ? product.contributors[0].name
            : '',
        format: product.parentFormat,
        listPrice: product.salePrice,
        originalPrice: product.msrp,
        // percentageSaveText: product.salePrice && product.salePrice / product.msrp,
      }),
    )
  }
  return []
}
