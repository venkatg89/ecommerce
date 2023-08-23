import React, { Fragment } from 'react'
import { Dimensions, StyleSheet, FlatList, StyleProp, ViewStyle, Platform } from 'react-native'
import styled, { withTheme } from 'styled-components/native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import LoadingIndicator from 'src/controls/progress/LoadingIndicator'
import { CONTENT_HORIZONTAL_PADDING } from 'src/constants/layout'

import { Ean, BookOrEan, asEan } from 'src/models/BookModel'
import { BookLocalFilterModel } from 'src/models/BookModel/BookLocalFilter'
import { ReadingStatusListItem } from 'src/models/ReadingStatusModel'
import { ThemeModel } from 'src/models/ThemeModel'

import { fetchBooksAction } from 'src/redux/actions/book/bookAction'

import fetchUnloadedBooks from 'src/helpers/fetchUnloadedBooks'

import { bookOrEanLocalFilterSelector } from 'src/redux/selectors/booksListSelector'
import { myLibraryBooksAsDictSelector } from 'src/redux/selectors/myBooks/readingStatusSelector'
import { fetchingBooksApiStatus } from 'src/redux/selectors/apiStatus/books'

import GridItem from './GridItem'
import ListItem, { ListItemActionProps } from './ListItem'
import { BookListSortNames } from 'src/models/MyBooks/BookListSortFilter'

const MIN_BOOK_WIDTH = 130
// const USUAL_ASPECT_RATIO = 1.8 // Taken over a few book examples on bn.com ....
const USUAL_ASPECT_RATIO = 1.43
const GRID_SPACING_HORIZONTAL = 24 // margin between 2 side-by-side items
const GRID_SPACING_VERTICAL = 24 // margin between 2 rows

const Container = styled.View`
  flex: 1;
  justify-content: flex-end;
`

const currentStyles = StyleSheet.create({
  row: {
    paddingHorizontal: GRID_SPACING_HORIZONTAL / 3,
  },
})

