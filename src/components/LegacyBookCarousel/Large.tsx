import React from 'react'
import styled from 'styled-components/native'

import BookCarousel from 'src/components/LegacyBookCarousel'
import { BookOrEan } from 'src/models/BookModel'

const Container = styled.View`
`

interface Props {
  style?: any
  bookOrEanList: BookOrEan[]
  withDetails?: boolean;
}

export default ({ bookOrEanList, style, withDetails }: Props) => (
  <Container style={ style }>
    { bookOrEanList && (
      <BookCarousel
        bookOrEanList={ bookOrEanList }
        bookMaxHeight={ 186 }
        bookMaxWidth={ 142 }
        withDetails={ withDetails }
      />
    ) }
  </Container>
)
