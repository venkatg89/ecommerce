import React, { useMemo } from 'react'
import styled from 'styled-components/native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { StyleSheet } from 'react-native'

import BookCarousel from 'src/components/LegacyBookCarousel'
import CollectionEmptyState from 'src/controls/EmptyState/CollectionEmptyState'
import Button from 'src/controls/Button'

import { CONTENT_HORIZONTAL_PADDING, useResponsiveDimensions } from 'src/constants/layout'

import { BookOrEan, Ean } from 'src/models/BookModel'

import countLabelText from 'src/helpers/countLabelText'

import { booksOrEanListSelector } from 'src/redux/selectors/booksListSelector'

interface ContainerProps {
  currentWidth: number
}


const Container = styled.View<ContainerProps>`
  margin-horizontal: ${({ currentWidth }) => -CONTENT_HORIZONTAL_PADDING(currentWidth)};
  /* background-color: ${({ theme }) => theme.palette.white}; */
  align-items: center;
  background-color: transparent;
  border-style: solid;
  border-top-color: white;
  border-top-width: 8;
  border-color: ${({ theme }) => theme.border.color};
  border-bottom-width: 0.5;
  shadow-offset: 0px 1px;
  shadow-color: black;
  shadow-radius: 5px;
  shadow-opacity: 0.18;
  overflow: hidden;
  elevation: 5;
`

const Title = styled.Text`
  color: ${({ theme }) => theme.palette.grey1};
  ${({ theme }) => theme.typography.heading2}
  align-self: center;
  margin-vertical: ${({ theme }) => theme.spacing(3)};
`

const Detail = styled.Text`
  align-self: center;
  color: ${({ theme }) => theme.palette.grey2};
  ${({ theme }) => theme.typography.body2}
  padding-top: ${({ theme }) => theme.spacing(2)};
`

const TextButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing(2)}px;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`
const OutlinedButton = styled(Button)`
  margin-vertical: ${({ theme }) => theme.spacing(3)};
`

const EmptyContainer = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
`

const styles = StyleSheet.create({
  bookCarousel: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  buttonText: {
    textTransform: 'uppercase',
  },
})

interface OwnProps {
  title: string
  // eslint-disable-next-line react/no-unused-prop-types
  eans: Ean[]
  totalBooks?: number
  style?: any
  bookMaxHeight?: number
  bookMaxWidth?: number
  onSeeFullList: () => void
  onAddToList: () => void
}

interface StateProps {
  bookOrEanList: BookOrEan[]
}

const selector = createStructuredSelector({
  bookOrEanList: (state, ownProps) => {
    const { ean } = ownProps
    return booksOrEanListSelector(state, { ean })
  },
})


const connector = connect<StateProps, {}, OwnProps>(selector)

type Props = OwnProps & StateProps

const MyBooksBookCarouselCard = ({ title, bookOrEanList, totalBooks, style, bookMaxHeight, bookMaxWidth, onSeeFullList, onAddToList }: Props) => {
  const { width } = useResponsiveDimensions()

  const renderBookList = useMemo(() => {
    if (bookOrEanList.length < 1) {
      return (
        <EmptyContainer>
          <CollectionEmptyState
            errorText1="What are you reading now? Any time you start a new book, be sure to add it."
            errorText2="Search for your book and tap the button below to see it here."
          />
          <OutlinedButton
            center
            linkGreen
            variant="outlined"
            onPress={ onAddToList }
            textStyle={ styles.buttonText }
          >
            add your current book
          </OutlinedButton>
        </EmptyContainer>
      )
    }
    return (
      <>
        <BookCarousel
          contentContainerStyle={ styles.bookCarousel }
          bookOrEanList={ bookOrEanList }
          bookMaxHeight={ bookMaxHeight || 104 }
          bookMaxWidth={ bookMaxWidth || 74 }
        />
        <Detail>
          {countLabelText(totalBooks || 0, 'book', 'books')}
        </Detail>
        <TextButton onPress={ onSeeFullList } linkGreen>
            See All
        </TextButton>
      </>
    )
  }, [JSON.stringify(bookOrEanList)])


  return (
    <Container style={ style } currentWidth={ width }>
      <Button icon onPress={ onSeeFullList }>
        <Title accessibilityRole="header">
          { title }
        </Title>
      </Button>
      {renderBookList }
    </Container>
  )
}


export default connector(MyBooksBookCarouselCard)
