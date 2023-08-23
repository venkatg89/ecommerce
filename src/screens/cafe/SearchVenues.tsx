import React from 'react'
import { PermissionsAndroid, Platform, Keyboard } from 'react-native'
import { connect } from 'react-redux'
import styled from 'styled-components/native'

import Geolocation from 'react-native-geolocation-service'
import { debounce } from 'lodash'

import Container from 'src/controls/layout/ScreenContainer'
import SearchHeader from 'src/components/Search/SearchLocationHeader'
import VenueResultListWithMap from 'src/components/Cafe/VenueResultListWithMap'
import _SearchSuggestions from 'src/components/MyBnStore/SearchStore/SearchSuggestionsDropdown'

import { PositionRegion } from 'src/models/MapModel'
import {
  StoreSearchSuggestions,
  BopisSearch,
} from 'src/models/StoreModel/SearchModel'

import { Routes } from 'src/helpers/navigationService'

import {
  fetchCafeSearchVenueResultsAction,
  FetchCafeSearchVenueResultsActionParams,
  fetchCafeSearchVenueMoreResultsAction,
  storeSearchSuggestionsCafeAction,
  searchCafeWithQueryAction,
} from 'src/redux/actions/cafe/venuesAction'
import { permissionDeniedAction } from 'src/redux/actions/permissions/request'

interface State {
  query: string
  searchSuggestions: StoreSearchSuggestions | undefined
  isSearchingNearby: boolean
  currentPosition: PositionRegion
  keyboardHeight: number
}

const Wrapper = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 1;
`

const SearchSuggestions = styled(_SearchSuggestions)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 1;
`

const SUGGESTIONS_DEBOUNCE_DELAY = 500

interface DispatchProps {
  fetchSearchVenueResults: (
    params: FetchCafeSearchVenueResultsActionParams,
  ) => void
  fetchMoreSearchVenueResults: (
    params: FetchCafeSearchVenueResultsActionParams,
  ) => void
  locationPermissionDenied: () => void
  storeSearchSuggestions: (query: string) => StoreSearchSuggestions | undefined
  searchCafeWithQueryAction: (query: string) => void
}

const dispatcher = (dispatch) => ({
  fetchSearchVenueResults: (params) =>
    dispatch(fetchCafeSearchVenueResultsAction(params)),
  fetchMoreSearchVenueResults: (params) =>
    dispatch(fetchCafeSearchVenueMoreResultsAction(params)),
  locationPermissionDenied: () => dispatch(permissionDeniedAction('location')),
  storeSearchSuggestions: (query) =>
    dispatch(storeSearchSuggestionsCafeAction(query)),
  searchCafeWithQueryAction: (query) =>
    dispatch(searchCafeWithQueryAction(query)),
})

const connector = connect<{}, DispatchProps, {}>(null, dispatcher)

type Props = DispatchProps

class SearchVenuesScreen extends React.Component<Props, State> {
  keyboardDidShowListener: any
  keyboardDidHideListener: any

  state = {
    query: '',
    searchSuggestions: undefined,
    isSearchingNearby: true,
    currentPosition: {
      latitude: 0,
      longitude: 0,
    },
    keyboardHeight: 0,
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    )
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    )
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  _keyboardDidShow = (e) => {
    this.setState({
      keyboardHeight: e.endCoordinates.height,
    })
  }

  _keyboardDidHide = () => {
    this.setState({
      keyboardHeight: 0,
    })
  }

  componentDidMount() {
    this.getCurrentPositionAndSearchStore()
  }

  hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const statusPermissionIOS = await Geolocation.requestAuthorization(
        'whenInUse',
      )
      if (statusPermissionIOS === 'granted') {
        return true
      }
      return false
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    )

    if (hasPermission) {
      return true
    }

    const statusPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    )

    if (statusPermission === PermissionsAndroid.RESULTS.GRANTED) {
      return true
    }

    return false
  }

  /*
   * this should only be called if the user location wants to be recentered, as this will reposition
   * the map to center on user when we change the state
   */
  getCurrentPositionAndSearchStore = async () => {
    this.setState({
      query: '',
      searchSuggestions: undefined,
    })
    Keyboard.dismiss()
    const hasPermission = await this.hasLocationPermission()

    if (!hasPermission) {
      return
    }

    Geolocation.getCurrentPosition((position) => {
      this.setState({
        isSearchingNearby: true,
        currentPosition: {
          latitude: position.coords.latitude || 0,
          longitude: position.coords.longitude || 0,
        },
      })
      this.props.fetchSearchVenueResults({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })
    })
  }

  getSearchSuggestions = async (query: string) => {
    this.setState({ query })
    if (!query || !query.length) {
      this.getCurrentPositionAndSearchStore()
      return
    }

    const searchSuggestions = await this.props.storeSearchSuggestions(query)
    if (/^\d+$/.test(query) && query.length === 5) {
      // is 5 digit zip code case
      this.setState({
        searchSuggestions: {
          zip: [
            {
              term: query,
              bopisQuery: query,
            },
          ],
        },
      })
    } else if (searchSuggestions) {
      this.setState({ searchSuggestions })
    }
  }

  onSearch = async (bopisSearch: BopisSearch) => {
    this.setState({
      query: bopisSearch.term,
      searchSuggestions: undefined,
      isSearchingNearby: false,
    })
    Keyboard.dismiss()
    await this.props.searchCafeWithQueryAction(bopisSearch.bopisQuery)
  }

  loadMoreVenues = () => {
    const { query, currentPosition } = this.state
    this.props.fetchMoreSearchVenueResults({ query, ...currentPosition })
  }

  render() {
    const {
      query,
      currentPosition,
      searchSuggestions,
      isSearchingNearby,
    } = this.state

    return (
      <Container>
        <Wrapper>
          <VenueResultListWithMap
            currentPosition={currentPosition}
            onEndReached={this.loadMoreVenues}
            isSearchingNearby={isSearchingNearby}
          />
          {(!!searchSuggestions && (
            <SearchSuggestions
              style={{ paddingTop: 50 }}
              searchSuggestions={searchSuggestions}
              onSearch={this.onSearch}
              showNoResults={true}
              stack={Routes.CAFE__SEARCH_VENUES}
              keyboardHeight={this.state.keyboardHeight}
            />
          )) ||
            undefined}
        </Wrapper>
        <SearchHeader
          value={query}
          onValueChange={debounce(
            this.getSearchSuggestions,
            SUGGESTIONS_DEBOUNCE_DELAY,
          )}
          onPressCurrentLocation={this.getCurrentPositionAndSearchStore}
          onReset={this.getCurrentPositionAndSearchStore}
        />
      </Container>
    )
  }
}

export default connector(SearchVenuesScreen)
