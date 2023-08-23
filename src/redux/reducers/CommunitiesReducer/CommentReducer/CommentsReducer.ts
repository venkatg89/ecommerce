import { Reducer } from 'redux'
import { AnswerId, CommentId, CommentModel } from 'src/models/Communities/AnswerModel'
import { SET_COMMENTS_ACTION } from 'src/redux/actions/communities/fetchCommentAction'
import { ADD_CHILD_COMMENT_ACTION, ADD_COMMENT_ACTION, EDIT_COMMENT_ACTION, EDIT_CHILD_COMMENT_ACTION } from 'src/redux/actions/communities/postCommentAction'
import { DELETE_COMMENT_ACTION, DELETE_CHILD_COMMENT_ACTION } from 'src/redux/actions/communities/deleteContentActions'

export type CommentsListState = Record<AnswerId, Record<CommentId, CommentModel>>

const DEFAULT: CommentsListState = {}

const commentsList: Reducer<CommentsListState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_COMMENTS_ACTION: {
      const { answerId, comments } = action.payload
      return {
        ...state,
        [answerId]: comments,
      }
    }

    case ADD_COMMENT_ACTION: {
      const { answerId, comments } = action.payload
      return {
        ...state,
        [answerId]: {
          ...state[answerId],
          ...comments,
        },
      }
    }


    case EDIT_COMMENT_ACTION: {
      const { answerId, commentId, text } = action.payload
      const comment = state[answerId][commentId]
      return {
        ...state,
        [answerId]: {
          ...state[answerId],
          [commentId]: { ...comment, text },
        },
      }
    }

    case EDIT_CHILD_COMMENT_ACTION: {
      const { answerId, commentId, parentId, text } = action.payload
      const parentComment = state[answerId][parentId]
      const childNotes = parentComment.childNotes || []
      const updatedChildNotes = childNotes.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, text }
        }
        return { ...comment }
      })


      return {
        ...state,
        [answerId]: {
          ...state[answerId],
          [parentId]: {
            ...state[answerId][parentId],
            childNotes: [...updatedChildNotes],
          },
        },
      }
    }

    case DELETE_COMMENT_ACTION: {
      const { answerId, commentId } = action.payload
      const { [commentId]: value, ...restComments } = state[answerId]
      return { ...state, [answerId]: { ...restComments } }
    }

    case DELETE_CHILD_COMMENT_ACTION: {
      const { answerId, commentId, parentCommentId } = action.payload
      const parentComment = state[answerId][parentCommentId]
      const notCount = parentComment.childCount || 0
      const childNotes = parentComment.childNotes!.filter(note => note.id !== commentId)
      const newParentComment = { ...parentComment, childNotes, childCount: notCount - 1 }
      return { ...state, [answerId]: { ...state[answerId], [parentCommentId]: { ...newParentComment } } }
    }

    case ADD_CHILD_COMMENT_ACTION: {
      const { answerId, parentId, comment } = action.payload
      const childCount = state[answerId][parentId].childCount || 0
      const childNotes = state[answerId][parentId].childNotes || []
      return {
        ...state,
        [answerId]: {
          ...state[answerId],
          [parentId]: {
            ...state[answerId][parentId],
            childNotes: [
              ...childNotes,
              comment,
            ],
            childCount: childCount + 1,
          },
        },
      }
    }

    default:
      return state
  }
}

export default commentsList
