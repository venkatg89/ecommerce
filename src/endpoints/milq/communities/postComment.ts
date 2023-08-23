import milqApiRequest from 'src/apis/milq'
import { AnswerId, CommentId } from 'src/models/Communities/AnswerModel'

export interface PostCommentData {
  answerId: AnswerId
  parentId: CommentId
  rawText: string
}

interface EditCommentData {
  rawText: string
}

export const postComment = (data: PostCommentData) => milqApiRequest({
  method: 'POST',
  endpoint: 'api/v0/notes',
  data,
})


export const editComment = (commentId: CommentId, data:EditCommentData) => milqApiRequest({
  method: 'POST',
  endpoint: `api/v0/notes/${commentId}`,
  data,
})
