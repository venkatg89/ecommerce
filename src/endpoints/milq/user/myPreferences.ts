import milqApiRequest from 'src/apis/milq'
import { ProfilePreferencesApiModel } from 'src/models/UserModel/MilqPreferences'
import getProfilePhotoUrl from 'src/helpers/api/milq/getProfilePhotoUrl'

const MY_PREFERENCES_ENDPOINT = '/api/v0/me/preferences'

export const getPreferences =
  () => milqApiRequest({
    method: 'GET',
    endpoint: MY_PREFERENCES_ENDPOINT,
  })

export const editPreferences =
  (data: ProfilePreferencesApiModel) => milqApiRequest({
    method: 'POST',
    endpoint: MY_PREFERENCES_ENDPOINT,
    data,
  })


/* eslint-disable-next-line arrow-body-style */
export const normalizePreferencesResponse = (response: APIResponse): ProfilePreferencesApiModel => {
  response.data.image = getProfilePhotoUrl(response.data.uid)
  return response.data as ProfilePreferencesApiModel
}
