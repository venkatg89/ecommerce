import React from 'react'
import TimeAgo from 'react-native-timeago'

import styled from 'styled-components/native'
import { Dimensions } from 'react-native'
import { navigate } from 'src/helpers/navigationService'
import Routes from 'src/constants/routes'

import RatingStars from 'src/components/Pdp/RatingStars'
import { BookModel } from 'src/models/BookModel'
import { ReviewsStateModel } from 'src/models/PdpModel'
import { BookDetails } from 'src/models/PdpModel'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const ITEM_HEIGHT = SCREEN_WIDTH * 0.34
const ITEM_WIDTH = SCREEN_WIDTH * 0.8

const Container = styled.View`
  background-color: ${({ theme }) => theme.palette.white};
  flex: 1;
`
const ScrollContainer = styled.ScrollView`
  margin-top: ${({ theme }) => theme.spacing(3)};
`

const BookNameText = styled.Text`
  margin-top: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  color: ${({ theme }) => theme.palette.grey1};
  ${({ theme }) => theme.typography.subtitle1};
  font-family: Lato-Bold;
`

const FlexRowContainer = styled.View`
  margin-top: ${({ theme }) => theme.spacing(1)};
  ${({ theme }) => theme.typography.body2};
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const ReviewerText = styled.Text`
  margin-left: ${({ theme }) => theme.spacing(1)};
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  flex: 1;
  text-align: left;
`

const TimeText = styled.Text`
  margin-right: ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.palette.grey3};
  ${({ theme }) => theme.typography.caption}
  align-self: flex-end;
`

const BodyText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-right: ${({ theme }) => theme.spacing(2)};
  letter-spacing: 0.4;
`

const SliderItemContainer = styled.TouchableOpacity`
  color: ${({ theme }) => theme.palette.linkGreen};
  text-transform: uppercase;
  border: 1px   ${({ theme }) => theme.palette.grey4};
  border-radius: 5px;
  height: ${ITEM_HEIGHT}
  width: ${ITEM_WIDTH}
  backgroundColor: white
  padding-left: ${({ theme }) => theme.spacing(2)};
  shadow-offset: 1px 3px;
  shadow-radius: 2;
  shadow-opacity: 0.2;
  shadow-color: #000000;
  margin-bottom:${({ theme }) => theme.spacing(1)};
  margin-right:${({ theme }) => theme.spacing(2)};
  `

interface Props {
  product: BookModel
  reviews: ReviewsStateModel
  productDetails: BookDetails
}

const ReviewsSectionSlider = ({ product, reviews, productDetails }: Props) => {
  const listReviews = reviews[product.ean].reviewsResults

  const cutString = (initialString, finalLength) => {
    return initialString.slice(0, finalLength)
  }

  return (
    <Container>
      <ScrollContainer horizontal={true}>
        {(listReviews as any[])?.map((el, index) => {
          return (
            <SliderItemContainer
              key={index}
              onPress={() =>
                navigate(Routes.PDP__READ_ITEM_REVIEW, {
                  title: el.Title,
                  rating: el.Rating,
                  nickName: el.UserNickname,
                  text: el.ReviewText,
                  time: el.SubmissionTime,
                })
              }
            >
              <FlexRowContainer>
                <RatingStars ratingLevel={el.Rating} size={14} isLeft={true} />
                <ReviewerText>
                  {el.UserNickname?.length > 15
                    ? cutString(el.UserNickname, 15)
                    : el.UserNickname}
                </ReviewerText>
                <TimeText>
                  <TimeAgo time={el.SubmissionTime} />
                </TimeText>
              </FlexRowContainer>
              <BookNameText>
                {el.Title?.length > 30 ? cutString(el.Title, 30) : el.Title}
              </BookNameText>
              <BodyText>
                {el.ReviewText?.length > 130
                  ? cutString(el.ReviewText, 130)
                  : el.ReviewText}
              </BodyText>
            </SliderItemContainer>
          )
        })}
      </ScrollContainer>
    </Container>
  )
}

export default ReviewsSectionSlider
