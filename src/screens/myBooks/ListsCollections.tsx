import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Dimensions } from 'react-native'
import styled from 'styled-components/native'

import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { NavigationInjectedProps } from 'react-navigation'
import DeviceInfo from 'react-native-device-info'

import Routes from 'src/constants/routes'

import _Button from 'src/controls/Button'
import {
  CONTENT_HORIZONTAL_PADDING,
  useResponsiveDimensions,
} from 'src/constants/layout'
import ScrollContainer from 'src/controls/layout/ScrollContainer'
import Container from 'src/controls/layout/ScreenContainer'
import Section from 'src/controls/layout/Section'
import CtaButton from 'src/controls/layout/Section/CtaButton'
import CollectionEmptyState from 'src/controls/EmptyState/CollectionEmptyState'

import BookListSection from 'src/components/BookListSection'
import _BooksListCard from 'src/components/LegacyBookCarousel/MyBooksBookCarouselCard'
import BookListCard from 'src/components/Cards/BookListCard'

import countLabelText from 'src/helpers/countLabelText'

import { ReadingStatus } from 'src/models/ReadingStatusModel'
import { CollectionModel } from 'src/models/CollectionModel'

import {
  fetchNodeProfileForLocalUserAction,
  fetchNookLockerAction,
} from 'src/redux/actions/user/nodeProfileActions'

import {
  isBusyMyCollectionsSelector,
  myCollectionsSelector,
} from 'src/redux/selectors/myBooks/collectionSelector'
import {
  isBusyMyReadingStatusSelector,
  readingStatusListToEansSelector,
} from 'src/redux/selectors/myBooks/readingStatusSelector'
import { getMyProfileUidSelector } from 'src/redux/selectors/userSelector'

import { OwnProps as ListDisplayProps } from './ListDisplay'
import CreateListModal from 'src/components/LegacyAddBookToList/CreateListModal'
import { Ean } from 'src/models/BookModel'

const SCREEN_WIDTH = Dimensions.get('window').width

interface CollectionsProps {
  currentWidth: number
}

// The negative margins allow us to not use if-first if-last logic on the items themselves.
const Collections = styled.ScrollView<CollectionsProps>`
  margin-horizontal: ${({ currentWidth }) =>
    -CONTENT_HORIZONTAL_PADDING(currentWidth)};
`

const BooksListCard = styled(_BooksListCard)`
  /*
    https://github.com/facebook/react-native/issues/10049
    For inset shadow on element: when background: transparent, parent shadow props are passed to child elements.
  */
  /* background: transparent; */
`

const CreateListButton = styled(_Button)`
  border-color: ${({ theme }) => theme.palette.linkGreen};
  padding-vertical: ${({ theme }) => theme.spacing(2)}px;
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) =>
    theme.spacing(
      -1,
    )}; /* to account for the 8px border of the Reading section's inset shadow */
  shadow-offset: 0px 0px;
  shadow-color: black;
  shadow-radius: 5px;
  shadow-opacity: 0.18;
  width: 232;
  ${!DeviceInfo.isTablet && `width: ${SCREEN_WIDTH * 0.62};`}
`

const ButtonText = styled.Text`
  text-transform: uppercase;
  color: ${({ theme }) => theme.palette.linkGreen};
`

interface StateProps {
  isBusy: boolean
  collectionsList: CollectionModel[]
  reading: Ean[]
  wantToRead: Ean[]
  read: Ean[]
}

const selector = createStructuredSelector({
  myProfileUid: getMyProfileUidSelector,
  isBusy: (state) =>
    isBusyMyReadingStatusSelector(state) || isBusyMyCollectionsSelector(state),
  collectionsList: myCollectionsSelector,
  reading: (state) =>
    readingStatusListToEansSelector(state, {
      isLocal: true,
      readingStatus: ReadingStatus.READING,
    }),
  wantToRead: (state) =>
    readingStatusListToEansSelector(state, {
      isLocal: true,
      readingStatus: ReadingStatus.TO_BE_READ,
    }),
  read: (state) =>
    readingStatusListToEansSelector(state, {
      isLocal: true,
      readingStatus: ReadingStatus.FINISHED,
    }),
})

interface DispatchProps {
  refresh: () => void
}

