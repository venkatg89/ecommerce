import React, { useState, useCallback, useMemo, useContext } from 'react'
import { NavigationInjectedProps } from 'react-navigation'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { ThemeContext } from 'styled-components/native'

import { ReadingStatusBook, Ean } from 'src/models/BookModel'
import { getReadingStatusPrivacy, getMyProfileUidSelector } from 'src/redux/selectors/userSelector'
import { getMyBooksEanByReadingStatus } from 'src/redux/selectors/myBooks/readingStatusSelector'
import { BookListSortNames, BookListFormatNames } from 'src/models/MyBooks/BookListSortFilter'
import { BookLocalFilterModel } from 'src/models/BookModel/BookLocalFilter'
import { ReadingStatusListUpdate } from 'src/models/ReadingStatusModel'

import { checkNav } from 'src/helpers/navigationService'
import Routes, { Params } from 'src/constants/routes'
import { updateReadingStatusAction } from 'src/redux/actions/user/nodeProfileActions'

import Header from 'src/controls/navigation/Header'
import ReadingStatusListCta from 'src/components/CtaButtons/ReadingStatusListCta'
import { Title, PublicIndicator, FilterBar } from 'src/controls/library/ListDisplayControls'
import BookGridList from 'src/components/BookGridList'
import { Container, HeaderContainer, AnchoredButton, Empty } from 'src/screens/myBooks/ListDisplay'
import ListEmptyState from 'src/controls/EmptyState/ListEmptyState'
import { getContentContainerStyle, getContentContainerStyleWithAnchor, useResponsiveDimensions } from 'src/constants/layout'
import { ThemeModel } from 'src/models/ThemeModel'

const navMilqUserId = props => checkNav(Params.MILQ_MEMBER_UID, props)
const checkIsOwnProfile = props => props.myProfileUid === navMilqUserId(props) || !navMilqUserId(props)

interface OwnProps extends NavigationInjectedProps {
}

interface StateProps {
  isPublic: boolean
  readingStatusList: ReadingStatusBook[]
}

const selector = createStructuredSelector({
  myProfileUid: getMyProfileUidSelector,
  isPublic: (state, ownProps) => {
    const props = ownProps as OwnProps
    const readingStatus = props.navigation.getParam(Params.READING_STATUS)
    return getReadingStatusPrivacy(state, { readingStatus, isLocal: checkIsOwnProfile(props) })
  },
  readingStatusList: (state, ownProps) => {
    const props = ownProps as OwnProps
    const readingStatus = props.navigation.getParam(Params.READING_STATUS)
    return getMyBooksEanByReadingStatus(state, { readingStatus, milqId: navMilqUserId(props), isLocal: checkIsOwnProfile(props) })
  },
})

interface DispatchProps {
  updateReadingStatus: (params: ReadingStatusListUpdate) => void;
}

