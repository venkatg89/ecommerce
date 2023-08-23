import config from '../../../../config'

// since the image url is never passed back in the profile response, we must manually
// remember the url and fetch from said url with the uid given from the response
export default function getProfilePhotoUrl(uid) {
  return uid ? `${config.api.milq.avatarUrl.replace('<uid>', uid)}?${new Date().getTime()}` : ''
}
