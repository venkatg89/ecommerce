import makeActionCreator from 'src/helpers/redux/makeActionCreator'

import {
  milqLikeComment, milqUnlikeComment,
} from 'src/endpoints/milq/user/likeComments'

import { myLikedCommentsIdsSelector } from 'src/redux/selectors/userSelector'
import { State } from 'src/redux/reducers'

/* fetch liked comments is part of relations action */

export const SET_LIKE_COMMENT = 'COMMENT__LIKED_COMMENT_SET'
export const setLikeComment = makeActionCreator<{ commentId: number }>(SET_LIKE_COMMENT)
export const UNSET_LIKE_COMMENT = 'COMMENT__LIKED_COMMENT_UNSET'
export const unsetLikeComment = makeActionCreator<{ commentId: number }>(UNSET_LIKE_COMMENT)

export const toggleLikeCommentAction: (commentId: number) => ThunkedAction<State> =
  commentId => async (dispatch, getState) => {
    const likedCommentsIds = myLikedCommentsIdsSelector(getState())
    const liked = likedCommentsIds.includes(commentId)

    if (liked) {
      const response = await milqUnlikeComment(commentId)
      if (response.ok) {
        await dispatch(unsetLikeComment({ commentId }))
      }
    } else {
      const response = await milqLikeComment(commentId)
      if (response.ok) {
        await dispatch(setLikeComment({ commentId }))
      }
    }
  }
