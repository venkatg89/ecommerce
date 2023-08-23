import React from 'react'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import styled from 'styled-components/native'

import { BookModel } from 'src/models/BookModel'
import RatingStarsSection from 'src/components/Pdp/ReadReviews/RatingStarsSection'
import { BookDetails } from 'src/models/PdpModel'

import { Routes } from 'src/helpers/navigationService'
import { ReviewsStateModel } from 'src/models/PdpModel'
import ReviewsSectionSlider from './ReviewsSectionSlider'

const Container = styled.View`
  margin-top: ${({ theme }) => theme.spacing(3)};
  flex-direction: column;
  width: 100%;
`

const ContainerRating = styled.View`
  margin-top: ${({ theme }) => theme.spacing(2)};
`

const TitleText = styled.Text`
  ${({ theme }) => theme.typography.heading3};
  color: ${({ theme }) => theme.palette.grey1};
`
const FlexRow = styled.View`
  flex-direction: row;
`

const Button = styled.TouchableOpacity`
  flex-direction: row;
  margin-vertical: 4;
  margin-left: auto;
`

const ButtonWrite = styled.TouchableOpacity`
  margin-top: ${({ theme }) => theme.spacing(3)};
  flex-direction: row;
`

const ButtonText = styled.Text`
  ${({ theme }) => theme.typography.button.small}
  color: ${({ theme }) => theme.palette.linkGreen};
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 1;
`

interface OwnProps {
  book: BookModel
  reviews: ReviewsStateModel
  productDetails: BookDetails
}

type Props = OwnProps & NavigationInjectedProps

const CustomerReviewsSection = ({
  navigation,
  book,
  reviews,
  productDetails,
}: Props) => {
  return (
    <Container>
      <FlexRow>
        <TitleText>Customer Reviews</TitleText>
        {reviews && reviews[book.ean] && reviews[book.ean].reviewsCount !== 0 && (
          <Button
            onPress={() =>
              navigation.navigate(Routes.PDP__READ_LIST_REVIEWS, {
                product: book,
                reviews: reviews,
                productDetails: productDetails,
              })
            }
          >
            <ButtonText>See all</ButtonText>
          </Button>
        )}
      </FlexRow>
      {reviews && reviews[book.ean] ? (
        <FlexRow>
          <ContainerRating>
            <RatingStarsSection
              ratingLevel={reviews[book.ean].ratings}
              title={`${reviews[book.ean].reviewsCount} Reviews`}
              hasReviewCount
              size={22}
            />
          </ContainerRating>
        </FlexRow>
      ) : null}
      <ButtonWrite
        onPress={() =>
          navigation.navigate(Routes.PDP__WRITE_REVIEW, {
            product: book,
            publisher: productDetails?.bookTabs?.productDetails?.publisher,
          })
        }
      >
        <ButtonText>Write A Review</ButtonText>
      </ButtonWrite>
      {reviews && reviews[book.ean] && (
        <ReviewsSectionSlider
          product={book}
          reviews={reviews}
          productDetails={productDetails}
        />
      )}
    </Container>
  )
}

export default withNavigation(CustomerReviewsSection)
