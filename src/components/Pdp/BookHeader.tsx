import React from 'react'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import styled from 'styled-components/native'

import { BookModel } from 'src/models/BookModel'
import { noImageUrl } from 'src/helpers/generateUrl'
import BookHeaderGallery from './BookHeaderGallery'
import RatingStars from 'src/components/Pdp/RatingStars'
import { BookDetails } from 'src/models/PdpModel'

import AuthorRow from 'src/components/Pdp/AuthorRow'
import { Routes } from 'src/helpers/navigationService'
import { ReviewsStateModel } from 'src/models/PdpModel'
import countLabelText from 'src/helpers/countLabelText'

const Container = styled.View`
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const ImageContainer = styled.View`
  flex: 1;
`

const Title = styled.Text`
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  text-align: center;
  color: ${({ theme }) => theme.palette.grey1};
  ${({ theme }) => theme.typography.heading2}
`

const ContainerRating = styled.View`
  margin-top: ${({ theme }) => theme.spacing(1)};
`

const ClickableContainer = styled.TouchableOpacity``

interface OwnProps {
  book: BookModel
  isBusy: boolean
  reviews: ReviewsStateModel
  productDetails: BookDetails
}

type Props = OwnProps & NavigationInjectedProps

const PdpBookHeader = ({
  navigation,
  book,
  reviews,
  productDetails,
}: Props) => {
  const reviewsAmount = (amount) => {
    if (amount === 0) {
      return 'No Reviews'
    } else {
      return `${countLabelText(amount, 'Review', 'Reviews')}`
    }
  }

  return (
    <Container accessible={false}>
      <ImageContainer>
        <BookHeaderGallery
          onPress={() => {
            navigation.navigate({
              routeName: Routes.PDP__PRODUCT_IMAGES,
              params: {
                urlList: book.imageList || [noImageUrl],
              },
            })
          }}
          urlList={book.imageList || [noImageUrl]}
        />
      </ImageContainer>
      <Title accessibilityLabel={`title: ${book.name}`} numberOfLines={2}>
        {book.name}
      </Title>
      <AuthorRow book={book} isDisabled={false} />
      {reviews && reviews[book.ean] ? (
        <ClickableContainer
          onPress={() =>
            navigation.navigate(Routes.PDP__READ_LIST_REVIEWS, {
              product: book,
              reviews: reviews,
              productDetails: productDetails,
            })
          }
          disabled={reviews[book.ean].reviewsCount === 0}
        >
          <ContainerRating>
            <RatingStars
              ratingLevel={reviews[book.ean].ratings}
              title={reviewsAmount(reviews[book.ean].reviewsCount)}
              hasReviewCount
              size={22}
            />
          </ContainerRating>
        </ClickableContainer>
      ) : null}
    </Container>
  )
}

export default withNavigation(PdpBookHeader)
