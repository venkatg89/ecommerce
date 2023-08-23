import React, { useState, useCallback, useMemo } from 'react'
import styled from 'styled-components/native'
import { connect } from 'react-redux'
import { NavigationEvents, ScrollView } from 'react-navigation'
import { createStructuredSelector } from 'reselect'

import { fetchNookLockerAction } from 'src/redux/actions/user/nodeProfileActions'

import { NookListItem } from 'src/models/BookModel'
import { ReadingStatus } from 'src/models/ReadingStatusModel'

import { RequestStatus } from 'src/models/ApiStatus'
import { nookEansSelector } from 'src/redux/selectors/booksListSelector'
import { nookLockerApiRequestStatusSelector } from 'src/redux/selectors/apiStatus/user'

import ScreenContainer from 'src/controls/layout/ScreenContainer'
import SearchInput from 'src/controls/form/SearchInput'
import { FilterBar } from 'src/controls/library/ListDisplayControls'
import BookGridList from 'src/components/BookGridList'
import _AddToListButton from 'src/components/LegacyAddBookToList/Button'

import { CONTENT_HORIZONTAL_PADDING, CONTENT_VERTICAL_PADDING, useResponsiveDimensions } from 'src/constants/layout'
import { BookListFormatNames, BookListSortNames } from 'src/models/MyBooks/BookListSortFilter'

import Images from 'assets/images'

const HeaderContainer = styled.View`
`

const EmptyContainer = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing(4)};
  flex: 1;
  padding-top: ${({ theme }) => theme.spacing(4)};
  align-items: center;
`

const EmptyHeader = styled.Text`
  text-align: center;
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const EmptyBody = styled.Text`
  text-align: center;
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
`

const EmptyImage = styled.Image`
  width: 183;
  height: 183;
`

interface ListButtonProps {
  isGrid?: boolean
}

const AddToListButton = styled(_AddToListButton)<ListButtonProps>`
  padding: 6px;
  margin-top: ${({ isGrid }) => (isGrid ? 10 : 0)};
`


interface OwnProps{}
interface StateProps {
  nookLibrary: NookListItem[]
  nookLockerApiStatus: Nullable<RequestStatus>
}

const selector = createStructuredSelector({
  nookLibrary: nookEansSelector,
  nookLockerApiStatus: nookLockerApiRequestStatusSelector,
})

interface DispatchProps {
  fetchNookLibrary: () => void
}

const dispatcher = dispatch => ({
  fetchNookLibrary: () => dispatch(fetchNookLockerAction()),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = OwnProps & StateProps & DispatchProps

interface FilterState {
  format: BookListFormatNames
  sort: BookListSortNames
  readingStatuses: ReadingStatus[]
}

const sortOptions = Object.values(BookListSortNames)
const availableSort = [BookListSortNames.DATE_ADDED, BookListSortNames.TITLE, BookListSortNames.AUTHOR, BookListSortNames.RECENT]
const disabledSortOptions = sortOptions.filter(option => availableSort.indexOf(option) < 0)

const disabledFilters = {
  sort: disabledSortOptions,
  bookStatus: [],
  format: [],
}


const NookLibrary = ({ fetchNookLibrary, nookLibrary, nookLockerApiStatus }: Props) => {
  const { width } = useResponsiveDimensions()

  const styles = useMemo(() => ({
    grid: {
      paddingHorizontal: CONTENT_HORIZONTAL_PADDING(width),
      paddingVertical: CONTENT_VERTICAL_PADDING,
    },
    list: {
      paddingHorizontal: CONTENT_HORIZONTAL_PADDING(width),
      paddingVertical: CONTENT_VERTICAL_PADDING,
    },
  }), [width])

  const [search, setSearch] = useState<string>('')
  const [isGrid, setGrid] = useState<boolean>(true)
  const [count, setCount] = useState<number>(0)
  const [filter, setFilter] = useState<FilterState>({
    format: BookListFormatNames.ALL,
    sort: BookListSortNames.RECENT,
    readingStatuses: [],
  })

  const resetSearch = () => setSearch('')
  const toggleGird = () => setGrid(!isGrid)
  const updateCount = (newCount) => {
    if (newCount !== count) {setCount(newCount)}
  }

  const filterCallback = useCallback((sort, format, bookStatus) => {
    setFilter({ sort, format, readingStatuses: bookStatus })
  }, [])


  const handleChangeText = useCallback((text) => {
    setSearch(text)
  }, [search])

  const localFilter = {
    searchTerm: search,
    formatFilter: filter.format,
    readingStatuses: filter.readingStatuses,
  }
  const fetching = nookLockerApiStatus === RequestStatus.FETCHING

  const renderActionComponent = useCallback(props => <AddToListButton { ...props } size="small" isGrid={ isGrid } />, [])

  const sortByDate = useCallback((list: NookListItem[]) => {
    const sortedList = [...list]
    const { sort } = filter
    switch (sort) {
      case BookListSortNames.RECENT:
        return sortedList.sort((a, b) => new Date(b.changeDate).getTime() - new Date(a.changeDate).getTime())
      case BookListSortNames.DATE_ADDED:
        return sortedList.sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime())
      default:
        return sortedList
    }
  }, [nookLibrary, filter.sort])

  const nookEans = sortByDate(nookLibrary).map(book => book.ean)

  return (
    <ScreenContainer>
      <NavigationEvents onDidFocus={ fetchNookLibrary } />
      <HeaderContainer style={ styles.grid }>
        <SearchInput
          value={ search }
          onChange={ handleChangeText }
          onReset={ resetSearch }
          placeholder="Search your books"
          noScanner
        />
        <FilterBar
          isGrid={ isGrid }
          count={ count }
          onToggleGrid={ toggleGird }
          filterCallback={ filterCallback }
          disabledFilters={ disabledFilters }
          currentFormat={ filter.format }
          currentSort={ filter.sort }
        />
      </HeaderContainer>

      <BookGridList
        sortBy={ filter.sort }
        localFilter={ localFilter }
        fetching={ fetching }
        isGrid={ isGrid }
        eans={ nookEans }
        showLibraryStatus
        onCountUpdate={ updateCount }
        gridContentContainerStyle={ styles.grid }
        listContentContainerStyle={ styles.list }
        ActionComponent={ renderActionComponent }
        emptyState={ (
          <ScrollView>
            <EmptyContainer>
              <EmptyImage source={ Images.bookShelf } />
              <EmptyHeader>There are no books in your library.</EmptyHeader>
              <EmptyBody>Books cannot be purchased directly from the B&N app. Audiobooks and eBooks you’ve purchased from Barnes & Noble or from a NOOK device will be shown here.</EmptyBody>
            </EmptyContainer>
          </ScrollView>
          ) }
      />
    </ScreenContainer>

  )
}

export default connector(NookLibrary)
