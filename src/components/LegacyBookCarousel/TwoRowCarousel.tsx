import React from 'react'

import { FlatList } from 'react-native'
import BookImage from 'src/components/BookImage'

import styled from 'styled-components/native'

import { BookOrEan, asEan, Ean } from 'src/models/BookModel'
import { push, Routes, Params } from 'src/helpers/navigationService'

import groupBooks from 'src/helpers/ui/groupBooks'

const DEFAULT_NUM_ROWS = 2
interface GridProps {
  isLast?: boolean
  isFirst?: boolean
}

const Row = styled.View<GridProps>`
  margin-left: ${({ theme, isFirst }) => (isFirst ? theme.spacing(3) : 0)}px;
`

const GridBookContainer = styled.View<GridProps>`
  margin-right: ${({ theme, isLast }) => (isLast ? 0 : theme.spacing(3))}px;
  margin-bottom: ${({ theme }) => theme.spacing(3)}px;
`

const BookContainer = styled.View<GridProps>`
  margin-left: ${({ theme }) => theme.spacing(3)}px;
  margin-right: ${({ theme, isLast }) => (isLast ? theme.spacing(3) : 0)}px;
  padding-vertical: ${({ theme }) => theme.spacing(1)};
  overflow: visible;
`

interface OwnProps {
  bookOrEanList: BookOrEan[]
  style?: any
  contentContainerStyle?: any
  size: string
  isGrid?: boolean
  rows?: number
  onPress?: (book: Ean) => {}
}

type Props = OwnProps

const onBookPressHandler = (ean: Ean) => {
  push(Routes.PDP__MAIN, { [Params.EAN]: ean })
}

export default ({
  style,
  contentContainerStyle,
  isGrid,
  bookOrEanList,
  rows,
  size,
  onPress,
}: Props) => {
  const renderBookSingle = (book, { isLast }) => (
    <BookContainer isLast={isLast}>
      <BookImage
        bookOrEan={book}
        size={size}
        onPress={onBookPressHandler}
        addBookShadow
      />
    </BookContainer>
  )

  const renderGridItems = (books, { isFirst }) => (
    <Row isFirst={isFirst} key={asEan(books[0])}>
      {books.map((book, i) => (
        <GridBookContainer key={asEan(book)} isLast={i === books.length - 1}>
          <BookImage
            bookOrEan={book}
            size={size}
            onPress={onBookPressHandler}
            addBookShadow
          />
        </GridBookContainer>
      ))}
    </Row>
  )

  return (
    <FlatList
      style={style}
      contentContainerStyle={contentContainerStyle}
      horizontal
      showsHorizontalScrollIndicator={false}
      data={
        isGrid
          ? groupBooks(bookOrEanList, rows || DEFAULT_NUM_ROWS)
          : bookOrEanList
      }
      keyExtractor={(item) =>
        Array.isArray(item) ? asEan(item[0]) : asEan(item)
      }
      renderItem={({ item, index }) =>
        isGrid
          ? renderGridItems(item, { isFirst: index === 0 })
          : renderBookSingle(item, {
              isLast: index === bookOrEanList.length - 1,
            })
      }
    />
  )
}
