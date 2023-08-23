
import makeApiRequest from 'src/helpers/api/makeApiRequest'
import { axiosStore } from './axiosInstances'


export default function storeGatewayApiRequest(options: RequestOptions): Promise<APIResponse> {
  return makeApiRequest(axiosStore, options)
}
