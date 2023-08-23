import atgApiRequest from 'src/apis/atgGateway'
import {
  HomeDetailsModel,
  HomeCardTypeOneModel,
  HomeCardTypeOneItemModel,
  HomeCardTypeTwoModel,
  HomeCardTypeTwoItemModel,
  HomeCardTypeThreeModel,
  HomeCardTypeFourModel,
  HomeCardTypeFourContentModel,
  HomeCardTypeFourItemModel,
  HomeCardTypeNineModel,
  HomeCardTypeNineItemModel,
  HomeCardTypeTenModel,
  HomeCardTypeTenItemModel,
  HomeCardTypeElevenModel,
  HomeCardTypeElevenContentModel,
  HomeCardTypeElevenItemModel,
  HomeCardTypeTwelveModel,
  HomeCardTypeTwelveItemModel,
} from 'src/models/HomeModel'
import htmlToText from 'src/helpers/ui/htmlToText'
import { HomeCardType } from 'src/constants/home'

export const GET_HOME_DETAILS = '/global/getBNAppHomePageDetails'

export const fetchHomeDetails = () => {
  return atgApiRequest({
    method: 'GET',
    endpoint: GET_HOME_DETAILS,
  })
}

export const normalizeHomeDetailsResponseData = (data): HomeDetailsModel => {
  const mainContent = data.response.homePageDetails.MainContent

  const content = mainContent.map((content) => {
    switch (content.type) {
      case HomeCardType.TAB_CAROUSEL: {
        const model: HomeCardTypeOneModel = {
          type: 'TypeOne',
          name: content.name,
          items: content.contents[0].TabContainer.map(
            (tab): HomeCardTypeOneItemModel => ({
              name: htmlToText(tab.richText),
              imageSource: tab.promoImageUrl, // TODO: FIX
              url: tab.promoLinkUrl,
            }),
          ),
        }
        return model
      }

      case HomeCardType.CAROUSEL_SPOTLIGHT: {
        const model: HomeCardTypeTwoModel = {
          type: 'TypeTwo',
          name: content.title,
          seeAllBrowseUrl: content.seeAllLinkUrl,
          items: content.records.map(
            (record): HomeCardTypeTwoItemModel => ({
              ean: record.attributes['common.id'][0],
            }),
          ),
          showFeatured: true,
        }
        return model
      }

      case HomeCardType.PDP_FEATURED:
      case HomeCardType.PDP_SPOTLIGHT: {
        let ean = ''
        let contributor = ''
        if (content.records && content.records.length > 0) {
          let recordItem = content.records.slice(0,1)
          if (recordItem) {
            recordItem.map(record => (
              ean = record.attributes['common.id'] && record.attributes['common.id'].length > 0 ? record.attributes['common.id'][0] : '45553333',
              contributor = record.attributes.P_key_Contributor_List && record.attributes.P_key_Contributor_List.length > 0 ? record.attributes.P_key_Contributor_List[0] : '888'
            ))
          }
         }
        const model: HomeCardTypeThreeModel = {
          type: 'TypeThree',
          name: content.name,
          title: content.title,
          contributor: contributor,
          description: htmlToText(content.richText),
          ean: ean,
        }
        return model
      }

      case HomeCardType.CAROUSEL: {
        const model: HomeCardTypeTwoModel = {
          type: 'TypeTwo',
          name: content.title,
          seeAllBrowseUrl: content.seeAllLinkUrl,
          items: content.records.map(
            (record): HomeCardTypeTwoItemModel => ({
              ean: record.attributes['common.id'][0],
            }),
          ),
          showFeatured: false,
        }
        return model
      }

      case HomeCardType.EXPLORE_SPOTLIGHT: {
        const length = 6
        const count = 3
        const contentArray: HomeCardTypeElevenContentModel[] = []
        for (let i = 0; i < length; i++) {
          let name = content[`subHeader${i + 1}`]
          let url = content[`url${i + 1}`]
          if (!name || !url || !content.records || content.records.length <= 0) { continue }
          let recordItems = content.records.slice(i * count, i * count + count)
          let items = recordItems.map((record): HomeCardTypeElevenItemModel => ({
            ean: record.attributes['common.id'][0],
          }))
          contentArray.push({ name, items, url })
        }
        const model: HomeCardTypeElevenModel = {
          type: 'TypeEleven',
          title: content.title,
          contents: contentArray,
        }

        return model
      }

      case HomeCardType.TOP_LIST: {
        const length = 4
        const count = 3
        const contentArray: HomeCardTypeFourContentModel[] = []
        for (let i = 0; i < length; i++) {
          let name = content[`copy${i + 1}`]
          if (!name || (!content.records || content.records.length <= (i * count + count))) { continue }
          let recordItems = content.records.slice(i * count, i * count + count)
          let items
          if (recordItems) {
              items = recordItems.map((record): HomeCardTypeFourItemModel => ({
              ean: record.attributes['common.id'] && record.attributes['common.id'].length > 0 ? record.attributes['common.id'][0] : '45553333',
              title: record.attributes.P_Display_Name && record.attributes.P_Display_Name.length > 0 ? record.attributes.P_Display_Name[0] : 'yyyy',
              contributor: record.attributes.P_key_Contributor_List && record.attributes.P_key_Contributor_List.length > 0 ? record.attributes.P_key_Contributor_List[0] : '888'
            }))
          }
          contentArray.push({ name, items })
        }
        const model: HomeCardTypeFourModel = {
          type: 'TypeFour',
          contents: contentArray,
        }

        return model
      }

      case HomeCardType.SINGLE_ROW: {
        const model: HomeCardTypeNineModel = {
          type: 'TypeNine',
          name: content.name,
          seeAllLinkUrl: content.seeAllLinkUrl,
          items: content.records.map(
            (record): HomeCardTypeNineItemModel => ({
              ean: record.attributes['common.id'][0],
            }),
          ),
        }
        return model
      }

      case HomeCardType.DESCRIPTIVE_CAROUSEL: {
        const model: HomeCardTypeTenModel = {
          type: 'TypeTen',
          name: content.name,
          seeAllBrowseUrl: content.seeAllLinkUrl,
          items: content.records.map(
            (record): HomeCardTypeTenItemModel => ({
              ean: record.attributes['common.id'][0],
            }),
          ),
          backgroundColor: content.hexValue,
          description: htmlToText(content.richText),
        }
        return model
      }

      case HomeCardType.CATEGORIES: {
        const model: HomeCardTypeTwelveModel = {
          type: 'TypeTwelve',
          name: 'Shop By Genre',
          items: content.contents[0].TabContainer.map((tab): HomeCardTypeTwelveItemModel => ({
            name: tab.name,
            url: tab.promoLinkUrl,
            iconUrl: tab.promoImageUrl,
          }))
        }
        return model
      }
    }
  })

  return {
    results: content.filter((x) => !!x),
  }
}
