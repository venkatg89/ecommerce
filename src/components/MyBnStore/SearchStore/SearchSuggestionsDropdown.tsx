import React, { useCallback, useContext, useMemo } from 'react'
import { SectionList as _SectionList, StyleProp, ViewStyle } from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled, { ThemeContext } from 'styled-components/native'

import { navigate, Routes, Params } from 'src/helpers/navigationService'
import {
  StoreSearchSuggestions,
  BopisSearch,
} from 'src/models/StoreModel/SearchModel'
import { RequestStatus } from 'src/models/ApiStatus'

import { storeSearchSuggestionsRequestStatusSelector } from 'src/redux/selectors/apiStatus/store'
import { cafeSearchSuggestionsRequestStatusSelector } from 'src/redux/selectors/apiStatus/cafe'
import {
  checkInUserStoreAction,
  CheckInUserStoreActionParams,
} from 'src/redux/actions/cafe/checkInAction'
import { checkedInVenueIdSelector } from 'src/redux/selectors/cafeSelector'

import Images from 'assets/images'

const Container = styled.View`
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.palette.white};
  align-items: center;
  padding-horizontal: 16px;
`

const NoResultsText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1}
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const SectionList = styled(_SectionList)`
  background-color: ${(props) => props.theme.palette.white};
`

const SectionText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1}
  color: ${({ theme }) => theme.palette.grey2};
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const SearchSuggestionContainer = styled.TouchableOpacity`
  width: 100%;
`

const SearchSuggestionText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey2};
`

const ItemSpacing = styled.View`
  height: ${({ theme }) => theme.spacing(3)};
`

const EmptyImage = styled.Image`
  margin-top: ${({ theme }) => theme.spacing(10)};
  width: 183;
  height: 183;
`

const EmptyText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  text-align: center;
`

interface OwnProps {
  style?: StyleProp<ViewStyle>
  searchSuggestions?: StoreSearchSuggestions
  onSearch: (bopisSearch: BopisSearch) => void
  showNoResults: boolean
  stack?: string
  keyboardHeight?: number
}

interface StateProps {
  storeSearchSuggestionsRequestStatus: Nullable<RequestStatus>
  cafeStoreSearchSuggestionsRequestStatus: Nullable<RequestStatus>
  checkedInVenue?: string
}

const selector = createStructuredSelector({
  storeSearchSuggestionsRequestStatus: storeSearchSuggestionsRequestStatusSelector,
  cafeStoreSearchSuggestionsRequestStatus: cafeSearchSuggestionsRequestStatusSelector,
  checkedInVenue: checkedInVenueIdSelector,
})

interface DispatchProps {
  checkInStore: (params?: CheckInUserStoreActionParams) => void
}

const dispatcher = (dispatch) => ({
  checkInStore: (params) => dispatch(checkInUserStoreAction(params)),
})

const connector = connect<StateProps, {}, OwnProps>(selector, dispatcher)

type Props = StateProps & OwnProps & DispatchProps

const SearchSuggestions = ({
  style,
  searchSuggestions,
  onSearch,
  showNoResults,
  storeSearchSuggestionsRequestStatus,
  cafeStoreSearchSuggestionsRequestStatus,
  checkedInVenue,
  checkInStore,
  stack,
  keyboardHeight,
}: Props) => {
  const { spacing } = useContext(ThemeContext)

  const generateSectionData = useCallback(() => {
    const stores = {
      title: 'Store',
      data: (searchSuggestions && searchSuggestions.stores) || [],
      isStore: true,
    }
    const locations = {
      title: 'Location',
      data: (searchSuggestions && searchSuggestions.locations) || [],
    }
    const zip = {
      title: 'Zip Code',
      data: (searchSuggestions && searchSuggestions.zip) || [],
    }
    return [
      ...(stores.data.length ? [stores] : []),
      ...(locations.data.length ? [locations] : []),
      ...(zip.data.length ? [zip] : []),
    ]
  }, [searchSuggestions])

  const navigateToStoreDetails = useCallback((item) => {
    //default destination
    let destination = Routes.MY_BN__STORE_DETAILS
    let navParams = {
      [Params.STORE_ID]: item.bopisQuery,
      [Params.STORE_NAME]: item.term,
    }

    switch (stack) {
      case Routes.CART_TAB: {
        destination = Routes.CART__STORE_DETAILS
        navParams[Params.STACK] = Routes.CART_TAB
        break
      }
      case Routes.CAFE__SEARCH_VENUES: {
        destination = Routes.CAFE__STORE_DETAILS
        break
      }
      default: {
        //nothing to do here yet
        break
      }
    }
    navigate(destination, navParams)
  }, [])

  const renderItem = useCallback(
    (
      { item, section }, // eslint-disable-line
    ) => (
      <SearchSuggestionContainer
        onPress={() => {
          if (section.isStore) {
            navigateToStoreDetails(item)
          } else {
            onSearch(item)
          }
        }}
      >
        <SearchSuggestionText>{item.term}</SearchSuggestionText>
      </SearchSuggestionContainer>
    ),
    [],
  )

  const renderSection = useCallback(
    (
      { section }, // eslint-disable-line
    ) => <SectionText>{section.title}</SectionText>,
    [],
  )

  const contentStyle = useMemo(
    () => ({
      paddingBottom:
        !!keyboardHeight && keyboardHeight !== 0
          ? spacing(keyboardHeight / 8 + 8.5)
          : spacing(8),
      paddingHorizontal: spacing(3),
    }),
    [spacing, keyboardHeight],
  )

  const sectionData = generateSectionData()

  if (
    showNoResults &&
    !sectionData.length &&
    (storeSearchSuggestionsRequestStatus === RequestStatus.SUCCESS ||
      cafeStoreSearchSuggestionsRequestStatus === RequestStatus.SUCCESS)
  ) {
    return (
      <Container>
        <EmptyImage source={Images.search} />
        <NoResultsText>
          We&apos;re sorry we didn&apos;t find anything for your search.
        </NoResultsText>
        <EmptyText>
          Check that what you typed is what you were searching for.
        </EmptyText>
      </Container>
    )
  }

  return (
    <SectionList
      style={style}
      contentContainerStyle={contentStyle}
      sections={sectionData}
      keyExtractor={(item: any) => item.term}
      renderItem={renderItem}
      renderSectionHeader={renderSection}
      ItemSeparatorComponent={ItemSpacing}
      stickySectionHeadersEnabled={false}
    />
  )
}

export default connector(SearchSuggestions)
