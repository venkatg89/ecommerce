import React from 'react'
import { connect } from 'react-redux'
import { NavigationInjectedProps } from 'react-navigation'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import Container from 'src/controls/layout/ScreenContainer'
import Header from 'src/controls/navigation/Header'
import RelatedQuestionsList from 'src/components/RelatedQuestionsList'

import _ScreenHeader from 'src/components/ScreenHeader'
import { CONTENT_HORIZONTAL_PADDING, useResponsiveDimensions } from 'src/constants/layout'

import { BookModel } from 'src/models/BookModel'
import { Params } from 'src/constants/routes'
import { bookSelector } from 'src/redux/selectors/booksListSelector'
import { pdpBookRelatedQuestionIdsSelector } from 'src/redux/selectors/pdpSelector'

interface HeaderProps {
  currentWidth: number
}

const ScreenHeader = styled(_ScreenHeader)<HeaderProps>`
  margin-horizontal: ${({ currentWidth }) => CONTENT_HORIZONTAL_PADDING(currentWidth)};
`

interface StateProps {
  book: BookModel;
  bookRelatedQuestions: string[];
}

const selector = createStructuredSelector({
  book: (state, ownProps) => {
    const ean = ownProps.navigation.getParam(Params.EAN)
    return bookSelector(state, { ean })
  },
  bookRelatedQuestions: (state, ownProps) => {
    const ean = ownProps.navigation.getParam(Params.EAN)
    return pdpBookRelatedQuestionIdsSelector(state, { ean })
  },
})

const connector = connect<StateProps, {}, {}>(selector)

type Props = StateProps & NavigationInjectedProps

const RelatedQuestionsListScreen = ({ book, bookRelatedQuestions }: Props) => {
  const { width } = useResponsiveDimensions()
  return (
    <Container>
      <ScreenHeader
        currentWidth={ width }
        header="Related Questions"
        body={ `Related Questions that recommend ${book.name} by ${book.authors}` }
      />
      <RelatedQuestionsList questionIds={ bookRelatedQuestions } />
    </Container>
  )
}

RelatedQuestionsListScreen.navigationOptions = () => ({
  header: headerProps => <Header headerProps={ headerProps } />,
})

export default connector(RelatedQuestionsListScreen)
