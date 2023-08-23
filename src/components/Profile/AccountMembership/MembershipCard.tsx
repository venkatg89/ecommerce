import React, { useState } from 'react'
import moment from 'moment'
import { Platform, Dimensions } from 'react-native'

import styled from 'styled-components/native'
import _Barcode from 'react-native-barcode-builder'

import { BnMembershipModelRecord } from 'src/models/UserModel/MembershipModel'
import IMAGES, { membership } from 'assets/images'
import { membershipWalletPass } from 'src/endpoints/nodeJs/profile'
import PassKit from 'react-native-passkit-wallet'
import Logger from 'src/helpers/logger'

const CARD_MARGINS = 16
const MAX_CARD_WIDTH = 414 /* iPhone 8 plus */ - CARD_MARGINS * 2
const CARD_ASPECT_RATIO = 1.58064 // from png image size

const screenWidth = Dimensions.get('window').width
const cardWidth =
  (screenWidth >= MAX_CARD_WIDTH ? MAX_CARD_WIDTH : screenWidth) -
  CARD_MARGINS * 2
const cardHeight = cardWidth / CARD_ASPECT_RATIO

const barcodeWidth = cardWidth / 123
const barcodeHeight = cardHeight * 0.32

const Container = styled.ImageBackground`
  width: ${cardWidth};
  height: ${cardHeight};
  margin-horizontal: ${CARD_MARGINS};
  align-items: center;
  justify-content: center;
  padding-top: ${cardHeight * 0.6};
`

const Barcode = styled(_Barcode)``

const AppleWalletAddButton = styled.TouchableOpacity``

const MembershipNumber = styled.Text`
  text-align: center;
  background-color: #fff;
  width: ${cardWidth * 0.66};
  height: ${cardHeight * 0.12};
  letter-spacing: 2;
  font-size: ${cardWidth * 0.05};
  top: -${cardHeight * 0.13};
`

const WalletWrapper = styled.View`
  margin-top: ${({ theme }) => theme.spacing(4)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  align-items: center;
  justify-content: center;
`

const AppleWalletIcon = styled.Image`
  width: 111;
  height: 35;
`

const ExpirationWrapper = styled.View`
  align-items: center;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing(3)};
`

const Loading = styled.ActivityIndicator``

const ExpirationText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.black};
`

interface StateProps {
  bnMembership: Nullable<BnMembershipModelRecord>
}

interface OwnProps {
  modalBenefitsClose: () => void
}

type Props = StateProps & OwnProps

const MembershipCard = ({ bnMembership, modalBenefitsClose }: Props) => {
  const [fetchingWalletPass, setFetchingWalletPass] = useState<boolean>(false)

  const getWalletPass = async () => {
    setFetchingWalletPass(true)
    if (!bnMembership) {
      setFetchingWalletPass(false)
      return
    }

    try {
      if (await PassKit.canAddPasses()) {
        //two modal windows restricted in react-native, so we need to close the main modal to allow Passkit perform actions
        setTimeout(() => {
          modalBenefitsClose()
        }, 200)
        const response = await membershipWalletPass({
          os: Platform.OS,
          membershipNumber: bnMembership.memberId,
          expirationDate: moment(bnMembership.expirationDate).format(
            'MMMM Do, YYYY',
          ),
        })
        if (response.ok) {
          await PassKit.addPass(response.data)
        } else {
          const error = response.error
          Logger.getInstance().error(error)
        }
      }
    } catch (error) {
      Logger.getInstance().error(error)
    }
    setFetchingWalletPass(false)
  }

  return bnMembership ? (
    <>
      <Container source={IMAGES.bnCard} resizeMode="contain">
        <Barcode
          value={bnMembership.memberId}
          width={barcodeWidth}
          height={barcodeHeight}
          format="CODE128"
        />
        <MembershipNumber>{bnMembership.memberId}</MembershipNumber>
      </Container>
      {Platform.OS === 'ios' && (
        <WalletWrapper>
          {fetchingWalletPass ? (
            <Loading size="small" />
          ) : (
            <AppleWalletAddButton onPress={getWalletPass}>
              <AppleWalletIcon source={membership.appleWallet} />
            </AppleWalletAddButton>
          )}
        </WalletWrapper>
      )}
      <ExpirationWrapper>
        <ExpirationText>
          {`Your Membership will end on ${moment(
            bnMembership.expirationDate,
          ).format('MMMM Do, YYYY')}.`}
        </ExpirationText>
      </ExpirationWrapper>
    </>
  ) : (
    <Container source={IMAGES.bnCard} />
  )
}
export default MembershipCard
