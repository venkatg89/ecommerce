import React, { useCallback, useContext } from 'react'
import { connect } from 'react-redux'
import styled, { ThemeContext } from 'styled-components/native'
import { createStructuredSelector } from 'reselect'
import { NavigationParams } from 'react-navigation'

import { push, Routes, Params } from 'src/helpers/navigationService'
import BookImage from 'src/components/BookImage'
import UserIconList from 'src/components/UserIconList'

import { AnswerId, AnswerModel } from 'src/models/Communities/AnswerModel'
import { BookModel, Ean } from 'src/models/BookModel'

import { setRouteToRedirectPostLoginAction } from 'src/redux/actions/onboarding'

import { bookSelector } from 'src/redux/selectors/booksListSelector'
import { answerSelector, questionTitleSelector } from 'src/redux/selectors/communities/questionsSelector'
import { getMyProfileUidSelector } from 'src/redux/selectors/userSelector'
import Button from 'src/controls/Button'
import _AgreeButton from 'src/components/AnswersList/AgreeButton'
import { checkIsUserLoggedOutToBreakAction } from 'src/redux/actions/modals/guestUser'

const Container = styled.View``

const BookContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const Info = styled.View`
  flex: 1;
  margin-left: ${({ theme }) => theme.spacing(2)};
`

const Title = styled.Text`
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(1) / 2};
`

const Author = styled.Text`
  color: ${({ theme }) => theme.palette.grey2};
  margin-right: ${({ theme }) => theme.spacing(2)}px;
`

const Cta = styled.View`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing(3)};
  flex-direction: row;
  align-items: center;
`

const AgreeButton = styled(_AgreeButton)`
  margin-right: ${({ theme }) => theme.spacing(2)};
`

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

interface OwnProps {
  ean: Ean
  answerId: AnswerId
  onBookClick?: (ean: Ean) => void
}

interface StateProps {
  uid: string
  book: BookModel
  answer: AnswerModel
  questionTitle: string
}

const selector = createStructuredSelector({
  uid: getMyProfileUidSelector,
  book: bookSelector,
  answer: answerSelector,
  questionTitle: questionTitleSelector,
})

interface DispatchProps {
  checkIsUserLoggedOutToBreak: () => void;
  setRedirect: (params: NavigationParams) => void
}

const dispatcher = dispatch => ({
  checkIsUserLoggedOutToBreak: () => dispatch(checkIsUserLoggedOutToBreakAction()),
  setRedirect: (params: NavigationParams) => dispatch(setRouteToRedirectPostLoginAction({ route: Routes.COMMUNITY__COMMENT, params })),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(selector, dispatcher)

type Props = OwnProps & DispatchProps & StateProps

const BookListItem = ({ book, onBookClick, answerId, questionTitle, uid, answer, checkIsUserLoggedOutToBreak,setRedirect }: Props) => { // eslint-disable-line
  // TODO Add list of user that agreed with the book in the search result
  // TODO Mark already recommended books in search result as agreed
  const { typography, palette, spacing } = useContext(ThemeContext)

  const goToPdp = useCallback(() => {
    push(Routes.PDP__MAIN, { [Params.EAN]: book.ean })
  }, [book])

  const onComment = (_book: BookModel, overide?: boolean) => {
    if (!overide && checkIsUserLoggedOutToBreak()) {
      setRedirect({ answerId, ean: _book.ean, title: questionTitle })
      return
    }
    push(Routes.COMMUNITY__COMMENT, { answerId, ean: _book.ean, title: questionTitle })
  }

  const showAllUsers = () => {
    push(Routes.COMMUNITY__RECOMMENDED_USER, { answerId, title: questionTitle })
  }
  const agreedUsers = answer ? answer.recentAgreedMembers : []
  const { textNote } = answer.noteCount
  return (
    <Container>
      <BookContainer onPress={ goToPdp }>
        <BookImage
          bookOrEan={ book }
          maxHeight={ spacing(13) }
          maxWidth={ spacing(9) }
        />
        <Info>
          <Title accessibilityRole="header" style={ typography.subTitle1 }>{book.name}</Title>
          <Author style={ typography.body2 }>{book.authors}</Author>
          <Cta>
            {uid === answer.creator.uid ? (
              <Author>Submitted by me</Author>
            ) : (
              <AgreeButton answerId={ answerId } />
            )}
            <UserIconList
              onPress={ showAllUsers }
              userIds={ agreedUsers.map(user => user.uid) }
              userCount={ answer ? answer.noteCount.root : 0 }
              canShowHowManyIcons={ 1 }
            />
          </Cta>
        </Info>
      </BookContainer>
      <ButtonContainer>
        <Button
          accessibilityLabel="add a comment"
          accessibilityRole="button"
          onPress={ () => onComment(book) }
          textStyle={ { color: palette.linkGreen } }
          size="small"
        >
        Add a comment
        </Button>
        {textNote > 0 && (
        <Button onPress={ () => onComment(book, true) } textStyle={ { color: palette.linkGreen } } size="small">
          {`See Comments (${textNote})`}
        </Button>
        )}
      </ButtonContainer>
    </Container>
  )
}


export default connector(BookListItem)
