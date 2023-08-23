import React from 'react'
import styled from 'styled-components/native'
import RatingStars from 'src/components/Pdp/RatingStars'
import _ReviewsProgressBar from 'src/components/Pdp/ReadReviews/ReviewsProgressBar'


const Container = styled.View`
  background-color: ${({ theme }) => theme.palette.white};
`

const ProgressContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const ReviewsNumber = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey1};
`

const ReviewsProgressBar = styled(_ReviewsProgressBar)`
  margin-vertical: ${({ theme }) => theme.spacing(1)};
  width: 215
  height: 8
`

interface Props {
  ratingLevel: number
  size: number
  start: string
  end: string
  reviewsNumber: number
}

const ReviewsChart = ({
  ratingLevel,
  size,
  start,
  end,
  reviewsNumber,
}: Props ) => {
  return (
    <Container>
      <ProgressContainer>
        <RatingStars ratingLevel={ratingLevel} size={size} isLeft={true} />
        <ReviewsProgressBar start={start} end={end} />
        <ReviewsNumber>{reviewsNumber}{reviewsNumber < 10 ? '  ' : ''}</ReviewsNumber>
      </ProgressContainer>
    </Container>
  )
}

export default ReviewsChart
