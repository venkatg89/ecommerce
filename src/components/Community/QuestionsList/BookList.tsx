import React, { useContext } from 'react'
import styled from 'styled-components/native'
import { ThemeContext } from 'styled-components'

import { BookModel } from 'src/models/BookModel'
import _BookCarousel from 'src/components/LegacyBookCarousel'

const Empty = styled.View`
  height: 16px;
`

type Props = {
  style?: any
  answerCount: number
  books: BookModel[]
}

const BookCarousel = styled(_BookCarousel)`
  margin-top: ${({ theme }) => theme.spacing(4)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`


const BookList = ({ answerCount, books, style }: Props) => {
  const { spacing } = useContext(ThemeContext)
  if (answerCount) {
    return (
      <BookCarousel
        style={ style }
        contentContainerStyle={ { flexGrow: 1, justifyContent: 'center' } }
        bookOrEanList={ books }
        bookMaxHeight={ spacing(13) }
        bookMaxWidth={ spacing(9) }
        leftPadTypeTablet="book-width"
        rightPadTypeTablet="book-width"
      />
    )
  }

  return <Empty />
}

export default BookList
