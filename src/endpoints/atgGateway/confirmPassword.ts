import atgApiRequest from 'src/apis/atgGateway'
import { AtgConfirmPassword } from 'src/models/UserModel/AtgAccountModel'

const CONFIRM__PASSWORD__ENDPOINT = '/my-account/confirmPassword'

export const confirmPasswordApi = (
  confirmPasswordRequest: AtgConfirmPassword,
) => {
  return atgApiRequest({
    method: 'POST',
    endpoint: CONFIRM__PASSWORD__ENDPOINT,
    data: confirmPasswordRequest,
  })
}
