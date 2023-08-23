import { Reducer } from 'redux'

import { SET_BROWSE_DETAILS } from 'src/redux/actions/pdp/browseDetails'
import { BrowseDetails } from 'src/endpoints/atgGateway/pdp/browseDetails'

export type BrowseDetailsState = BrowseDetails

const DEFAULT: BrowseDetailsState = {
  authorImage: '',
  description: '',
  promotionBook: {
    ean: '',
    name: '',
    cardTitle: '',
    authors: {
      directors: [],
      cast: [],
      contributors: [],
    },
    skuType: '',
    averageRating: 0,
    description: '',
  },
  bestsellersEans: [],
  allEans: [],
}

const browseDetails: Reducer<BrowseDetailsState> = (
  state = DEFAULT,
  action,
) => {
  switch (action.type) {
    case SET_BROWSE_DETAILS: {
      const response = action.payload
      return response
    }

    default:
      return state
  }
}

export default browseDetails
