import React, { useState, useEffect, useCallback, useContext, useMemo } from 'react'
import { NavigationInjectedProps } from 'react-navigation'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { ThemeContext } from 'styled-components/native'

import { Ean } from 'src/models/BookModel'
import { readingStatusListToEansSelector } from 'src/redux/selectors/myBooks/readingStatusSelector'
import { ReadingStatusListUpdate } from 'src/models/ReadingStatusModel'
import { getContentContainerStyleWithAnchor, useResponsiveDimensions } from 'src/constants/layout'

import { searchResultsApiStatusActions, clearSearchResultsAction } from 'src/redux/actions/legacySearch/searchResultsAction'
import { updateReadingStatusAction } from 'src/redux/actions/user/nodeProfileActions'

import Container from 'src/controls/layout/ScreenContainer'
import { HeaderContainer, TitleText, DescriptionText, UpdateButton, SearchContainer } from 'src/screens/myBooks/AddToList'
import Header from 'src/controls/navigation/Header'
import { pop, Params } from 'src/helpers/navigationService'
import countLabelText from 'src/helpers/countLabelText'
import { ThemeModel } from 'src/models/ThemeModel'

interface OwnProps extends NavigationInjectedProps {}

interface StateProps {
  listBookEans: Ean[]
}

interface DispatchProps {
  clearSearch: () => void
  updateReadingStatus: (params: ReadingStatusListUpdate) => void
}

const dispatcher = dispatch => ({
  clearSearch: () => {
    dispatch(clearSearchResultsAction())
    dispatch(searchResultsApiStatusActions().actions.clear)
  },
  updateReadingStatus: params => dispatch(updateReadingStatusAction(params)),
})

const selecotr = createStructuredSelector({
  listBookEans: (state, props) => {
    const readingStatus = props.navigation.getParam(Params.READING_STATUS)
    return readingStatusListToEansSelector(state, { readingStatus, isLocal: true })
  },
})

const connector = connect<StateProps, DispatchProps, OwnProps>(selecotr, dispatcher)

type Props = OwnProps & StateProps & DispatchProps

const AddToReadingStatusList = ({ navigation, listBookEans, clearSearch, updateReadingStatus }: Props) => {
  const theme = useContext(ThemeContext) as ThemeModel
  const { width } = useResponsiveDimensions()
  const readingStatus = navigation.getParam(Params.READING_STATUS)
  const title = navigation.getParam(Params.TITLE)
  const [selectedBookEans, setSelectedBookEans] = useState<Ean[]>(listBookEans)

  const onPressBook = useCallback((ean: Ean) => {
    if (selectedBookEans.includes(ean)) {
      setSelectedBookEans(selectedBookEans.filter(selectedEan => selectedEan !== ean))
      updateReadingStatus({ [ean]: { status: null } })
    } else {
      setSelectedBookEans([...selectedBookEans, ean])
      updateReadingStatus({ [ean]: { status: readingStatus } })
    }
  }, [selectedBookEans])

  useEffect(() => {
    navigation.setParams({ _addBookToList: onPressBook })
  }, [onPressBook])

  useEffect(() => () => clearSearch(), [])

  // get original collection, never update until component re-mount
  const originalListEans = useMemo(() => listBookEans, [])
  const newlyAdded = useMemo(() => selectedBookEans.filter(ean => !originalListEans.includes(ean)).length, [selectedBookEans, originalListEans])
  const buttonText = useMemo(() => (newlyAdded > 0 ? `Done (${countLabelText(newlyAdded, 'book', 'books')})` : 'Done'), [newlyAdded])

  const contentContainerStyle = useMemo(() => getContentContainerStyleWithAnchor(theme, width), [theme, width])

  return (
    <Container>
      <HeaderContainer currentWidth={ width }>
        <TitleText>{ `Add to ${title}` }</TitleText>
        <DescriptionText>Search for books to add to this list</DescriptionText>
      </HeaderContainer>
      <SearchContainer
        contentContainerStyle={ contentContainerStyle }
        selectedbookEans={ selectedBookEans }
        onSelectBook={ onPressBook }
      />
      <UpdateButton
        onPress={ pop }
        variant="contained"
        isAnchor
      >
        { buttonText }
      </UpdateButton>
    </Container>
  )
}


AddToReadingStatusList.navigationOptions = () => ({
  title: 'Search',
  header: headerProps => <Header headerProps={ headerProps } />,
})

export default connector(AddToReadingStatusList)
