import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import BookCarouselHorizontalRow from 'src/components/BookCarousel/HorizontalRow'

import { HomeCardTypeTenModel } from 'src/models/HomeModel'

const Gradient = styled(LinearGradient)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${({ theme }) => -theme.spacing(2)};
  right: ${({ theme }) => -theme.spacing(2)};
  opacity: 0.25;
`

const Container = styled.View`
  padding-vertical: ${({ theme }) => theme.spacing(3)};
  background-color: ${({ backgroundColor }) => backgroundColor};
  margin-horizontal: ${({ theme }) => -theme.spacing(2)};
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
`

interface OwnProps {
  content: HomeCardTypeTenModel
}

type Props = OwnProps

const HomeCardTen = ({ content }: Props) => {
  return (
    <Container backgroundColor={content.backgroundColor}>
      <Gradient colors={ ['#FFFFFF', '#000000'] } />
      <BookCarouselHorizontalRow
        size="medium"
        header={content.name}
        eans={content.items.map((item) => item.ean)}
        seeAllLinkUrl={content.seeAllBrowseUrl}
        description={content.description}
        overlap
        disableScroll
        overflowHidden
        coloredBackground={
          parseInt('0x' + content.backgroundColor, 16) !==
          parseInt('0x' + '#ffffff', 16)
        }
      />
    </Container>
  )
}

export default HomeCardTen
