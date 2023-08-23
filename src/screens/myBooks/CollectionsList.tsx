import React, { useEffect, useState, useCallback, useMemo, useContext } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { NavigationInjectedProps } from 'react-navigation'
import styled, { ThemeContext } from 'styled-components/native'

import Container from 'src/controls/layout/ScreenContainer'
import Header from 'src/controls/navigation/Header'
import CollectionsList from 'src/components/CollectionsList'
import Button from 'src/controls/Button'
import CollectionsFilterbar from 'src/controls/library/CollectionsFilterbar'
import CreateListModal from 'src/components/LegacyAddBookToList/CreateListModal'
import ListEmptyState from 'src/controls/EmptyState/ListEmptyState'

import { getAllCollectionsSelector } from 'src/redux/selectors/myBooks/collectionSelector'
import { myMilqProfileSelector, milqProfileSelector, getMyProfileUidSelector } from 'src/redux/selectors/userSelector'

import { ProfileModel as MilqProfileModel, Uid } from 'src/models/UserModel'
import { CollectionAndReadingStatusModel, CollectionsSortNames, CollectionPrivacyNames } from 'src/models/CollectionModel'
import { Routes, checkNav, Params } from 'src/helpers/navigationService'
import { getScrollHorizontalPadding, getScrollVerticalPadding, getContentContainerStyle, getContentContainerStyleWithAnchor, useResponsiveDimensions } from 'src/constants/layout'
import { ThemeModel } from 'src/models/ThemeModel'


export interface FilterState {
  sort: CollectionsSortNames
  filter: Nullable<CollectionPrivacyNames>
}
interface ContainerProps {
  currentWidth: number
}

const HeaderContainer = styled.View<ContainerProps>`
  margin-top: ${({ theme }) => getScrollVerticalPadding(theme)};
  margin-horizontal: ${({ theme, currentWidth }) => getScrollHorizontalPadding(theme, currentWidth)};
`

const Title = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const EmptyContainer = styled.View`
  flex: 1;
`

const CreateListButton = styled(Button)``

const navMilqUserId = props => checkNav(Params.MILQ_MEMBER_UID, props)
// if we enter this screen successfully without a prop, assume we want to look at our own profile
// otherwise check if the prop profileId matches what is existing in our own profile
const checkIsOwnProfile = props => !navMilqUserId(props) || props.myProfileUid === navMilqUserId(props) || undefined

interface StateProps {
  myProfileUid: Uid
  milqProfile?: MilqProfileModel;
  collections: CollectionAndReadingStatusModel[];
}

const selector = createStructuredSelector({
  myProfileUid: getMyProfileUidSelector,
  milqProfile: (state, props) => (checkIsOwnProfile(props) // for name
    ? myMilqProfileSelector(state)
    : milqProfileSelector(state, { milqId: navMilqUserId(props) })
  ),
  collections: (state, props) => getAllCollectionsSelector(state, { isLocal: checkIsOwnProfile(props), milqId: navMilqUserId(props), removeStatusLists: true }),
})

const connector = connect<StateProps, {}, {}>(selector)

type Props = StateProps & NavigationInjectedProps

const CollectionsListScreen = ({ collections, milqProfile, navigation, myProfileUid }: Props) => {
  const theme = useContext(ThemeContext) as ThemeModel
  const { width } = useResponsiveDimensions()
  const [isOpen, setOpen] = useState<boolean>(false)
  const [count, setCount] = useState<number>(collections.length || 0)
  const [currentFilter, setFilter] = useState<FilterState>({
    sort: CollectionsSortNames.DATE_ADDED,
    filter: null,
  })
  useEffect(() => {
    if (milqProfile) {
      navigation.setParams({ _profileName: `${milqProfile.name} ` })
    }
  }, [])
  const toggleOpenModal = useCallback((open: boolean) => () => {
    setOpen(open)
  }, [])

  const pushCollectionBookListView = (collectionId: string, title: string) => {
    const navParams = { title, collectionId }
    navigation.navigate(Routes.MY_BOOKS__LIST, navParams)
  }

  const isMyCollections = milqProfile && milqProfile.uid === myProfileUid

  const contentContainerStyle = useMemo(() => (
    isMyCollections ? getContentContainerStyleWithAnchor(theme, width) : getContentContainerStyle(width)
  ), [theme, isMyCollections, width])

  const applyFilter = (sort, filter) => {
    setFilter({ sort, filter })
  }

  const listTitle = useMemo(() => {
    if (milqProfile && milqProfile.uid !== myProfileUid) {
      return `${milqProfile.name} Lists`
    }
    return 'Created Lists'
  }, [milqProfile, myProfileUid])
  const isLocal = milqProfile ? milqProfile.uid === myProfileUid : false
  const showEmptyState = isLocal && !collections.length

  const emptyContentContainerStyle = useMemo(() => ({ marginTop: theme.spacing(3) }), [theme])
  return (
    <Container>
      <HeaderContainer currentWidth={ width }>
        <Title>{listTitle}</Title>
        <CollectionsFilterbar count={ count } applyFilter={ applyFilter } isLocal={ isLocal } />
      </HeaderContainer>
      {showEmptyState ? (
        <EmptyContainer>
          <ListEmptyState title="Start making your own lists today." description="The sky&apos;s the limit." contentContainerStyle={ emptyContentContainerStyle } />
        </EmptyContainer>
      ) : (
        <CollectionsList
          contentContainerStyle={ contentContainerStyle }
          collections={ collections }
          currentFilter={ currentFilter }
          setCount={ setCount }
        />
      )}
      { isMyCollections && (
      <CreateListButton
        variant="contained"
        onPress={ toggleOpenModal(true) }
        isAnchor
      >
        Create a new list
      </CreateListButton>
      )}
      <CreateListModal
        isOpen={ isOpen }
        onDismiss={ toggleOpenModal(false) }
        onSuccess={ pushCollectionBookListView }
      />
    </Container>
  )
}

CollectionsListScreen.navigationOptions = ({ navigation }) => {
  const name = navigation.getParam('_profileName')
  const isMyBooksTab = navigation.dangerouslyGetParent().state.routeName === Routes.MY_BOOKS_TAB
  return ({
    title: isMyBooksTab ? 'Created Lists' : `${name}'s Lists`,
    header: headerProps => (
      <Header headerProps={ headerProps } />
    ),
  })
}

export default connector(CollectionsListScreen)
