import bopisApiRequest from 'src/apis/bopis'

const CONTEXT = {
  session_id: 0,
  client_ip: '0',
  customer_id: '0',
  platform: 'mobile',
}

export interface BopisGenerateUserLocationGeoKeyParams {
  latitude: number
  longitude: number
}

export const bopisGenerateUserLocationGeoKey = ({
  latitude,
  longitude,
}: BopisGenerateUserLocationGeoKeyParams) =>
  bopisApiRequest({
    method: 'POST',
    endpoint: '/bopis-api/v1/user/locate',
    data: {
      coordinates: [latitude, longitude],
      max_radius: 50,
      max_results: 20,
      ctx: CONTEXT,
    },
  })

export const getGeoKeyFromResponseData = (data: any): string => data?.geo_key
