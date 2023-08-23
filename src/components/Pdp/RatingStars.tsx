import React from 'react'
import styled from 'styled-components/native'
import { Rating } from 'react-native-rating-element'
import { icons } from 'assets/images'

const Container = styled.View`
  flex-direction: column;
  align-items: ${({ isLeft }) => (isLeft ? 'flex-start ' : 'center')}; ;
`

const Title = styled.Text`
  ${({ theme, hasReviewCount }) =>
    hasReviewCount ? theme.typography.body2 : theme.palette.subtitle2};
  color: ${({ theme }) => theme.palette.grey3};
  padding-vertical: ${({ theme, hasReviewCount }) =>
    hasReviewCount ? theme.spacing(1) : theme.spacing(2)};
`

interface Props {
  ratingLevel: number
  title?: string
  size?: number
  hasReviewCount?: boolean
  isLeft?: boolean
  onStarPress?: (position) => void
  style?: any
}

const NUMBER_OF_STARS = 5

const RatingStars = ({
  ratingLevel,
  onStarPress,
  title,
  size,
  hasReviewCount,
  isLeft,
  style,
}: Props) => {
  return (
    <Container style={style} isLeft={isLeft}>
      <Rating
        rated={ratingLevel}
        totalCount={NUMBER_OF_STARS}
        size={size}
        readonly={!onStarPress}
        onIconTap={(position) => {
          if (onStarPress instanceof Function) {
            onStarPress(position)
          }
        }}
        direction="row"
        type="custom"
        selectedIconImage={icons.fullStar}
        emptyIconImage={icons.emptyStar}
      />
      {title ? <Title hasReviewCount={hasReviewCount}>{title}</Title> : null}
    </Container>
  )
}

export default RatingStars
