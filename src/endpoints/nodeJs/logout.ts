import { axiosNodeJs } from 'src/apis/axiosInstances'
import makeApiRequest from 'src/helpers/api/makeApiRequest'
import { NodeJsSession } from 'src/apis/session/sessions'

export const nodeLogout = async () => {
  const secureSession = await NodeJsSession.get()

  if (secureSession) {
    makeApiRequest(axiosNodeJs, {
      method: 'POST',
      headers: { Authorization: `Bearer ${secureSession}` },
      endpoint: '/v1/profiles/logout',
    })
  }
}
