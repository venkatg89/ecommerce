import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { NavigationInjectedProps } from 'react-navigation'
import styled from 'styled-components/native'
import ScrollContainer from 'src/controls/layout/ScrollContainer'
import _SearchInput from 'src/controls/form/SearchInput'
import HomeCardOne from 'src/components/Home/HomeCardTypeOne'
import HomeCardTwo from 'src/components/Home/HomeCardTypeTwo'
import HomeCardThree from 'src/components/Home/HomeCardTypeThree'
import HomeCardFour from 'src/components/Home/HomeCardTypeFour'
import HomeCardNine from 'src/components/Home/HomeCardTypeNine'
import HomeCardTen from 'src/components/Home/HomeCardTypeTen'
import HomeCardEleven from 'src/components/Home/HomeCardTypeEleven'
import HomeCardTwelve from 'src/components/Home/HomeCardTypeTwelve'
import LoadingIndicator from 'src/controls/progress/LoadingIndicator'

import { getBrowseTopNavDetailsAction } from 'src/redux/actions/browse/categories'
import { Routes, Params, push } from 'src/helpers/navigationService'
import { icons } from 'assets/images'
import { getHomeDetailsAction } from 'src/redux/actions/home'
import MembershipHome from 'src/components/Home/MembershipHome'
import { homeDetailsSelector } from 'src/redux/selectors/homeSelector'
import { HomeDetailsModel } from 'src/models/HomeModel'

const Flex = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const SearchInput = styled(_SearchInput)`
  margin-top: ${({ theme }) => -theme.spacing(1)};
`

const Button = styled.TouchableOpacity`
  flex-direction: row;
  padding: ${({ theme }) => `${theme.spacing(1)}px ${theme.spacing(2)}px`};
  align-items: center;
`

const ButtonIcon = styled.Image`
  height: ${({ theme }) => theme.spacing(3)};
  width: ${({ theme }) => theme.spacing(3)};
  tint-color: ${({ theme }) => theme.palette.grey2};
  margin-right: 5;
`

const ButtonText = styled.Text`
  color: ${({ theme }) => theme.palette.grey2};
  ${({ theme }) => theme.typography.button.small}
  text-transform: uppercase;
`

const LoadingOverlay = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

interface StateProps {
  homeDetails: Nullable<HomeDetailsModel>
}

const selector = createStructuredSelector({
  homeDetails: homeDetailsSelector,
})

interface DispatchProps {
  getBrowseTopNavDetails: () => void
  getHomeDetails: () => void
}

const dispatcher = (dispatch) => ({
  getBrowseTopNavDetails: () => dispatch(getBrowseTopNavDetailsAction()),
  getHomeDetails: () => dispatch(getHomeDetailsAction()),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps & NavigationInjectedProps

const Discovery = ({
  getBrowseTopNavDetails,
  getHomeDetails,
  homeDetails,
}: Props) => {
  const [searchQuery, setSearchQuery] = useState<string>('')

  useEffect(() => {
    getBrowseTopNavDetails()
    getHomeDetails()
  }, [])

  const renderCards = useCallback(() => {
    if (!homeDetails) {
      return (
        <LoadingOverlay>
          <LoadingIndicator isLoading={true} />
        </LoadingOverlay>
      )
    }

    return homeDetails.results.map((content, index) => {
      switch (content.type) {
        case 'TypeOne':
          return <HomeCardOne key={index} content={content} />
        case 'TypeTwo':
          return <HomeCardTwo key={index} content={content} />
        case 'TypeThree':
          return <HomeCardThree key={index} content={content} />
        case 'TypeFour':
          return <HomeCardFour key={index} content={content} />
        case 'TypeNine':
          return <HomeCardNine key={index} content={content} />
        case 'TypeTen':
          return <HomeCardTen key={index} content={content} />
        case 'TypeEleven':
          return <HomeCardEleven key={index} content={content} />
        case 'TypeTwelve':
          return <HomeCardTwelve key={index} content={content} />
      }
    })
  }, [homeDetails])

  const onBarcodeScannedSuccess = (ean) => {
    push(Routes.SEARCH__SEARCH, { [Params.SEARCH_QUERY]: ean })
  }

  return (
    <>
      <ScrollContainer>
        <SearchInput
          onChange={setSearchQuery}
          value={searchQuery}
          onBarcodeScannedSuccess={onBarcodeScannedSuccess}
          onReset={() => {
            setSearchQuery('')
          }}
          onSubmit={() => {
            push(Routes.SEARCH__SEARCH, { [Params.SEARCH_QUERY]: searchQuery })
          }}
          placeholder="Search by Title, Author, or ISBN"
        />
        <Flex>
          <Button
            onPress={() => {
              push(Routes.HOME__CATEGORIES)
            }}
          >
            <ButtonIcon source={icons.categories} />
            <ButtonText>Browse Categories</ButtonText>
          </Button>
          <Button
            onPress={() => {
              push(Routes.WISHLIST__MY_LISTS)
            }}
          >
            <ButtonIcon source={icons.unfavorite} />
            <ButtonText>My Lists</ButtonText>
          </Button>
        </Flex>
        {renderCards()}
      </ScrollContainer>
      <MembershipHome />
    </>
  )
}
export default connector(Discovery)
