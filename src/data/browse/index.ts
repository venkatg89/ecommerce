import {
  fetchBrowseDetails,
  normalizeBrowseDetailsResponseData,
} from 'src/endpoints/atgGateway/browse'
import { BrowseDetailsModel } from 'src/models/BrowseModel'
import { getNoResultsPage } from 'src/endpoints/atgGateway/browse'

export const getBrowseDetailsData = async ({
  url,
  pageNumber = 1,
}): Promise<BrowseDetailsModel | undefined> => {
  const response = await fetchBrowseDetails({ url, pageNumber })
  if (response.ok || response.status === 200) {
    const browseDetails = await normalizeBrowseDetailsResponseData(
      response.data,
    )
    return browseDetails
  }

  return undefined
}

export const getNoResultsData = async ({
  url,
}): Promise<BrowseDetailsModel | undefined> => {
  const response = await getNoResultsPage(url)
  if (response.ok || response.status === 200) {
    const browseDetails = await normalizeBrowseDetailsResponseData(
      response.data,
    )
    return browseDetails
  }

  return undefined
}
