import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'
import PassKit from 'react-native-passkit-wallet'
import GestureRecognizer from 'react-native-swipe-gestures'

import { myAtgAccountSelector } from 'src/redux/selectors/userSelector'
import { shopCartSelector } from 'src/redux/selectors/shopSelector'
import { membership } from 'assets/images'
import { Platform } from 'react-native'
import { icons } from 'assets/images'

import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'
import Webview from 'src/screens/webview/WithUserSession'
import { cards } from 'assets/images'
import _Modal from 'react-native-modal'
import _Container from 'src/controls/layout/ScreenContainer'
import { Image } from 'react-native-image-crop-picker'
import { ShopCartModel } from 'src/models/ShopModel/CartModel'
import MembershipBenefits from './MembershipBenefits'
import _Button from 'src/controls/Button'

import { membershipWalletPass } from 'src/endpoints/nodeJs/profile'
import Logger from 'src/helpers/logger'
import BenefitsList from './BenefitsList'

const SliderItemContainer = styled.View`
  text-transform: uppercase;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`

const FlexRowItem = styled.View`
  flex-direction: row;
`

const TextTitle = styled.Text`
  ${({ theme }) => theme.typography.subtitle1}
  color: ${({ theme }) => theme.palette.grey1};
  font-family: Lato-Bold;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  margin-top: 4;
`

const TextSubtitle = styled.Text`
  ${({ theme }) => theme.typography.subtitle2}
  color: ${({ theme }) => theme.palette.grey2};
  font-family: Lato-Bold;
  text-align: left;
`
const TextBody = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey2};
`

const TextExp = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey2};
  margin-top: ${({ theme }) => theme.spacing(1)};
`

const ScrollContainer = styled.ScrollView``

const ImagesContainer = styled.View`
  align-items: center;
`

const TextContainer = styled.View`
  margin-left: ${({ theme }) => theme.spacing(2)};
`

const ImgCard = styled.Image`
  width: 122;
  height: 81;
`

const AppleWalletIcon = styled.Image`
  width: 115;
  height: 40;
`

const HeaderContainer = styled.TouchableOpacity`
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  align-items: center;
`

const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.button.small};
  color: ${({ theme }) => theme.palette.linkGreen};
  text-transform: uppercase;
  font-size: 14;
`

const TopLine = styled.View`
  background-color: ${({ theme }) => theme.palette.grey5};
  margin-top: ${({ theme }) => theme.spacing(1)};
  width: 29;
  height: 4;
`

const Modal = styled(_Modal)`
  background-color: ${({ theme }) => theme.palette.lightYellow};
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  margin-horizontal: 0;
  margin-bottom: 0;
  ${Platform.OS === 'android'
    ? `
      margin-top: 15%
    `
    : 'margin-top: 15%'}
`

const Border = styled.View`
  border-top-width: 0.5;
  border-top-color: ${({ theme }) => theme.palette.grey3};
  shadow-offset: 1px 1px;
  shadow-radius: 2;
  shadow-opacity: 0.9;
  shadow-color: #000000;
`

const WebviewContainer = styled(_Container)`
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
`

const TopLineContainer = styled.View`
  align-items: center;
  justify-content: center;
`

const WrapperModal = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  padding-top: 4;
`

const IconClose = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`

const ButtonClose = styled(_Button)`
  margin-left: auto;
`

const Loading = styled.ActivityIndicator`
  margin-top: ${({ theme }) => theme.spacing(2)};
