// This is our config, not npm's config
import config from 'config'

import makeApiRequest from 'src/helpers/api/makeApiRequest'
import { axiosAtgGateway } from 'src/apis/axiosInstances'
import { AtgUserSession } from 'src/apis/session/sessions'
import { State } from 'src/redux/reducers'
import { AtgCookiesStore } from 'src/apis/session/sessions'

const LOGOUT_ENDPOINT = '/my-account/logout'

export const atgLogout = async (state: State) => {
  const data = {
    clientId: config.api.atgGateway.clientId,
  }
  const atgJwtToken = await AtgUserSession.get()
  if (!atgJwtToken) {return}

  const profileId = state.atg.session.pId

  const headerCookies = await AtgCookiesStore.get()

  await makeApiRequest(
    axiosAtgGateway,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${atgJwtToken}`,
        pId: profileId,
        Cookie: headerCookies,
      },
      endpoint: LOGOUT_ENDPOINT,
      data,
    },
  )
}