const dispatcher = (dispatch) => ({
  refresh: () => {
    dispatch(fetchNodeProfileForLocalUserAction())
    // dispatch(fetchCollectionsForLocalUserAction())
    dispatch(fetchNookLockerAction())
  },
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = NavigationInjectedProps & StateProps & DispatchProps

const Lists = (props: Props) => {
  const { width } = useResponsiveDimensions()

  const contentContainerStyle = useMemo(
    () => ({
      paddingHorizontal: CONTENT_HORIZONTAL_PADDING(width),
    }),
    [width],
  )

  const {
    isBusy,
    reading,
    wantToRead,
    read,
    collectionsList,
    refresh,
    navigation,
  } = props
  const [isCreateListModalOpen, openListModal] = useState<boolean>(false)
  useEffect(() => {
    refresh()
  }, [])

  const pushLibraryBookListView = (
    title: string,
    status: ReadingStatus,
  ) => () => {
    const navParams = {
      title,
      readingStatus: status,
    }
    navigation.navigate(Routes.MY_BOOKS__READING_STATUS_LIST, navParams)
  }

  const pushReadingStatusBookAddView = (
    title: string,
    status: ReadingStatus,
  ) => () => {
    const navParams = {
      title,
      readingStatus: status,
    }
    navigation.navigate(Routes.MY_BOOK__ADD_TO_READING_STATUS, navParams)
  }

  const pushCollectionBookListView = (collectionId: string, title: string) => {
    const navParams: ListDisplayProps = { title, collectionId }
    navigation.navigate(Routes.MY_BOOKS__LIST, navParams)
  }
  const pushSelectedCollectionBookListView = (
    collectionId: string,
    title: string,
  ) => () => {
    pushCollectionBookListView(collectionId, title)
  }

  const pushAllListView = () => {
    navigation.navigate(Routes.MY_BOOKS__COLLECTIONS_LIST)
  }

  const toggleListModal = useCallback(
    (isOpen: boolean) => () => {
      openListModal(isOpen)
    },
    [isCreateListModalOpen],
  )

  const bookCountLabel = (books) => {
    if (Object.keys(books).length < 1) {
      return 'No books'
    }
    return countLabelText(Object.keys(books || {}).length, 'book', 'books')
  }

  const renderCollectionLists = useMemo(() => {
    if (collectionsList.length === 0) {
      return (
        <CollectionEmptyState
          errorText1="You haven’t created any lists yet."
          errorText2="Create a new list and start to save, organize, and share your favorite books."
        />
      )
    }
    return (
      <Collections
        currentWidth={width}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={contentContainerStyle}
      >
        {collectionsList.map((e, index) => (
          <BookListCard
            key={e.id}
            title={e.name}
            details={bookCountLabel(e.books)}
            eans={Object.keys(e.books || {}).slice(0, 6)}
            onSeeFullList={pushSelectedCollectionBookListView(e.id, e.name)}
            last={index === collectionsList.length - 1}
            isPrivate={e.public === false}
          />
        ))}
      </Collections>
    )
  }, [JSON.stringify(collectionsList)])

  return (
    <Container>
      <ScrollContainer refreshing={isBusy} onRefresh={refresh}>
        <Section
          onPress={pushAllListView}
          title="Created Lists"
          ctaButton={
            <>
              {collectionsList.length > 0 && (
                <CtaButton
                  title={`See All (${collectionsList.length})`}
                  onPress={pushAllListView}
                />
              )}
            </>
          }
        >
          {renderCollectionLists}
          <CreateListButton
            variant="outlined"
            onPress={toggleListModal(true)}
            center
          >
            <ButtonText>Create a new List</ButtonText>
          </CreateListButton>
          <CreateListModal
            isOpen={isCreateListModalOpen}
            onDismiss={toggleListModal(false)}
            onSuccess={pushCollectionBookListView}
          />
        </Section>

        <Section>
          <BooksListCard
            eans={reading}
            title="Reading"
            totalBooks={reading.length}
            onSeeFullList={pushLibraryBookListView(
              'Reading',
              ReadingStatus.READING,
            )}
            bookMaxHeight={132}
            bookMaxWidth={96}
            onAddToList={pushReadingStatusBookAddView(
              'Reading',
              ReadingStatus.READING,
            )}
          />
        </Section>

        <BookListSection
          title="To Be Read"
          eans={wantToRead}
          onPressSeeAll={pushLibraryBookListView(
            'To Be Read',
            ReadingStatus.TO_BE_READ,
          )}
          errorText1="You haven’t added anything to your ‘To Be Read’ list."
          errorText2="Search for books of interest and tap the button below to see them here."
          emptyButtonText="add your next read"
          onAddToList={pushReadingStatusBookAddView(
            'To Be Read',
            ReadingStatus.TO_BE_READ,
          )}
        />

        <BookListSection
          title="Finished"
          eans={read}
          onPressSeeAll={pushLibraryBookListView(
            'Finished',
            ReadingStatus.FINISHED,
          )}
          errorText1="You don’t have anything in your Finished list."
          errorText2="Search for books you've read and tap the button below to see them here."
          emptyButtonText="add finished books"
          onAddToList={pushReadingStatusBookAddView(
            'Finished',
            ReadingStatus.FINISHED,
          )}
        />
      </ScrollContainer>
    </Container>
  )
}

Lists.navigationOptions = () => ({
  title: 'Lists',
})

export default connector(Lists)