`

const TouchableModal = styled.TouchableHighlight``

const AppleWalletAddButton = styled.TouchableOpacity``

interface StateProps {
  atgAccount: AtgAccountModel | undefined
  cart: ShopCartModel
}

interface OwnProps {
  showAll: boolean
}

const selector = createStructuredSelector<any, StateProps>({
  atgAccount: myAtgAccountSelector,
  cart: shopCartSelector,
})

const connector = connect<StateProps, OwnProps>(selector)

type Props = StateProps & OwnProps

const MembershipItem = ({ atgAccount, cart, showAll }: Props) => {
  useEffect(() => {
    setAccountData(atgAccount)
  }, [atgAccount?.membership, cart])

  const [accountData, setAccountData] = useState<AtgAccountModel | undefined>()
  const [modalBenefitsIsVisible, setModalBenefitsIsVisible] = useState(false)
  const [modalWebviewTrigger, setModalWebviewTrigger] = useState(false)
  const [modalWebview, setModalWebview] = useState(false)
  const [webviewUrl, setWebviewUrl] = useState('')
  const [fetchingWalletPass, setFetchingWalletPass] = useState<boolean>(false)

  const bnMembership = atgAccount?.membership.bnMembership

  const membershipData: {
    type: string
    numberId: string
    expDate?: Date | undefined
    icon: Image
  }[] = []

  if (accountData?.membership?.bnMembership?.memberId) {
    membershipData.push({
      type: 'B&N Membership',
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
  if (showAll && accountData?.membership?.employee?.memberId) {
    membershipData.push({
      type: 'B&N Employee',
      numberId: accountData?.membership?.employee?.memberId,
      icon: cards.employeeCard,
    })
  }

  const modalBenefitsHandler = () => {
    setModalBenefitsIsVisible(!modalBenefitsIsVisible)
  }

  const webviewHandler: (string) => any = (url) => {
    setWebviewUrl(url)
    setModalWebviewTrigger(true)
    setModalBenefitsIsVisible(!modalBenefitsIsVisible)
  }

  const modalBenefitsOnHide = () => {
    if (modalWebviewTrigger) {
      setModalWebview(true)
      setModalWebviewTrigger(false)
    }
  }

  const getWalletPass = async () => {
    setFetchingWalletPass(true)
    if (!bnMembership) {
      setFetchingWalletPass(false)
      return
    }

    try {
      if (await PassKit.canAddPasses()) {
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

  return (
    <>
      <ScrollContainer>
        <Modal
          animationType="fade"
          isVisible={modalBenefitsIsVisible}
          backdropOpacity={0.4}
          useNativeDriver={false}
          onSwipeComplete={modalBenefitsHandler}
          onModalHide={modalBenefitsOnHide}
          onBackdropPress={modalBenefitsHandler}
        >
          <GestureRecognizer onSwipeDown={() => modalBenefitsHandler()}>
            <TouchableModal>
              <MembershipBenefits modalBenefitsClose={modalBenefitsHandler} />
            </TouchableModal>
          </GestureRecognizer>
          <ScrollContainer showsVerticalScrollIndicator={false}>
            <BenefitsList webviewOpen={webviewHandler} />
          </ScrollContainer>
        </Modal>
        <Modal
          animationType="fade"
          isVisible={modalWebview}
          backdropOpacity={0.4}
          useNativeDriver={false}
        >
          <WebviewContainer>
            <TopLineContainer>
              <TopLine />
            </TopLineContainer>
            <WrapperModal>
              <ButtonClose icon onPress={() => setModalWebview(false)}>
                <IconClose source={icons.actionClose} />
              </ButtonClose>
            </WrapperModal>
            <Border />
            <Webview
              url={webviewUrl}
              closeModal={() => setModalWebview(false)}
            />
          </WebviewContainer>
        </Modal>
        {membershipData.map((el, index) => {
          return (
            <SliderItemContainer key={index}>
              <FlexRowItem>
                <ImagesContainer>
                  <ImgCard resizeMode="contain" source={el.icon} />
                  {el.type === 'B&N Membership' && Platform.OS === 'ios' && (
                    <>
                      {fetchingWalletPass ? (
                        <Loading size="small" />
                      ) : (
                        <AppleWalletAddButton onPress={getWalletPass}>
                          <AppleWalletIcon
                            resizeMode="contain"
                            source={membership.appleWallet}
                          />
                        </AppleWalletAddButton>
                      )}
                    </>
                  )}
                </ImagesContainer>
                <TextContainer>
                  <TextTitle>{el.type}</TextTitle>
                  <TextSubtitle>
                    {el.type === 'B&N Employee'
                      ? 'Employee Discount'
                      : 'Member Number'}
                  </TextSubtitle>
                  <TextBody>{el.numberId}</TextBody>
                  {el.expDate && (
                    <TextExp>{`Expires: ${moment(el.expDate).format(
                      'MMMM Do, YYYY',
                    )}`}</TextExp>
                  )}
                </TextContainer>
              </FlexRowItem>
              {el.type === 'B&N Membership' && (
                <>
                  <HeaderContainer
                    onPress={() => setModalBenefitsIsVisible(true)}
                  >
                    <HeaderText>View B&N membership details</HeaderText>
                  </HeaderContainer>
                </>
              )}
            </SliderItemContainer>
          )
        })}
      </ScrollContainer>
    </>
  )
}

export default connector(MembershipItem)
