import makeApiRequest from 'src/helpers/api/makeApiRequest'

import { axiosBazaarVoice } from './axiosInstances'

export default function bazaarVoiceApiRequest(
  options: RequestOptions,
): Promise<APIResponse> {
  return makeApiRequest(axiosBazaarVoice, options)
    .then((_response) => {
      const response = _response
      response.ok = response.status >= 200 || response.status <= 299
      return response
    })
    .catch((_response) => {
      const response = _response
      response.ok = false
      return response
    })
}
