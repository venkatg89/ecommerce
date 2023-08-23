import React, { useEffect, useState, useCallback, useContext, useMemo } from 'react'
import { connect, MapStateToPropsParam } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { NavigationInjectedProps } from 'react-navigation'
import styled, { ThemeContext } from 'styled-components/native'

import Header from 'src/controls/navigation/Header'
import Button from 'src/controls/Button'
import CollectionListCta from 'src/components/CtaButtons/CollectionListCta'
import { Title, PublicIndicator, FilterBar } from 'src/controls/library/ListDisplayControls'
import BookGridList from 'src/components/BookGridList'
import ListEmptyState from 'src/controls/EmptyState/ListEmptyState'

import { push, Routes, Params, checkNavThenProps } from 'src/helpers/navigationService'
import { getContentContainerStyle, getContentContainerStyleWithAnchor, useResponsiveDimensions } from 'src/constants/layout'

import { CollectionModel, CollectionId, CollectionEditModel } from 'src/models/CollectionModel'
import { BookLocalFilterModel } from 'src/models/BookModel/BookLocalFilter'
import { BookListSortNames, BookListFormatNames } from 'src/models/MyBooks/BookListSortFilter'
import { ReadingStatus } from 'src/models/ReadingStatusModel'
import { Ean } from 'src/models/BookModel'
import { ListItemActionProps } from 'src/components/BookGridList/ListItem'

import { collectionSelector, isMyCollectionSelector, collectionBookListSelector } from 'src/redux/selectors/myBooks/collectionSelector'
import { updateCollectionAction } from 'src/redux/actions/collections/updateActions'
import { ThemeModel } from 'src/models/ThemeModel'

export const Container = styled.View`
  flex: 1;
`

export const HeaderContainer = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

export const AnchoredButton = styled(Button)``

export const Empty = styled.View<ListItemActionProps>``

export interface OwnProps {
  // If present - shows the collection specified.
  // If not present - shows My Library.
  collectionId?: string
  // Reading Statuses
  readingStatuses?: ReadingStatus[]
  // Title - shown if present
  title?: string
  // Start as list
  startAsList?: boolean
  withSearch?: boolean
}

interface StateProps {
  collection: CollectionModel
  isMyCollection?: boolean
  collectionBookList: any[]
}

const selector = createStructuredSelector({
  // What are we displaying (before filter, etc).
  collectionBookList: (state, props) => collectionBookListSelector(state, { collectionId: checkNavThenProps(Params.COLLECTION_ID, props) }),

  // If we're displaying a collection
  collection: (state, props) => collectionSelector(state, { collectionId: checkNavThenProps(Params.COLLECTION_ID, props) }),
  isMyCollection: (state, props) => isMyCollectionSelector(state, { collectionId: checkNavThenProps(Params.COLLECTION_ID, props) }),
})

interface DispatchProps {
  updateCollection: (collectionId: CollectionId, params: CollectionEditModel) => void;
}

const dispatcher = dispatch => ({
  updateCollection: (collectionId, params) => dispatch(updateCollectionAction(collectionId, params)),
})

const connector = connect<StateProps, DispatchProps, {}>(
  // selector typing with connect() - workaround for https://github.com/Microsoft/TypeScript/issues/29479
  selector as unknown as MapStateToPropsParam<StateProps, {}, {}>,
  dispatcher,
)

type Props = OwnProps & NavigationInjectedProps & StateProps & DispatchProps

const sortOptions = Object.values(BookListSortNames)
const disableSort = [BookListSortNames.DATE_PUBLISHED, BookListSortNames.DATE_FINISHED, BookListSortNames.RECENT]

const disableFilters = {
  bookStatus: [],
  format: [],
  sort: sortOptions.filter(option => disableSort.includes(option)),
}

