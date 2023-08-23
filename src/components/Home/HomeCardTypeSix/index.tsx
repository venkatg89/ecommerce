import React from 'react'
import styled from 'styled-components/native'

import BookCarouselHorizontalRow from 'src/components/BookCarousel/HorizontalRow'
import BackgroundGradient from 'src/components/Home/BackgroundGradient'

import { HomeCardTypeSixModel } from 'src/models/HomeModel'

const Container = styled(BackgroundGradient)`
  ${({ theme, withSpace }) =>
    withSpace ? `margin-vertical: ${theme.spacing(3)};` : ''}
`

interface OwnProps {
  content: HomeCardTypeSixModel
}

type Props = OwnProps

const HomeCardSix = ({ content }: Props) => {
  return (
    <Container withSpace={content.items.length > 0}>
      <BookCarouselHorizontalRow
        header={content.name}
        eans={content.items.map((item) => item.ean)}
        seeAllText={content.seeAllText}
        seeAllLinkUrl={content.seeAllBrowseUrl}
        subtitle={content.subtitle}
        description={content.description}
        size="medium"
      />
    </Container>
  )
}

export default HomeCardSix
