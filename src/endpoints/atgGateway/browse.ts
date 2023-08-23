import atgApiRequest from 'src/apis/atgGateway'

import {
  BrowseTopNavDetailsModel,
  BrowseDetailsModel,
  FilterModel,
  FilterGroupsModel,
  SortModel,
} from 'src/models/BrowseModel'

import {
  HomeDetailsModel,
  HomeCardTypeOneModel,
  HomeCardTypeTwoModel,
  HomeCardTypeFiveModel,
  HomeCardTypeSixModel,
  HomeCardTypeTwoItemModel,
  HomeCardTypeSixItemModel,
  HomeCardTypeSevenModel,
  HomeCardTypeEightnModel,
  FilteredBrowseContent,
  HomeCardCQ,
} from 'src/models/HomeModel'
import htmlToText from 'src/helpers/ui/htmlToText'
import { getReviews } from 'src/endpoints/bazaarvoice/reviews'
export const TOP_NAV_DETAILS = '/global/getTopNavDetails'
export const GET_BROWSE_DETAILS = '/browse/getBrowseDetails'
const GET_NO_RESULTS_PAGE = '/search/getNoResultsDetails'
import { getSearchDetails } from 'src/endpoints/atgGateway/pdp/getSearchDetails'

export const fetchBrowseTopNavDetails = () => {
  return atgApiRequest({
    method: 'GET',
    endpoint: TOP_NAV_DETAILS,
  })
}

export const normalizeBrowseTopNavDetailsResponseData = (data) => {
  const { topNavDetails } = data.response
  const { topNavContent } = topNavDetails
  return topNavContent.map(
    (content): BrowseTopNavDetailsModel => {
      const contents = content.contents[0]
      return {
        name: contents.storeFrontTitle,
        url: contents.linkUrl,
      }
    },
  )
}

export const fetchBrowseDetails = ({ url, pageNumber = 1 }) => {
  return atgApiRequest({
    method: 'GET',
    endpoint: GET_BROWSE_DETAILS,
    params: {
      url,
      pageNumber,
    },
  })
}

export const getNoResultsPage = (url) => {
  return atgApiRequest({
    method: 'POST',
    endpoint: GET_NO_RESULTS_PAGE,
    data: {
      queryTerm: url,
    },
  })
}

export const urlBrowseHelper = (url) => {
  if (!!url && typeof url === 'string') {
    let re = /\/[a-z]\//
    const start = url.search(re)
    return url.substr(start)
  }
  return url
}

