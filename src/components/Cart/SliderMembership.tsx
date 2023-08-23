import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'
import Carousel from 'react-native-snap-carousel'
import DeviceInfo from 'react-native-device-info'
import { Dimensions } from 'react-native'

import { myAtgAccountSelector } from 'src/redux/selectors/userSelector'
import { shopCartSelector } from 'src/redux/selectors/shopSelector'

import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'
import { cards } from 'assets/images'
import { Image } from 'react-native-image-crop-picker'
import { ShopCartModel } from 'src/models/ShopModel/CartModel'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const ITEM_WIDTH = DeviceInfo.isTablet() ? SCREEN_WIDTH / 3 : SCREEN_WIDTH / 1.2
const ITEM_HEIGHT = SCREEN_WIDTH * 0.3

const SliderItemContainer = styled.View`
  color: ${({ theme }) => theme.palette.linkGreen};
  text-transform: uppercase;
  border: 1px   ${({ theme }) => theme.palette.grey4};
  border-radius: 5px;
  height: ${ITEM_HEIGHT}
  backgroundColor: white
  padding-left: ${({ theme }) => theme.spacing(2)};
  shadow-offset: 1px 3px;
  shadow-radius: 2;
  shadow-opacity: 0.2;
  shadow-color: #000000;
  margin-bottom:${({ theme }) => theme.spacing(2)};
  `

const FlexRowItem = styled.View`
  flex-direction: row;
  align-items: center
  margin-top:${({ theme }) => theme.spacing(2)};
`

const ItemIcon = styled.Image`
  width: ${({ theme }) => theme.spacing(4)};
  height: ${({ theme }) => theme.spacing(3)};
  margin-right: ${({ theme }) => theme.spacing(1)};
`

const AppliedCardText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey1};
  text-align: left;
`
const AppliedDiscountText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey1};
  text-align: left;
  margin-vertical: ${({ theme }) => theme.spacing(1)};
`
const ExpirationDateText = styled.Text`
  color: ${({ theme }) => theme.palette.grey3};
  text-align: left;
`

interface StateProps {
  atgAccount: AtgAccountModel | undefined
  cart: ShopCartModel
}

interface OwnProps {
  showAll: boolean
  cafeMembershipId?: string
}

const selector = createStructuredSelector<any, StateProps>({
  atgAccount: myAtgAccountSelector,
  cart: shopCartSelector,
})

const connector = connect<StateProps, OwnProps>(selector)

type Props = StateProps & OwnProps

const SliderMembership = ({
  atgAccount,
  cart,
  showAll,
  cafeMembershipId,
}: Props) => {
  useEffect(() => {
    setAccountData(atgAccount)
  }, [atgAccount?.membership, cart])

  const carouselRef = useRef<Carousel>(null)
  const [accountData, setAccountData] = useState<AtgAccountModel | undefined>()
  const membershipData: {
    type: string
    numberId: string
    expDate?: Date | undefined
    icon: Image
  }[] = []

  if (accountData?.membership?.bnMembership?.memberId) {
    membershipData.push({
      type: 'BN Membership',
      numberId: accountData?.membership?.bnMembership?.memberId,
      expDate: accountData?.membership.bnMembership?.expirationDate,
      icon: cards.membercard,
    })
  }
  if (showAll && accountData?.membership?.kidsClub?.kidsClubID) {
    membershipData.push({
      type: 'Kids Club',
      numberId: accountData?.membership?.kidsClub?.kidsClubID.toString(),
      icon: cards.kidsCard,
    })
  }
  if (showAll && accountData?.membership?.educator?.memberId) {
    membershipData.push({
      type: 'Educator',
      numberId: accountData?.membership?.educator?.memberId,
      expDate: accountData?.membership.educator?.expirationDate,
      icon: cards.educatorCard,
    })
  }
  if (accountData?.membership?.employee?.memberId) {
    membershipData.push({
      type: 'B&N Employee',
      numberId: accountData?.membership?.employee?.memberId,
      icon: cards.employeeCard,
    })
  }

  const cardsLastNumbers = (giftCardNumber) => {
    return giftCardNumber?.slice(-4)
  }

  const expDateTransform = (date) => {
    return `${date.slice(5, 7)}/${date.slice(0, 4)}`
  }

  const renderItem = (el) => {
    return (
      <SliderItemContainer>
        <FlexRowItem>
          <ItemIcon source={el.item.icon} />
          <AppliedCardText>
            {el.item.type} *{cardsLastNumbers(el.item.numberId)}
          </AppliedCardText>
        </FlexRowItem>
        <AppliedDiscountText>Discounts applied</AppliedDiscountText>
        {el.item.expDate && (
          <ExpirationDateText>
            Expiration date {expDateTransform(el.item.expDate)}
          </ExpirationDateText>
        )}
      </SliderItemContainer>
    )
  }

  if (cafeMembershipId) {
    return (
      <SliderItemContainer>
        <FlexRowItem>
          <ItemIcon source={ cards.membercard } />
          <AppliedCardText>
            BN Membership *{ cafeMembershipId.slice(-4) }
          </AppliedCardText>
        </FlexRowItem>
        <AppliedDiscountText>10% discount applied</AppliedDiscountText>
        {(cafeMembershipId === accountData?.membership?.bnMembership?.memberId)
          && accountData?.membership.bnMembership?.expirationDate && (
          <ExpirationDateText>
            { `Expiration date ${expDateTransform(accountData?.membership.bnMembership?.expirationDate)}` }
          </ExpirationDateText>
        )}
      </SliderItemContainer>
    )
  }

  return (
    <Carousel
      layout="default"
      ref={carouselRef}
      data={membershipData}
      renderItem={renderItem}
      sliderWidth={SCREEN_WIDTH * 0.95}
      itemHeight={ITEM_HEIGHT}
      itemWidth={ITEM_WIDTH * 0.95}
      useScrollView={true}
    />
  )
}

export default connector(SliderMembership)
