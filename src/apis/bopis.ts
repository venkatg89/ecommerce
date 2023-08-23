import axios from 'axios'

import makeApiRequest from 'src/helpers/api/makeApiRequest'

// This is our config, not npm's config
import config from 'config'

import { axiosBopis } from './axiosInstances'

export default function bopisApiRequest(options: RequestOptions): Promise<APIResponse> {
  return makeApiRequest(axiosBopis, options)
    .then((_response) => {
      const response = _response
      response.ok = (response.status >= 200 || response.status <= 299)
      return response
    })
    .catch((_response) => {
      const response = _response
      response.ok = false
      return response
    })
}

const searchInstance = axios.create({
  baseURL: config.api.bopis.searchBaseUrl,
  headers: {
    common: {
      'Content-Type': 'application/json',
    },
  },
})

export function bopisSearchApiRequest(options: RequestOptions): Promise<APIResponse> {
  return makeApiRequest(searchInstance, options)
}
