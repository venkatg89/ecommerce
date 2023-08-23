import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import { toDayMonth } from 'src/helpers/dateFormatters'
import { CommentId, CommentModel } from 'src/models/Communities/AnswerModel'
import { Uid } from 'src/models/UserModel'

import CommentCta from 'src/components/CtaButtons/CommentCta'
import UserIcon from 'src/components/UserIconList/UserIcon'
import _Button from 'src/controls/Button'
import { icons } from 'assets/images'

import { isMyLikedCommentSelector, isUserLoggedInSelector, getMyProfileUidSelector } from 'src/redux/selectors/userSelector'
import { toggleLikeCommentAction } from 'src/redux/actions/user/community/likeCommentsAction'
import { checkIsUserLoggedOutToBreakAction } from 'src/redux/actions/modals/guestUser'
import { push, Routes, Params } from 'src/helpers/navigationService'

interface ContentProps {
  isActive: boolean
}


const Content = styled.View<ContentProps>`
  margin-bottom: 20px;
  opacity: ${({ isActive }) => (isActive ? 1 : 0.3)};
`

const ChildContent = styled.View`
  margin-bottom: 20px;
  margin-top: 20px;
  margin-left: 20px;
`

const Header = styled.View`
  flex-direction: row;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const UserInfo = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  height: 24px;
  width: 100%;
`

const Username = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey1};
  padding-left: ${({ theme }) => theme.spacing(1)};
`

const Date = styled.Text`
  margin-left: auto;
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
`

const Comment = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey2};
`

const RowContainer = styled.View`
  flex-direction: row;
  align-items: center;
`

const Footer = styled(RowContainer)`
  width:100%;
  padding-top: ${({ theme }) => theme.spacing(3)};
  justify-content: space-between;
`

const ReplyFooter = styled(RowContainer)`
  justify-content: space-between;
`

interface IconProps {
  likeIcon?: boolean;
}

const Icon = styled.Image<IconProps>`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
  ${({ theme, likeIcon }) => (likeIcon ? `tint-color: ${theme.palette.moderateRed};` : '')};
`

const IconButton = styled(_Button)`
  margin-right: ${({ theme }) => theme.spacing(3)};
`

const ReplyButton = styled(_Button)`
  padding: ${({ theme }) => theme.spacing(1)}px ${({ theme }) => theme.spacing(2)}px;
`

interface OwnProps {
  comment: CommentModel
  onShowReply: (commentId: CommentId) => void
  currentCommentId: CommentId
  editComment: (comment: CommentModel, parentId: CommentId) => void
}

interface StateProps {
  isLikedComment: boolean;
  isUserLogin: boolean;
  myUid: Uid
}

const selector = createStructuredSelector({
  isLikedComment: (state, ownProps) => {
    const { comment } = ownProps
    return isMyLikedCommentSelector(state, { commentId: comment.id })
  },
  isUserLogin: isUserLoggedInSelector,
  myUid: getMyProfileUidSelector,
})

interface DispatchProps {
  toggleLikeComment: (commentId: number) => void;
  checkIsUserLoggedOutToBreak: () => boolean
}

const dispatcher = dispatch => ({
  toggleLikeComment: commentId => dispatch(toggleLikeCommentAction(commentId)),
  checkIsUserLoggedOutToBreak: () => dispatch(checkIsUserLoggedOutToBreakAction()),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(selector, dispatcher)

type Props = StateProps & DispatchProps & OwnProps


const CommentItem = ({ comment, onShowReply, currentCommentId, isLikedComment, isUserLogin, checkIsUserLoggedOutToBreak, toggleLikeComment, myUid, editComment }: Props) => {
  const handlePressLike = () => {
    if (checkIsUserLoggedOutToBreak()) {return}
    toggleLikeComment(comment.id)
  }

  const toggleEditComment = (selectedComment, commentId) => () => {
    editComment(selectedComment, commentId)
  }
  const onPress = uid => () => push(Routes.PROFILE__MAIN, { [Params.MILQ_MEMBER_UID]: uid })

  const renderReplyComments = () => {
    if (comment.childCount && comment.childNotes) {
      return comment.childNotes.map(child => (
        <ChildContent key={ child.id }>
          <Header>
            <UserInfo onPress={ onPress(child.creator.uid) }>
              <UserIcon userId={ child.creator.uid } />
              <Username>{ child.creator.name }</Username>
              <Date>{ toDayMonth(child.creationDate) }</Date>
            </UserInfo>
          </Header>
          <ReplyFooter>
            <Comment>
              { child.text }
            </Comment>
            {isUserLogin && (
              <CommentCta
                accessibilityLabel="more actions"
                commentId={ child.id }
                answerId={ comment.answerId }
                parentCommentId={ comment.id }
                isMyComment={ child.creator.uid === myUid }
                editComment={ toggleEditComment(child, comment.id) }
              />
            )}
          </ReplyFooter>
        </ChildContent>
      ))
    }
    return null
  }

  if (!comment.id) {return null}
  return (
    <Content isActive={ !currentCommentId || currentCommentId === comment.id }>
      <Header>
        <UserInfo onPress={ onPress(comment.creator.uid) }>
          <UserIcon userId={ comment.creator.uid } />
          <Username>{ comment.creator.name }</Username>
          <Date>{ toDayMonth(comment.creationDate) }</Date>
        </UserInfo>
      </Header>
      <Comment>
        { comment.text }
      </Comment>
      <Footer>
        <RowContainer>
          <IconButton
            accessibilityLabel={ isLikedComment ? 'unlike comment' : 'like comment' }
            icon
            onPress={ handlePressLike }
          >
            <Icon source={ isLikedComment ? icons.favorite : icons.unfavorite } likeIcon />
          </IconButton>
          <ReplyButton onPress={ () => onShowReply(comment.id) } variant="outlined" size="small">
              Reply
          </ReplyButton>
        </RowContainer>
        { isUserLogin && (
        <CommentCta
          accessibilityLabel="more actions"
          commentId={ comment.id }
          answerId={ comment.answerId }
          isMyComment={ comment.creator.uid === myUid }
          editComment={ toggleEditComment(comment, comment.id) }
        />
        ) || undefined }
      </Footer>
      { renderReplyComments() }
    </Content>

  )
}

export default connector(CommentItem)
