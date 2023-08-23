import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import { NavigationInjectedProps } from 'react-navigation'
import { createStructuredSelector } from 'reselect'

import { BookModel } from 'src/models/BookModel'

import { fetchMemberForAnswerAction } from 'src/redux/actions/communities/fetchMembersForAnswerAction'
import { bookForAnswerSelector } from 'src/redux/selectors/booksListSelector'

import Header from 'src/controls/navigation/Header'
import Container from 'src/controls/layout/ScreenContainer'
import RecommendedUserList from 'src/components/Community/RecommendedUserList'
import HeaderWithBook from 'src/components/Community/HeaderWithBook'
import { CONTENT_HORIZONTAL_PADDING, useResponsiveDimensions } from 'src/constants/layout'


interface OwnProps extends NavigationInjectedProps {}

interface ContentProps {
  currentWidth: number
}

const Content = styled.View<ContentProps>`
  padding-top: ${({ theme }) => theme.spacing(3)};
  padding-horizontal: ${({ currentWidth }) => CONTENT_HORIZONTAL_PADDING(currentWidth)};
  flex: 1;
`

interface OwnProps extends NavigationInjectedProps {
}

interface DispatchProps {
  fetchMemberForAnswer(answerId): void,
}

interface StateProps {
  book: Nullable<BookModel>,
}

const selector = createStructuredSelector({
  book: (state, ownProps) => {
    const { navigation } = ownProps
    const answerId = navigation.getParam('answerId')
    return bookForAnswerSelector(state, { answerId })
  },
})

const dispatcher = dispatch => ({
  fetchMemberForAnswer: answerId => dispatch(fetchMemberForAnswerAction(answerId)),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(
  selector,
  dispatcher,
)

type Props = OwnProps & DispatchProps & StateProps


const RecommendedUsersScreen = ({ navigation, fetchMemberForAnswer, book }: Props) => {
  const answerId = navigation.getParam('answerId')
  const { width } = useResponsiveDimensions()

  useEffect(() => {
    fetchMemberForAnswer(answerId)
  }, [answerId])

  return (
    <Container>
      <Content currentWidth={ width }>
        { book && (
          <HeaderWithBook book={ book } title="Recommended" desc={ `See who thinks ${book.name} by ${book.authors} is a great response.` } />
        ) }
        <RecommendedUserList answerId={ answerId } />
      </Content>
    </Container>
  )
}

RecommendedUsersScreen.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('title', 'Recommend a book'),
  header: headerProps => <Header headerProps={ headerProps } />,
})


export default connector(RecommendedUsersScreen)
