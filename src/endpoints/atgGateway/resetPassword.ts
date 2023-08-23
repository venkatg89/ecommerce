import atgApiRequest from 'src/apis/atgGateway'

const RESET_PASSWORD_ENDPOINT = '/my-account/resetPasswordByEmail'

export const atgResetPassword = (email: string) => {
  const data = {
    userEmail: email,
  }

  return atgApiRequest({
    method: 'POST',
    endpoint: RESET_PASSWORD_ENDPOINT,
    data,
  })
}
