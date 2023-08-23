import milqApiRequest from 'src/apis/milq'

export const milqGetFavoriteCategories = (uid: string) => milqApiRequest({
  method: 'GET',
  endpoint: `/api/v0/members/${uid}/joinedcommunities`,
})

// This is not join - it's actually set.
export const milqSetMyFavoriteCategories = (categories: number[]) => {
  const data = {
    ids: categories,
  }

  return milqApiRequest({
    method: 'POST',
    endpoint: '/api/v1/communities/batchjoin',
    data,
  })
}


export const milqFollowCategory = (categoryId: string, method) => milqApiRequest({
  method,
  endpoint: `/api/v0/communities/${categoryId}/join`,
})

export const normalizeMilqFavoriteCommunitiesResponse = (data: any) => {
  // maybe we can add the rest of the community data, but assume it's already fetched*
  const favoriteCommunitiesId = data.map(community => community._id)
  return favoriteCommunitiesId
}
