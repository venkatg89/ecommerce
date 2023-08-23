import milqApiRequest from 'src/apis/milq'

export const milqLikeComment = (commentId: number) => milqApiRequest({
  method: 'POST',
  endpoint: `/api/v0/notes/${commentId}/reaction/like`,
})

export const milqUnlikeComment = (commentId: number) => milqApiRequest({
  method: 'DELETE',
  endpoint: `/api/v0/notes/${commentId}/reaction/like`,
})