const dispatcher = dispatch => ({
  updateReadingStatus: params => dispatch(updateReadingStatusAction(params)),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = OwnProps & DispatchProps & StateProps

const sortOptions = Object.values(BookListSortNames)
const disableSort = [BookListSortNames.DATE_PUBLISHED, BookListSortNames.DATE_FINISHED, BookListSortNames.RECENT]

const disableFilters = {
  bookStatus: [],
  format: [],
  sort: sortOptions.filter(option => disableSort.includes(option)),
}

const ReadingStatusList = (props: Props) => {
  const { width } = useResponsiveDimensions()
  const { navigation, isPublic, readingStatusList, updateReadingStatus } = props
  const [isGrid, setGrid] = useState<boolean>(true)
  const [count, setCount] = useState<number>(0)
  const [sort, setSort] = useState<BookListSortNames>(BookListSortNames.DATE_ADDED)
  const [localFilter, setFilter] = useState<BookLocalFilterModel>({
    formatFilter: BookListFormatNames.ALL,
    searchTerm: '',
    readingStatuses: [],
  })
  const isEditing = useMemo(() => navigation.getParam(Params.EDIT_MODE, false), [navigation.getParam(Params.EDIT_MODE)])

  const title = navigation.getParam(Params.TITLE)
  const theme = useContext(ThemeContext) as ThemeModel
  const handleUpdateCount = (newCount) => {
    if (newCount !== count) {setCount(newCount)}
  }
  const toggleGrid = useCallback(() => {
    setGrid(!isGrid)
  }, [isGrid])
  const toggleFitler = useCallback((sortOption, filter) => {
    setSort(sortOption)
    setFilter({ ...localFilter, formatFilter: filter })
  }, [sort, localFilter.formatFilter])

  const anchoredButtonOnPress = useCallback(() => {
    if (isEditing) {
      navigation.setParams({ [Params.EDIT_MODE]: false })
    } else {
      const navParams = {
        title,
        readingStatus: navigation.getParam(Params.READING_STATUS),
      }
      navigation.navigate(Routes.MY_BOOK__ADD_TO_READING_STATUS, navParams)
    }
  }, [isEditing])

  const sortByDate = useCallback((list: ReadingStatusBook[]) => {
    const sortedList = [...list]
    switch (sort) {
      case BookListSortNames.DATE_ADDED:
        return sortedList.sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime())
      case BookListSortNames.RECENT:
        return sortedList.sort((a, b) => new Date(b.changeDate).getTime() - new Date(a.changeDate).getTime())
      default:
        return sortedList
    }
  }, [readingStatusList.length, sort])

  const onRemove = useCallback((ean: Ean) => {
    updateReadingStatus({ [ean]: { status: null } })
  }, [])

  const contentContainerStyle = useMemo(() => (
    checkIsOwnProfile(props) ? getContentContainerStyleWithAnchor(theme, width) : getContentContainerStyle(width)
  ), [theme, checkIsOwnProfile(props), width])

  const eans = sortByDate(readingStatusList).map(book => book.ean)
  const HeaderComponent = headerProps => (
    <HeaderContainer style={ headerProps.style }>
      <Title>{title}</Title>
      <PublicIndicator isPublic={ isPublic } />
      <FilterBar
        { ...headerProps }
        disableFormat
        disableStatus
        isGrid={ isGrid }
        count={ count }
        onToggleGrid={ toggleGrid }
        filterCallback={ toggleFitler }
        currentSort={ sort }
        currentFormat={ localFilter.formatFilter }
        disabledFilters={ disableFilters }
        defaultSort={ BookListSortNames.DATE_ADDED }
      />
    </HeaderContainer>
  )

  return (
    <Container>
      <BookGridList
        localFilter={ localFilter }
        sortBy={ sort }
        isGrid={ isGrid }
        showLibraryStatus={ false }
        HeaderComponent={ HeaderComponent }
        eans={ eans }
        onCountUpdate={ handleUpdateCount }
        gridContentContainerStyle={ contentContainerStyle }
        listContentContainerStyle={ contentContainerStyle }
        ActionComponent={ Empty }
        onRemove={ checkIsOwnProfile(props) && onRemove || undefined }
        emptyState={ <ListEmptyState /> }
        isEditing={ isEditing }
      />

      {checkIsOwnProfile(props) && (
        <AnchoredButton
          variant="contained"
          onPress={ anchoredButtonOnPress }
          isAnchor
        >
          { isEditing ? 'Done' : 'Add To this List' }
        </AnchoredButton>
      )}
    </Container>
  )
}

ReadingStatusList.navigationOptions = (props) => {
  const { navigation } = props
  const readingStatus = navigation.getParam('readingStatus')
  const title = navigation.getParam('title')
  return ({
    title,
    header: headerProps => (
      <Header
        headerProps={ headerProps }
        ctaComponent={ checkIsOwnProfile(props) && <ReadingStatusListCta readingStatus={ readingStatus } /> }
      />
    ),
  })
}

export default connector(ReadingStatusList)
