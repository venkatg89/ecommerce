import React from 'react'
import styled from 'styled-components/native'
import { FlatList, TouchableOpacity } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import { CONTENT_HORIZONTAL_PADDING, useResponsiveDimensions } from 'src/constants/layout'
import _BookImage from 'src/components/BookImage'
import AddToListActionButton from 'src/components/LegacyAddBookToList/Button'

import { BookModel, asEan } from 'src/models/BookModel'
import { push, Routes, Params } from 'src/helpers/navigationService'
import { connect } from 'react-redux'
import { booksReadingStatusSelector } from 'src/redux/selectors/myBooks/readingStatusSelector'
import { ReadingStatus } from 'src/models/ReadingStatusModel'

interface ContainerProps {
  currentWidth: number
}

const Container = styled.View<ContainerProps>`
  flex: 1;
  flex-direction: column;
  ${({ theme, currentWidth }) => (DeviceInfo.isTablet()
    ? `margin: ${theme.spacing(3)}px ${CONTENT_HORIZONTAL_PADDING(currentWidth)}px;`
    : `margin: ${theme.spacing(2)}px;`
  )}
  border: ${({ theme }) => theme.palette.disabledGrey};
  border-radius: 4;
  background-color: ${({ theme }) => theme.palette.white};
  ${({ theme }) => theme.boxShadow.container}
  padding-bottom: ${({ theme }) => theme.spacing(1)};
`

const Row = styled.View`
  flex-direction: row;
  margin-top: ${({ theme }) => theme.spacing(2)}px;
  margin-horizontal: ${({ theme }) => theme.spacing(3)}px;
`

const Column = styled.View`
  flex-direction: column;
  align-items: flex-start;
  margin-left: ${({ theme }) => theme.spacing(2)};
  flex: 1;
  height: 100%;
`

const HeaderText = styled.Text`
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  margin-horizontal: ${({ theme }) => theme.spacing(2)};
  ${({ theme }) => theme.typography.heading2};
  text-align: center;
  letter-spacing: 0.7;
`

const BookContainer = styled.TouchableOpacity``

const BookImage = styled(_BookImage)`
  flex-direction: column;
  width: 74;
  border-radius: 2;
`

const BookTitle = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
`

const Authors = styled.Text`
  padding-top: ${({ theme }) => theme.spacing(0.5)};
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
`

const AddToListButton = styled(AddToListActionButton)`
  margin: ${({ theme }) => theme.spacing(3)}px 0px;
  padding: ${({ theme }) => theme.spacing(0.5)}px;
  align-self: flex-start;
`
interface OwnProps {
  bookOrEanList: BookModel[]
  title: string
}
interface StateProps {
  readingStatus: ReadingStatus[]
}
const selector = () => {
  const _booksReadingStatusSelector = booksReadingStatusSelector()

  return (state, ownProps) => ({
    readingStatus: _booksReadingStatusSelector(state, ownProps),
  })
}

const connector = connect<StateProps, {}, OwnProps>(selector)

const renderItem = item => (
  <Row>
    <BookContainer
      accessibilityLabel={ `cover: ${item.name}` }
      accessibilityRole="imagebutton"
      onPress={ () => push(Routes.PDP__MAIN, { [Params.EAN]: asEan(item) }) }
    >
      <BookImage
        bookOrEan={ item }
        maxWidth={ 74 }
        maxHeight={ 104 }
        addBookShadow
      />
    </BookContainer>
    <Column>
      <TouchableOpacity onPress={ () => push(Routes.PDP__MAIN, { [Params.EAN]: asEan(item) }) }>
        <BookTitle
          accessibilityLabel={ `title: ${item.name}` }
          numberOfLines={ 1 }
        >
          { item.name }
        </BookTitle>
      </TouchableOpacity>
      <Authors
        accessibilityLabel={ `author: ${item.authors}` }
        numberOfLines={ 1 }
        ellipsizeMode="tail"
      >
        { item.authors }
      </Authors>
      <AddToListButton ean={ asEan(item) } />
    </Column>
  </Row>
)

type Props = StateProps & OwnProps

export default connector(({ bookOrEanList, title, readingStatus }: Props) => {
  const { width } = useResponsiveDimensions()
  return (
    <Container currentWidth={ width }>
      <HeaderText
        accessibilityRole="header"
        numberOfLines={ 3 }
      >
        {title}
      </HeaderText>
      <FlatList
        data={ bookOrEanList }
        keyExtractor={ item => asEan(item) }
        extraData={ readingStatus }
        renderItem={ ({ item }) => renderItem(item) }
      />
    </Container>
  )
})
