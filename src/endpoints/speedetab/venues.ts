import config from 'config'

import speedetabApiRequest from 'src/apis/speedetab'

import { CafeVenue } from 'src/models/CafeModel/VenueModel'
import { venueNormalizer } from 'src/helpers/api/cafe/venueNormalizer'

interface CafeVenueParams {
  venueId: string;
}

export const getCafeVenue = ({ venueId }: CafeVenueParams) => speedetabApiRequest({
  method: 'GET',
  endpoint: `/users/v1/venues/${venueId}`,
})

interface CafeSearchVenueResultsParams {
  query?: string;
  latitude?: number;
  longitude?: number;
  skip?: number;
  externalVenueId?: string;
}

export const VENUE_COUNT_PER_SEARCH = 20

export const getCafeSearchVenueResults = ({ query, latitude, longitude, skip = 0 }: CafeSearchVenueResultsParams) => speedetabApiRequest({ // eslint-disable-line
  method: 'GET',
  endpoint: '/users/v1/venues',
  params: {
    merchant_id: config.api.speedetab.merchantId,
    ...(query
      ? { search: query }
      : { latitude, longitude }
    ),
    page: Math.max(0, ((skip / VENUE_COUNT_PER_SEARCH) - 1)),
    per_page: VENUE_COUNT_PER_SEARCH,
  },
})

export const getCafeVenueByExternalId = ({ externalVenueId }: CafeSearchVenueResultsParams) => speedetabApiRequest({ // eslint-disable-line
  method: 'GET',
  endpoint: '/users/v1/venues',
  params: {
    merchant_id: config.api.speedetab.merchantId,
    external_venue_id: externalVenueId,
  },
})

export const normalizeCafeSearchVenueResultsResponseData = (data: any) => {
  const { venues } = data

  const venueIds = venues.map(venue => venue.id)

  const _venues: Record<string, CafeVenue> = venues.reduce((object, venue) => {
    object[venue.id] = venueNormalizer(venue) // eslint-disable-line
    return object
  }, {})

  return ({
    venueIds,
    venues: _venues,
  })
}
