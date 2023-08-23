import React, { useMemo } from 'react'
import styled from 'styled-components/native'

import BookCarousel from 'src/components/LegacyBookCarousel'
import { CONTENT_HORIZONTAL_PADDING, useResponsiveDimensions } from 'src/constants/layout'

import { BookOrEan } from 'src/models/BookModel'

interface ContainerProps {
  currentWidth: number
}

const Container = styled.View<ContainerProps>`
  margin-left:${({ currentWidth }) => -CONTENT_HORIZONTAL_PADDING(currentWidth)}; 
  margin-right: ${({ currentWidth }) => -CONTENT_HORIZONTAL_PADDING(currentWidth)};
`

interface Props {
  style?: any
  bookOrEanList: BookOrEan[]
}

export default ({ bookOrEanList, style }: Props) => {
  const { width } = useResponsiveDimensions()

  const contentContainerStyle = useMemo(() => ({
    paddingLeft: CONTENT_HORIZONTAL_PADDING(width),
    paddingRight: CONTENT_HORIZONTAL_PADDING(width),
  }), [width])


  return (
    <Container style={ style } currentWidth={ width }>
      <BookCarousel
        contentContainerStyle={ contentContainerStyle }
        bookOrEanList={ bookOrEanList }
        bookMaxHeight={ 102 }
        bookMaxWidth={ 73 }
      />
    </Container>
  )
}