const Library = (props: Props) => {
  const theme = useContext(ThemeContext) as ThemeModel
  const { width } = useResponsiveDimensions()
  const { collection, navigation, isMyCollection, collectionBookList, updateCollection } = props
  const [title, setTitle] = useState<string>(checkNavThenProps('title', props))
  const [sortingMethod, setSorting] = useState<BookListSortNames>(BookListSortNames.DATE_ADDED)
  const [isGrid, setGrid] = useState<boolean>(!checkNavThenProps('startAsList', props))
  const [count, setCount] = useState<number>(0)
  const [localFilter, setFilter] = useState<BookLocalFilterModel>({
    searchTerm: '',
    formatFilter: BookListFormatNames.ALL,
    readingStatuses: checkNavThenProps('readingStatuses', props) || [],
  })
  const isEditing = useMemo(() => navigation.getParam(Params.EDIT_MODE, false), [navigation.getParam(Params.EDIT_MODE)])

  useEffect(() => {
    if (collection) {
      navigation.setParams({ _collectionName: `${collection.name} ` })
    }
  }, [])

  useEffect(() => {
    const collectionName = collection ? collection.name : ''
    navigation.setParams({ _collectionName: `${collectionName}` })
    if (title !== collectionName) {
      setTitle(collectionName)
    }
  }, [collection])

  const setFilters = (sortOption, format, readingStatuses) => {
    setSorting(sortOption)
    setFilter({ ...localFilter, formatFilter: format, readingStatuses })
  }

  const toggleGrid = useCallback(() => {
    setGrid(!isGrid)
  }, [isGrid])

  const handleSetCount = (newCount) => {
    if (newCount !== count) {
      setCount(newCount)
    }
  }

  const anchoredButtonOnPress = useCallback(() => {
    if (isEditing) {
      navigation.setParams({ [Params.EDIT_MODE]: false })
    } else {
      const collectionId = navigation.getParam(Params.COLLECTION_ID)
      push(Routes.MY_BOOKS__ADD_TO_LIST, { [Params.COLLECTION_ID]: collectionId })
    }
  }, [isEditing])

  const sortByDate = useCallback((list) => {
    const sortedList = [...list]
    if (sortingMethod === BookListSortNames.DATE_ADDED) {
      sortedList.sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime())
    }
    return sortedList
  }, [sortingMethod, collectionBookList])

  const eans = sortByDate(collectionBookList).map(book => book.ean)

  const isPublic = collection ? (collection.public) : undefined

  const onRemove = useCallback((ean: Ean) => {
    const collectionId = navigation.getParam(Params.COLLECTION_ID)
    updateCollection(collectionId, ({ books: { [ean]: null } }))
  }, [])

  const contentContainerStyle = useMemo(() => (
    isMyCollection ? getContentContainerStyleWithAnchor(theme, width) : getContentContainerStyle(width)
  ), [theme, isMyCollection, width])

  const HeaderComponent = headerProps => (
    <HeaderContainer style={ headerProps.style }>
      { title &&
      <Title>{ title }</Title>
        }
      <PublicIndicator isPublic={ isPublic } />
      <FilterBar
        { ...headerProps }
        disableFormat
        isGrid={ isGrid }
        count={ count }
        currentSort={ sortingMethod }
        onToggleGrid={ toggleGrid }
        filterCallback={ setFilters }
        disabledFilters={ disableFilters }
        defaultSort={ BookListSortNames.DATE_ADDED }
      />
    </HeaderContainer>
  )
  return (
    <Container>
      <BookGridList
        isGrid={ isGrid }
        localFilter={ localFilter }
        sortBy={ sortingMethod }
        eans={ eans }
        HeaderComponent={ HeaderComponent }
        onCountUpdate={ handleSetCount }
        gridContentContainerStyle={ contentContainerStyle }
        listContentContainerStyle={ contentContainerStyle }
        ActionComponent={ Empty }
        onRemove={ isMyCollection && onRemove || undefined }
        emptyState={ <ListEmptyState title="This list is waiting for great reads." /> }
        isEditing={ isEditing }
      />
      { isMyCollection && (
        <AnchoredButton
          variant="contained"
          onPress={ anchoredButtonOnPress }
          isAnchor
        >
          { isEditing ? 'Done' : 'Add to this List' }
        </AnchoredButton>
      ) || undefined }
    </Container>
  )
}

Library.navigationOptions = ({ navigation }) => {
  const collectionName = navigation.getParam('_collectionName')
  const collectionId = navigation.getParam(Params.COLLECTION_ID)
  return ({
    title: collectionName,
    header: headerProps => (
      <Header
        headerProps={ headerProps }
        ctaComponent={ <CollectionListCta collectionId={ collectionId } /> }
      />
    ),
  })
}

export default connector(Library)