export const normalizeBrowseDetailsResponseData = async (
  data,
): Promise<BrowseDetailsModel | undefined> => {
  try {
    const browseDetails = data.response.browseDetails || []
    const noResults = data.response.noResultsDetails || []
    const mainContentNoResults = noResults.mainContent || []
    const pdpTemplateResponse = data.response.pdpTemplate || []

    const pdpEan = pdpTemplateResponse.ean
    const pdpResponse = pdpEan ? await getSearchDetails(pdpEan) : null
    const leftContent = browseDetails.leftContent || []
    const primaryMainContent = pdpEan
      ? pdpResponse?.data.response.searchDetails.primaryMainContent || []
      : browseDetails.primaryMainContent || browseDetails.mainContent || []

    const breadcrumbs = primaryMainContent.find(
      (content) => content.type === 'Breadcrumbs',
    )
    const appliedFilters: FilterModel[] = (
      (breadcrumbs && breadcrumbs.refinementCrumbs) ||
      []
    ).map((refinementCrumb) => ({
      name: refinementCrumb.label,
      term: urlBrowseHelper(refinementCrumb.removeAction.navigationState),
    }))

    const resultsList =
      primaryMainContent.find((content) => content.type === 'ResultsList') ||
      primaryMainContent.find((content) => content.type === 'TopXList') ||
      []

    const sort: SortModel[] = (resultsList.sortOptions || []).map(
      (sortOption) => ({
        name: sortOption.label,
        term: urlBrowseHelper(sortOption.navigationState),
        selected: sortOption.selected === 'true',
      }),
    )

    let page = 1
    let totalPages = 1
    if (resultsList.pagination) {
      const _page = Object.keys(resultsList.pagination.pages).find(
        (key) => resultsList.pagination.pages[key] === '',
      )

      page = (_page && parseInt(_page, 10)) || 0

      const _totalPages = Object.keys(resultsList.pagination.pages).pop()
      totalPages = (_totalPages && parseInt(_totalPages, 10)) || 0
    }

    const nextPageUrl = resultsList.pagination
      ? urlBrowseHelper(resultsList.pagination.nextPage.link)
      : ''

    const resultEans = (resultsList.records || []).map(
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

    const filterResults: FilteredBrowseContent =
      {
        type: resultsList.type,
        results: resultsList.records?.map((item) => ({
          rating:
            bazaarReviews?.[item.attributes.commonId]?.ReviewStatistics
              .AverageOverallRating,
          ean: item.attributes.commonId,
          name: item.attributes.displayName,
          contributor: item.attributes.srchContributor,
          format: item.attributes.ParentFormat,
          listPrice: item.attributes.priceDetails[0].formats[0].listPrice,
          originalPrice: item.attributes.priceDetails[0].formats[0].oldPrice,
          percentageSaveText:
            item.attributes.priceDetails[0].formats[0].percentageSaveText,
          skuType: item.attributes.skuType,
        })),
      } || {}

    const browseContent =
      primaryMainContent.length > 0 ? primaryMainContent : mainContentNoResults

    let showFeatured = false

    const content: HomeDetailsModel = {
      results: browseContent?.map((content) => {
        const type = content.subType ? content.subType : content.type
        //TODO better document association between content type and model
        switch (type) {
          case 'productEditorial': {
            const model: HomeCardTypeSixModel = {
              type: 'TypeSix',
              name: content.title,
              subtitle: content.name,
              description: htmlToText(content.richText),
              seeAllText: content.seeAllLinkText,
              seeAllBrowseUrl: urlBrowseHelper(content.seeAllLinkUrl),
              items:
                content.records?.map(
                  (record): HomeCardTypeSixItemModel => ({
                    ean: record.attributes.commonId,
                  }),
                ) || [],
            }
            return model
          }
          case 'defaultWithDesc': {
            if (!!content.records && content.records.length > 0) {
              showFeatured = !showFeatured
            }
            const model: HomeCardTypeTwoModel = {
              type: 'TypeTwo',
              name: content.title,
              seeAllBrowseUrl: urlBrowseHelper(content.seeAllLinkUrl),
              items:
                content.records?.map(
                  (record): HomeCardTypeTwoItemModel => ({
                    ean: record.attributes.commonId,
                  }),
                ) || [],
              showFeatured: showFeatured,
            }

            return model
          }
          case 'CQContent': {
            const model: HomeCardCQ = {
              type: 'CQType',
              name: content.name,
              imageSource: `${content.cqHost}${content.description}`,
            }
            return model
          }
          case 'Hero3': {
            const model: HomeCardTypeOneModel = {
              type: 'TypeOne',
              name: content.name,
              items: [
                {
                  name: content.name,
                  imageSource: `${content.cqHost}${content.description}`,
                  url: content.promoLinkUrl, // TODO: check
                },
              ],
            }

            return model
          }
          case 'todaysDeal': {
            const model: HomeCardTypeFiveModel = {
              type: 'TypeFive',
              name: content.name,
              title: content.title,
              contributor:
                !!content.records && content.records.length > 0
                  ? content.records[0].attributes?.contributorDetails[0]
                      ?.contributorDetails[0].name
                  : '',
              description: htmlToText(content.richText),
              ean:
                !!content.records && content.records.length > 0
                  ? content.records[0].attributes.commonId
                  : undefined,
              format:
                !!content.records && content.records.length > 0
                  ? content.records[0].attributes.ParentFormat
                  : undefined,
              listPrice:
                !!content.records && content.records.length > 0
                  ? content.records[0].attributes.priceDetails[0].formats[0]
                      .listPrice
                  : undefined,
              originalPrice:
                !!content.records && content.records.length > 0
                  ? content.records[0].attributes.priceDetails[0].formats[0]
                      .oldPrice
                  : undefined,
              percentageSaveText:
                !!content.records && content.records.length > 0
                  ? content.records[0].attributes.priceDetails[0].formats[0]
                      .percentageSaveText
                  : undefined,
            }
            return model
          }
          case 'featuredEditorialSlot': {
            const model: HomeCardTypeFiveModel = {
              type: 'TypeFive',
              name: content.name,
              title: content.title,
              contributor:
                !!content.records && content.records.length > 0
                  ? content.records[0].attributes?.contributorDetails[0]
                      ?.contributorDetails[0].name
                  : '',
              description: htmlToText(content.richText),
              ean:
                !!content.records && content.records.length > 0
                  ? content.records[0].attributes.commonId
                  : undefined,
            }
            return model
          }
          case 'FeaturedLinksContainer': {
            let model: HomeCardTypeSevenModel | HomeCardTypeEightnModel
            if (content.showSubCategories) {
              model = {
                type: 'TypeEight',
                name: content.Title,
                items: !!content.featuredLinks
                  ? content.featuredLinks.map((item) => {
                      return {
                        text: item.primaryLinkText,
                        imageUrl: item.imageUrl,
                        seeAllBrowseUrl: urlBrowseHelper(
                          item.primarySeeAllLinkUrl,
                        ),
                        sublinks: !!item.sublinks
                          ? item.sublinks.map((sub) => {
                              return {
                                text: sub.subLinkValue,
                                url: urlBrowseHelper(sub.subLinkUrl),
                              }
                            })
                          : [],
                      }
                    })
                  : [],
              }
            } else {
              model = {
                type: 'TypeSeven',
                name: content.Title,
                items: !!content.featuredLinks
                  ? content.featuredLinks.map((item) => {
                      return {
                        text: item.primaryLinkText,
                        imageUrl: item.imageUrl,
                        seeAllBrowseUrl: urlBrowseHelper(
                          item.primarySeeAllLinkUrl,
                        ),
                      }
                    })
                  : [],
              }
            }

            return model
          }
        }
      }),
    }

    // find all refinement filters
    const refinements = leftContent.find((content) => !!content.navigation)
    const filterGroups: FilterGroupsModel[] = (
      (refinements && refinements.navigation) ||
      []
    )
      .filter((filterGroup) => filterGroup.dimensionName !== 'List_Price') // ignore duplicate price
      .map((filterGroup) => ({
        name: filterGroup.name,
        filters: (filterGroup.refinements || filterGroup.AugmentNavLinks).map(
          (refinement): FilterModel => ({
            name: refinement.name || refinement.label,
            term:
              urlBrowseHelper(refinement.url) ||
              urlBrowseHelper(refinement.navigationState),
          }),
        ),
      }))
    return {
      name: !!browseDetails.title ? browseDetails.title : noResults.title,
      url: browseDetails.canonicalRequestUri,
      type: browseDetails.type,
      title: browseDetails.title,
      filterGroups,
      appliedFilters,
      sort,
      page,
      totalPages,
      nextPageUrl,
      totalResults: resultsList.totalNumRecs,
      filterResults,
      browseSections: !!content.results
        ? content.results.filter((item) => !!item)
        : [],
      errorMessage:
        browseDetails.length === 0 &&
        content.results &&
        content.results.length === 0
          ? 'Something went wrong, please try again later.'
          : '',
      CSS: browseDetails.CSS,
      JS: browseDetails.CSS,
    }
  } catch (e) {
    return undefined
  }
}
