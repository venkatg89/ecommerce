import React, { useEffect } from 'react'
import styled from 'styled-components/native'

import BookImage from 'src/components/BookImage'
import RatingStars from 'src/components/Pdp/RatingStars'
import { reviewsSelector } from 'src/redux/selectors/pdpSelector'
import { ReviewsStateModel } from 'src/models/PdpModel'
import { createStructuredSelector } from 'reselect'
import { getReviewsAction } from 'src/redux/actions/pdp/bazaarvoice'
import { push, Routes } from 'src/helpers/navigationService'
import { connect } from 'react-redux'

const Container = styled.TouchableOpacity`
  flex-direction: row;
  padding-vertical: ${({ theme }) => theme.spacing(3)};
  border-top-width: 2;
  border-top-color: ${({ theme }) => theme.palette.disabledGrey};
  border-bottom-width: 2;
  border-bottom-color: ${({ theme }) => theme.palette.disabledGrey};
  margin-left: ${({ theme }) => -theme.spacing(2)};
  margin-right: ${({ theme }) => -theme.spacing(2)};
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
`

const Content = styled.View`
  flex: 1;
  margin-left: ${({ theme }) => theme.spacing(2)};
`

const TitleText = styled.Text`
  ${({ theme }) => theme.typography.subTitle2}
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(0.5)};
`

const AuthorText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey3};
  margin-bottom: ${({ theme }) => theme.spacing(0.5)};
`

const DescriptionText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey1};
  margin-top: ${({ theme }) => theme.spacing(0.5)};
`

import { HomeCardTypeThreeModel } from 'src/models/HomeModel'

interface OwnProps {
  content: HomeCardTypeThreeModel
}

interface StateProps {
  reviews: ReviewsStateModel
}

interface DispatchProps {
  getReviews: (ean) => void
}

const dispatcher = (dispatch) => ({
  getReviews: (ean) => dispatch(getReviewsAction(ean)),
})

const selector = createStructuredSelector({
  reviews: reviewsSelector,
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)
type Props = DispatchProps & StateProps & OwnProps

const HomeCardThree = ({ content, getReviews, reviews }: Props) => {
  useEffect(() => {
    if (content) {
      getReviews(content.ean)
    }
  }, [content])
  return (
    <Container
      onPress={() => {
        push(Routes.PDP__MAIN, { ean: content.ean })
      }}
    >
      <BookImage bookOrEan={content.ean} size="medium" />
      <Content>
        <TitleText>{content.title}</TitleText>
        <AuthorText>{content.contributor}</AuthorText>
        {reviews && reviews[content.ean] ? (
          <RatingStars
            ratingLevel={reviews[content.ean].ratings}
            size={14}
            isLeft
          />
        ) : null}
        <DescriptionText>{content.description}</DescriptionText>
      </Content>
    </Container>
  )
}

export default connector(HomeCardThree)
