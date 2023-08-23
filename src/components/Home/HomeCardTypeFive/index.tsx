import React, { useEffect } from 'react'
import styled from 'styled-components/native'
import { connect } from 'react-redux'
import BookImage from 'src/components/BookImage'
import RatingStars from 'src/components/Pdp/RatingStars'
import { reviewsSelector } from 'src/redux/selectors/pdpSelector'
import { push, Routes } from 'src/helpers/navigationService'
import { ReviewsStateModel } from 'src/models/PdpModel'
import { createStructuredSelector } from 'reselect'
import { getReviewsAction } from 'src/redux/actions/pdp/bazaarvoice'
import BackgroundGradient from 'src/components/Home/BackgroundGradient'

const Button = styled.TouchableOpacity`
  padding-vertical: ${({ theme }) => theme.spacing(3)};
`

const Container = styled.View`
  flex-direction: row;
  padding-bottom: ${({ theme }) => theme.spacing(2)};
`

const Content = styled.View`
  flex: 1;
  justify-content: center;
  padding-left: ${({ theme }) => theme.spacing(1)};
`
const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
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

const PriceDetailsRow = styled.View`
  flex-direction: row;
`
const OldPriceText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey4};
  margin-bottom: ${({ theme }) => theme.spacing(0.5)};
  text-decoration-line: line-through;
`
const PercentageText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.linkGreen};
  margin-bottom: ${({ theme }) => theme.spacing(0.5)};
`

import { HomeCardTypeFiveModel } from 'src/models/HomeModel'

interface OwnProps {
  content: HomeCardTypeFiveModel
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

const HomeCardFive = ({ content, reviews, getReviews }: Props) => {
  useEffect(() => {
    if (content) {
      getReviews(content.ean)
    }
  }, [content])
  return (
    <BackgroundGradient>
      {content.ean ? (
        <Button
          onPress={() => {
            push(Routes.PDP__MAIN, { ean: content.ean })
          }}
        >
          {content.name && (
            <HeaderText numberOfLines={1}>{content.name}</HeaderText>
          )}
          <Container>
            <BookImage bookOrEan={content.ean} size="medium" />
            <Content>
              <TitleText>{content.title}</TitleText>
              <AuthorText>{content.contributor}</AuthorText>
              {content.listPrice ? (
                <PriceDetailsRow>
                  <TitleText>{'$' + content.listPrice}</TitleText>
                  <OldPriceText>
                    {' $' + content.originalPrice + ' '}
                  </OldPriceText>
                  <AuthorText>{content.format}</AuthorText>
                </PriceDetailsRow>
              ) : null}
              {content.percentageSaveText ? (
                <PercentageText>{content.percentageSaveText}</PercentageText>
              ) : null}
              {!content.listPrice ? (
                <RatingStars
                  ratingLevel={reviews?.[content.ean]?.ratings || 0}
                  size={14}
                  isLeft
                />
              ) : null}
            </Content>
          </Container>
          <DescriptionText>{content.description}</DescriptionText>
        </Button>
      ) : null}
    </BackgroundGradient>
  )
}

export default connector(HomeCardFive)
