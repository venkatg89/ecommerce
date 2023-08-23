import { ProfileModel } from 'src/models/UserModel'
import getProfilePhotoUrl from 'src/helpers/api/milq/getProfilePhotoUrl'

export const normalizeMemberData = (member): ProfileModel => ({
  name: member.name,
  uid: member.uid,
  followingCount: member.followingCount || 0,
  followerCount: member.followerCount || 0,
  agreedAnswerCount: member.agreedAnswerCount || 0,
  createdQuestionCount: member.createdQuestionCount || 0,
  image: getProfilePhotoUrl(member.uid),
})
