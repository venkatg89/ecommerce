import {
  CommentFeatured,
  CommentModel,
  CommentRecords,
  CommentResultData,
} from 'src/models/Communities/AnswerModel'
import { SimpleMember } from 'src/models/Communities/QuestionModel'

const extractComment = data => ({
  id: data._id,
  answerId: data.answerId,
  interestId: data.interestId,
  creator: data.creator as SimpleMember,
  text: data.text,
  creationDate: data.creationDate,
  isAgreeNote: data.isAgreeNote,
  likes: (data.reactions && data.reactions.likes) || 0,
  childCount: data.childCount || 0,
  childNotes: data.childNotes || undefined,
  tag: data.href,
  featured: data.featured as CommentFeatured,
})

export const normalizeCommentResult = comment => ({
  id: comment._id,
  answerId: comment.answerId,
  interestId: comment.interestId,
  creator: comment.creator as SimpleMember,
  text: comment.text,
  creationDate: comment.creationDate,
  isAgreedNote: !!comment.isAgreedNote,
  likes: (comment.reactions && comment.reactions.likes) || 0,
  childCount: comment.childCount || 0,
  childNotes: (comment.childCount && comment.childNotes && comment.childNotes.map(child => extractComment(child))) || undefined,
  tag: comment.href,
  featured: comment.featured as CommentFeatured,
} as CommentModel)

export const normalizeCommentsResult = commentResult => commentResult.reduce(
  (result, comment) => {
    const { parentId } = comment
    if (!parentId) {
      // eslint-disable-next-line no-param-reassign
      result.comments[comment._id] = normalizeCommentResult(comment)
    } else {
      // eslint-disable-next-line no-param-reassign
      result.childrenNotes[comment.parentId].push(normalizeCommentResult(comment))
    }
    return result
  },
  {
    comments: {} as CommentRecords,
    childrenNotes: [] as CommentRecords[],
  } as CommentResultData,
)
