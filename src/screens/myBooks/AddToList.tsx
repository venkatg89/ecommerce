import React, { useState, useEffect, useMemo, useCallback, useContext } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { NavigationInjectedProps } from 'react-navigation'
import styled, { ThemeContext } from 'styled-components/native'

import Container from 'src/controls/layout/ScreenContainer'
import Button from 'src/controls/Button'
import Header from 'src/controls/navigation/Header'
import _SearchContainer from 'src/components/MyBooks/SearchContainer'

import { pop, Params } from 'src/helpers/navigationService'
import { Ean } from 'src/models/BookModel'
import { CollectionId, CollectionModel, CollectionEditModel } from 'src/models/CollectionModel'
import { getScrollVerticalPadding, getScrollHorizontalPadding, getContentContainerStyleWithAnchor, useResponsiveDimensions } from 'src/constants/layout'
import countLabelText from 'src/helpers/countLabelText'

import { updateCollectionAction } from 'src/redux/actions/collections/updateActions'
import { collectionSelector, collectionBookEanSelector } from 'src/redux/selectors/myBooks/collectionSelector'
import { ThemeModel } from 'src/models/ThemeModel'

interface ContainerProps {
  currentWidth: number
}

export const HeaderContainer = styled.View<ContainerProps>`
  margin-top: ${({ theme }) => getScrollVerticalPadding(theme)};
  margin-horizontal: ${({ theme, currentWidth }) => getScrollHorizontalPadding(theme, currentWidth)};
`

export const SearchContainer = styled(_SearchContainer)`
  margin-top: ${({ theme }) => theme.spacing(2)};
`

export const TitleText = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
`

export const DescriptionText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
`

export const UpdateButton = styled(Button)``

interface StateProps {
  collection: CollectionModel;
  collectionBookEans: Ean[];
}

const selector = createStructuredSelector({
  collection: (state, ownProps) => {
    const collectionId = ownProps.navigation.getParam(Params.COLLECTION_ID)
    return collectionSelector(state, { collectionId })
  },
  collectionBookEans: (state, ownProps) => {
    const collectionId = ownProps.navigation.getParam(Params.COLLECTION_ID)
    return collectionBookEanSelector(state, { collectionId })
  },
})

interface DispatchProps {
  updateCollection: (collecitonId: CollectionId, params: CollectionEditModel) => void;
}

const dispatcher = dispatch => ({
  updateCollection: (collectionId, params) => dispatch(updateCollectionAction(collectionId, params)),
})

const connector = connect<StateProps, DispatchProps, StateProps>(selector, dispatcher)

type Props = StateProps & DispatchProps & NavigationInjectedProps

const AddToListScreen = ({ navigation, collection, collectionBookEans, updateCollection }: Props) => {
  const theme = useContext(ThemeContext) as ThemeModel
  const { width } = useResponsiveDimensions()
  const collectionId = useMemo(() => navigation.getParam(Params.COLLECTION_ID), [])

  const [selectedBookEansState, setSelectedBookEansState] = useState<Ean[]>(collectionBookEans)

  const onPressBook = useCallback((ean: Ean) => {
    if (selectedBookEansState.includes(ean)) {
      setSelectedBookEansState(selectedBookEansState.filter(selectedEan => selectedEan !== ean))
      updateCollection(collectionId, ({ books: { [ean]: null } }))
    } else {
      setSelectedBookEansState([...selectedBookEansState, ean])
      updateCollection(collectionId, ({ books: { [ean]: {} } }))
    }
  }, [selectedBookEansState])

  useEffect(() => {
    navigation.setParams({ _addBookToList: onPressBook })
  }, [onPressBook])

  // get original collection, never update until component re-mount
  const originalCollectionEans = useMemo(() => collectionBookEans, [])

  const contentContainerStyle = useMemo(() => getContentContainerStyleWithAnchor(theme, width), [theme, width])
  const newlyAdded = useMemo(() => selectedBookEansState.filter(ean => !originalCollectionEans.includes(ean)).length, [selectedBookEansState, originalCollectionEans])

  const buttonText = useMemo(() => (newlyAdded > 0 ? `Done (${countLabelText(newlyAdded, 'book', 'books')})` : 'Done'), [newlyAdded])
  return (
    <Container>
      <HeaderContainer currentWidth={ width }>
        <TitleText>{ `Add to ${collection.name}` }</TitleText>
        <DescriptionText>Search for books to add to this list</DescriptionText>
      </HeaderContainer>
      <SearchContainer
        contentContainerStyle={ contentContainerStyle }
        selectedbookEans={ selectedBookEansState }
        onSelectBook={ onPressBook }
      />
      <UpdateButton
        onPress={ pop }
        variant="contained"
        isAnchor
      >
        {buttonText}
      </UpdateButton>
    </Container>
  )
}

AddToListScreen.navigationOptions = () => ({
  title: 'Search',
  header: headerProps => <Header headerProps={ headerProps } />,
})

export default connector(AddToListScreen)
