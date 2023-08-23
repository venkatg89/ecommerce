import React from 'react'
import styled from 'styled-components/native'

import BookCarouselDoubleHorizontalRow from 'src/components/BookCarousel/DoubleHorizontalRow'
import BackgroundGradient from 'src/components/Home/BackgroundGradient'

import { HomeCardTypeTwoModel } from 'src/models/HomeModel'

const Container = styled(BackgroundGradient)``

interface OwnProps {
  content: HomeCardTypeTwoModel
}

type Props = OwnProps

const HomeCardTwo = ({ content }: Props) => {
  return (
    <Container>
      <BookCarouselDoubleHorizontalRow
        header={content.name}
        eans={content.items.map((item) => item.ean)}
        showFeatured={content.showFeatured}
        seeAllLinkUrl={content.seeAllBrowseUrl}
        maxHeight={ 240 }
        maxWidth={ 168 }
      />
    </Container>
  )
}

export default HomeCardTwo
