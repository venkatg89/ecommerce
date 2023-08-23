import milqApiRequest from 'src/apis/milq'
// import { ProfilePreferencesApiModel } from 'src/models/UserModel/MilqPreferences'
// import getProfilePhotoUrl from 'src/helpers/getProfilePhotoUrl'

const MY_NOTIFICATIONS_ENDPOINT = '/api/v0/me/notifications'

export const getMyNotifications =
  () => milqApiRequest({
    method: 'GET',
    endpoint: MY_NOTIFICATIONS_ENDPOINT,
  })
