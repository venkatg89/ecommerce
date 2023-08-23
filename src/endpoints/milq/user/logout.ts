import { axiosMilq } from 'src/apis/axiosInstances'
import makeApiRequest from 'src/helpers/api/makeApiRequest'

export const milqLogout = () => makeApiRequest(axiosMilq, {
  method: 'POST',
  endpoint: '/api/v1/me/logout',
})
