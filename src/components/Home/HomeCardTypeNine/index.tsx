import React from 'react'
import styled from 'styled-components/native'

import BookCarouselHorizontalRow from 'src/components/BookCarousel/HorizontalRow'
import BackgroundGradient from 'src/components/Home/BackgroundGradient'

import { HomeCardTypeNineModel } from 'src/models/HomeModel'

const Container = styled(BackgroundGradient)`
  margin-vertical: ${({ theme }) => theme.spacing(3)};
`

interface OwnProps {
  content: HomeCardTypeNineModel
}

type Props = OwnProps

const HomeCardNine = ({ content }: Props) => {
  return (
    <Container>
      <BookCarouselHorizontalRow
        size="large"
        header={content.name}
        eans={content.items.map((item) => item.ean)}
        seeAllLinkUrl={content.seeAllLinkUrl}
      />
    </Container>
  )
}

export default HomeCardNine
