import milqApiRequest from 'src/apis/milq'
import { ProfileModel } from 'src/models/UserModel'
import getProfilePhotoUrl from 'src/helpers/api/milq/getProfilePhotoUrl'

const MY_PROFILE_ENDPOINT = '/api/v0/me'

export const getMyProfile = () => milqApiRequest({
  method: 'GET',
  endpoint: MY_PROFILE_ENDPOINT,
})

export const normalizeMyProfileData = (data: any): ProfileModel => (
  {
    name: data.name || '',
    uid: data.uid || '',
    bio: data.description || '',
    followerCount: data.followerCount || 0,
    followingCount: data.followingCount || 0,
    agreedAnswerCount: data.agreedAnswerCount || 0,
    createdQuestionCount: data.createdQuestionCount || 0,
    image: getProfilePhotoUrl(data.uid),
  }
)
