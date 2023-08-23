import React, { useRef, useContext, useState, useEffect } from 'react'
import { store } from 'src/redux'
import Carousel from 'react-native-snap-carousel'
import { Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import { BookOrEan, asBookModel, Ean, asEan } from 'src/models/BookModel'
import styled, { ThemeContext } from 'styled-components/native'

import BookImage from 'src/components/BookImage'
import Button from 'src/controls/Button'
import { push, Routes, Params } from 'src/helpers/navigationService'
import { connect } from 'react-redux'
import { isUserLoggedInSelector } from 'src/redux/selectors/userSelector'

import AddToListActionButton from 'src/components/LegacyAddBookToList/Button'

import { checkIsUserLoggedOutToBreakAction } from 'src/redux/actions/modals/guestUser'
import Alert from 'src/controls/Modal/Alert'
import { ApiStatus, RequestStatus } from 'src/models/ApiStatus'
import { setBookAsNotInterestedActions } from 'src/redux/actions/legacyHome/markBookAsNotInterestedAction'
import { notInterestedApiSelector } from 'src/redux/selectors/apiStatus/user'
import { ThemeModel } from 'src/models/ThemeModel'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const BOOK_WIDTH = 168
const BOOK_HEIGHT = 240
const ITEM_WIDTH = DeviceInfo.isTablet() ? SCREEN_WIDTH / 3 : SCREEN_WIDTH / 1.6

const Container = styled.View`
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing(5)}px;
`

const BookContainer = styled.TouchableOpacity`
  align-items: center;
  padding: ${({ theme }) => theme.spacing(2)}px 0px;
`

//
const TitleAuthorWrapper = styled.View`
  align-items: center;
  width: 100%;
  height: 48;
`

const Title = styled.Text`
  margin-top: ${({ theme }) => -theme.spacing(1)};
  padding: 0px ${({ theme }) => theme.spacing(5)}px;
  ${({ theme }) => theme.typography.heading3}
  text-align: center;
`

const Author = styled.Text`
  ${({ theme }) => theme.typography.body1}
  color: ${({ theme }) => theme.font.light};
`

const AddToListButton = styled(AddToListActionButton)`
  padding: ${({ theme }) => theme.spacing(1)}px;
  margin-top: ${({ theme }) => theme.spacing(3)}px;
  margin-bottom: ${({ theme }) => theme.spacing(2)}px;
  ${({ theme }) => theme.typography.button.regular}
  align-self: center;
`

const NotInterestedButton = styled(Button)`
  text-transform: uppercase;
  padding: ${({ theme }) => theme.spacing(1)}px;
`

const ErrorMessage = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey2};
  text-align: center;
`

interface OwnProps {
  bookOrEanList: BookOrEan[]
  notInterested: (ean: Ean) => void
}

interface StateProps {
  isUserLoggedIn: boolean
  notInterestedApi: ApiStatus
}

const selector = (state) => ({
  isUserLoggedIn: isUserLoggedInSelector(state),
  notInterestedApi: notInterestedApiSelector(state),
})
interface DispatchProps {
  checkUserLoggedinToBreak: () => boolean
  clearError(): void
}

const dispatcher = (dispatch) => ({
  checkUserLoggedinToBreak: () => dispatch(checkIsUserLoggedOutToBreakAction()),
  clearError: () => dispatch(setBookAsNotInterestedActions.actions.clear),
})
const connector = connect<StateProps, DispatchProps, OwnProps>(
  selector,
  dispatcher,
)

type Props = StateProps & OwnProps & DispatchProps

export default connector(
  ({
    bookOrEanList,
    checkUserLoggedinToBreak,
    notInterested,
    clearError,
  }: Props) => {
    const carouselRef = useRef<Carousel>(null)
    const theme = useContext(ThemeContext) as ThemeModel
    const [page, setPage] = useState(0)
    const [bookState, setBookState] = useState(asBookModel(bookOrEanList[0]))

    const _viewBookDetails = (book) => () => {
      push(Routes.PDP__MAIN, { [Params.EAN]: asEan(book) })
    }

    const _renderItem = (item) => {
      const book = item.item
      return (
        book && (
          <BookContainer
            accessibilityLabel={`cover: ${book && book.name}`}
            accessibilityRole="imagebutton"
            onPress={_viewBookDetails(book)}
          >
            <BookImage
              bookOrEan={book}
              maxHeight={BOOK_HEIGHT}
              maxWidth={BOOK_WIDTH}
              addBookShadow
            />
          </BookContainer>
        )
      )
    }

    const accessibilityActions = ['activate, default', 'next book', 'previous']

    const onAccessibilityAction = (event) => {
      switch (event.nativeEvent.action) {
        case 'next book':
          carouselRef.current.snapToNext()
          break
        case 'previous book':
          carouselRef.current.snapToPrev()
          break
        default:
          break
      }
    }

    useEffect(() => {
      carouselRef.current.currentIndex !== null
        ? setBookState(
            asBookModel(bookOrEanList[carouselRef.current.currentIndex]),
          )
        : setBookState(asBookModel(bookOrEanList[page]))
    }, [page, bookOrEanList])

    const _onPress = (book) => async () => {
      if (checkUserLoggedinToBreak()) {
        return
      }

      await notInterested(book.ean)
      if (carouselRef.current) {
        const ind = carouselRef.current.currentIndex
        setPage(ind)
        setBookState(asBookModel(carouselRef.current.props.data[ind]))
      }
    }

    const _onSnapToItem = (index) => setPage(index)

    const notInterestedFetching =
      notInterestedApiSelector(store.getState()).requestStatus ===
      RequestStatus.FETCHING

    const notInterestedError = notInterestedApiSelector(store.getState()).error

    return (
      <Container>
        <Carousel
          scrollEnabled={!notInterestedFetching}
          accessible
          accessibilityActions={accessibilityActions}
          onAccessibilityAction={onAccessibilityAction}
          accessibilityLabel={bookState ? `cover: ${bookState.name}` : ''}
          accessibilityRole="imagebutton"
          ref={carouselRef}
          data={bookOrEanList}
          sliderWidth={SCREEN_WIDTH}
          itemWidth={ITEM_WIDTH}
          itemHeight={BOOK_HEIGHT}
          renderItem={_renderItem}
          onSnapToItem={_onSnapToItem}
          loop
          inactiveSlideOpacity={0.35}
        />
        <TitleAuthorWrapper>
          <TouchableOpacity onPress={_viewBookDetails(bookState)}>
            <Title
              accessibilityLabel={`title: ${bookState && bookState.name}`}
              numberOfLines={2}
            >
              {bookState ? bookState.name : ''}
            </Title>
          </TouchableOpacity>
          <Author
            accessibilityLabel={`author: ${bookState && bookState.authors}`}
          >
            {bookState ? bookState.authors : ''}
          </Author>
        </TitleAuthorWrapper>
        {bookState && <AddToListButton ean={bookState.ean} />}
        {notInterestedFetching ? (
          <ActivityIndicator size="small" />
        ) : (
          <NotInterestedButton
            textStyle={{ color: theme.palette.linkGreen }}
            onPress={_onPress(bookState)}
          >
            I&apos;m Not Interested
          </NotInterestedButton>
        )}
        {notInterestedError ? (
          <Alert
            isOpen
            onDismiss={clearError}
            title="Error"
            customBody={<ErrorMessage>{notInterestedError}</ErrorMessage>}
            cancelText="Cancel"
          />
        ) : null}
      </Container>
    )
  },
)