const ListSpacing = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const HeaderLoadingIndicator = styled(LoadingIndicator)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`
const styles = StyleSheet.create({
  emptyHeader: {
    padding: 16,
  },
})

interface OwnProps{
  eans: Ean[],
  HeaderComponent?: any
  isGrid?: boolean,
  localFilter?: BookLocalFilterModel
  sortBy?: BookListSortNames
  showLibraryStatus?: boolean
  listContentContainerStyle?: StyleProp<ViewStyle>
  gridContentContainerStyle?: StyleProp<ViewStyle>
  ActionComponent?: React.ComponentType<ListItemActionProps>
  onRemove?: (ean: Ean) => void
  onActionPress?: (ean: Ean) => void
  onCountUpdate?: (count: number) => void
  fetching?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
  style?: any
  actionedBookList?: Ean[]
  emptyState?: React.ReactNode
  isEditing?: boolean
}

interface StateProps {
  bookOrEanList: BookOrEan[]
  libraryBooks: Record<Ean, ReadingStatusListItem>
  booksFetching: boolean
}

interface State {
  viewWidth: number
  nColumns: number
  itemWidth: number
  listViewKey: number
  currentWidth: number
}

type ThemeProps = {
  theme: ThemeModel
}

const selector = createStructuredSelector({
  bookOrEanList: bookOrEanLocalFilterSelector, // TODO: use Id
  libraryBooks: myLibraryBooksAsDictSelector,
  booksFetching: (state, props) => {
    const booksOrEans = bookOrEanLocalFilterSelector(state, props)
    return fetchingBooksApiStatus(state, { booksOrEans })
  },
})

interface DispatchProps {
  fetchBooksAction(eans: Ean[])
}

const dispatcher = dispatch => ({
  fetchBooksAction: (eans: Ean[]) => dispatch(fetchBooksAction(eans)),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(selector, dispatcher)

type Props = OwnProps & StateProps & DispatchProps & ThemeProps

// TODO: change to functional component and get currentWidth from useResponsiveDimensions
class BookGrid extends React.PureComponent<Props, State> {
  state = {
    viewWidth: 0,
    nColumns: 1,
    itemWidth: 100,
    listViewKey: 0,
    currentWidth: Dimensions.get('screen').width,
  }

  componentDidMount() {
    fetchUnloadedBooks(this.props.bookOrEanList, this.props.fetchBooksAction)
  }

  componentDidUpdate() {
    fetchUnloadedBooks(this.props.bookOrEanList, this.props.fetchBooksAction)
  }

  onLayout(event) {
    const { currentWidth } = this.state
    const viewWidth = Dimensions.get('window').width
    if (viewWidth === this.state.viewWidth) {
      return // no changes to process
    }
    const viewWidthMargingToMargin = viewWidth - (CONTENT_HORIZONTAL_PADDING(currentWidth) * 2) - (GRID_SPACING_HORIZONTAL / 3 * 2)
    // how many columns will fit?
    const nColumns = Math.floor(viewWidthMargingToMargin / MIN_BOOK_WIDTH)
    // Expand each item to fill the rest of the space, given n columns
    const itemWidth = (viewWidthMargingToMargin - (nColumns - 1) * GRID_SPACING_HORIZONTAL) / nColumns // width of each of nColumns item, and (nColumns-1) spaces in between
    // Workaround for https://github.com/facebook/react-native/issues/15944
    const newListKeyNeeded = this.state.nColumns !== nColumns || this.state.listViewKey === 0

    this.setState(prevState => ({
      itemWidth,
      nColumns,
      listViewKey: prevState.listViewKey + (newListKeyNeeded ? 1 : 0),
    }))
  }

  keyExtractor = item => asEan(item)

  renderGridItem = ({ item }) => {
    const { ActionComponent, showLibraryStatus, libraryBooks, isEditing, onRemove } = this.props
    const { itemWidth } = this.state
    return (
      <GridItem
        bookOrEan={ item }
        width={ itemWidth }
        height={ itemWidth * USUAL_ASPECT_RATIO }
        gridSpacingHorizontal={ GRID_SPACING_HORIZONTAL }
        gridSpacingVertical={ GRID_SPACING_VERTICAL }
        libraryBook={ showLibraryStatus ? libraryBooks[asEan(item)] : undefined }
        ActionComponent={ ActionComponent }
        onRemove={ onRemove }
        isEditing={ isEditing }
      />
    )
  }

  renderListItem = ({ item }) => {
    const { ActionComponent, actionedBookList, onActionPress, onRemove, isEditing } = this.props
    return (
      <ListItem
        bookOrEan={ item }
        isActioned={ actionedBookList && !!actionedBookList.includes(asEan(item)) }
        ActionComponent={ ActionComponent }
        onActionPress={ onActionPress }
        onRemove={ onRemove }
        isEditing={ isEditing }
      />
    )
  }

  render() {
    const {
      bookOrEanList, fetching, onRefresh, onEndReached, onCountUpdate, isGrid, HeaderComponent,
      gridContentContainerStyle, listContentContainerStyle, style, emptyState, booksFetching,
    } = this.props

    const { nColumns, listViewKey } = this.state
    const skippingFirstListViewRender = listViewKey === 0

    if (onCountUpdate) {
      setTimeout(() => onCountUpdate(Array.isArray(bookOrEanList) ? bookOrEanList.length : 0), 0)
    }

    // FlatList's `key={ listViewKey }` is a workaround for this issue:
    // https://github.com/facebook/react-native/issues/15944
    // It re-renders a new FlatList every time nColumns changes, as the FlatList
    // by itself is not able to accomodate
    const refreshing = Platform.select({ ios: bookOrEanList.length > 0 && !!fetching, android: !!fetching })

    if (bookOrEanList.length < 1 && !fetching && emptyState) {
      return (
        <>
          {HeaderComponent &&
            <HeaderComponent style={ styles.emptyHeader } />
          }
          {emptyState}
        </>
      )
    }

    return (
      <Container onLayout={ event => this.onLayout(event) }>
        { !skippingFirstListViewRender && (
          isGrid ? (
            <FlatList
              style={ style }
              refreshing={ refreshing }
            // @ts-ignore - React Navite defs don't support read-only
              ListFooterComponent={ (
                <>
                  {Platform.OS === 'ios' && <LoadingIndicator isLoading={ !!fetching } />}
                </>
            ) }
              data={ bookOrEanList }
              key={ `${listViewKey}` }
              keyExtractor={ this.keyExtractor }
              numColumns={ nColumns }
              ListHeaderComponent={ (
                <>
                  {HeaderComponent ? (
                    <>
                      <HeaderComponent isBusy={ booksFetching } />
                      <HeaderLoadingIndicator isLoading={ booksFetching } />
                    </>
                  ) : <Fragment />
                  }
                </>
              ) }
              columnWrapperStyle={ nColumns > 1 && currentStyles.row }
              contentContainerStyle={ gridContentContainerStyle }
              renderItem={ this.renderGridItem }
            />
          ) : (
            <FlatList
              style={ style }
              data={ bookOrEanList }
              keyExtractor={ this.keyExtractor }
              refreshing={ refreshing }
              onRefresh={ onRefresh }
              onEndReached={ onEndReached }
              ListHeaderComponent={ (
                <>
                  {HeaderComponent ? (
                    <>
                      <HeaderComponent isBusy={ booksFetching } />
                      <HeaderLoadingIndicator isLoading={ booksFetching } />
                    </>
                  ) : <Fragment />
                }
                </>
              ) }
              ListFooterComponent={ (
                <>
                  {Platform.OS === 'ios' && <LoadingIndicator isLoading={ !!fetching } />}
                </>
              ) }
              contentContainerStyle={ listContentContainerStyle }
              renderItem={ this.renderListItem }
              ItemSeparatorComponent={ ListSpacing }
            />
          )
        ) }
      </Container>
    )
  }
}

export default withTheme(connector(BookGrid))
