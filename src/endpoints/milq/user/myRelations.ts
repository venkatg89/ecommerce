import milqApiRequest from 'src/apis/milq'

// note: uid must be member in current session
export const milqGetRelations = (uid: string) => milqApiRequest({
  method: 'GET',
  endpoint: `api/v0/members/${uid}/relations`,
})

/*
 * Followed Member (3)
 * Liked Comment (6)
 * Followed Community (7)
 * Followed Question (9)
 * Followed Answer (10)
 */

const FOLLOWED_MEMBER_TYPE = 3
const LIKED_COMMENT_TYPE = 6
const FOLLOWED_COMMUNITY_TYPE = 7
const FOLLOWED_QUESTION_TYPE = 9
const FOLLOWED_ANSWER_TYPE = 10

export const normalizeMyRelationsResponseData = (data: any) => {
  const followedMembers = []
  const likedComments = []
  const followedCommunities = []
  const followedQuestions = []
  const followedAnswers = []

  const dataArray = data.data
  Array.isArray(dataArray) && dataArray.map((record) => { // eslint-disable-line
    switch (record.type) {
      case FOLLOWED_MEMBER_TYPE: {
        // @ts-ignore
        followedMembers.push(record.entity)
        break
      }
      case LIKED_COMMENT_TYPE: {
        // @ts-ignore
        likedComments.push(record.entity)
        break
      }
      case FOLLOWED_COMMUNITY_TYPE: {
        // @ts-ignore
        followedCommunities.push(record.entity)
        break
      }
      case FOLLOWED_QUESTION_TYPE: {
        // @ts-ignore
        followedQuestions.push(record.entity)
        break
      }
      case FOLLOWED_ANSWER_TYPE: {
        // @ts-ignore
        followedAnswers.push(record.entity)
        break
      }
      default: {
        break
      }
    }
  })

  return ({
    followedMembers,
    likedComments,
    followedCommunities,
    followedQuestions,
    followedAnswers,
  })
}
