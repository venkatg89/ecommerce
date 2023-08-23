import React, { useState, useEffect } from 'react'
import styled from 'styled-components/native'
import GestureRecognizer from 'react-native-swipe-gestures'

import { Platform } from 'react-native'
import _Button from 'src/controls/Button'
import _Container from 'src/controls/layout/ScreenContainer'
import GuestUserModal from 'src/components/Modals/GuestUser'
import Webview from 'src/screens/webview/WithUserSession'

import _Modal from 'react-native-modal'
import MembershipBenefits from '../Profile/AccountMembership/MembershipBenefits'
import { icons } from 'assets/images'
import { cards } from 'assets/images'
import BenefitsList from '../Profile/AccountMembership/BenefitsList'

const Container = styled.View`
  background-color: ${({ theme }) => theme.palette.lightYellow};
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
  margin-top: auto;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
`

const Modal = styled(_Modal)`
  background-color: ${({ theme }) => theme.palette.lightYellow};
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  margin-horizontal: 0;
  margin-bottom: 0;
  ${Platform.OS === 'android'
    ? `
      margin-top: 5%
    `
    : 'margin-top: 15%'}
`

const TopLineContainer = styled.View`
  align-items: center;
  justify-content: center;
`
const ScrollContainer = styled.ScrollView``

const TopLine = styled.View`
  background-color: ${({ theme }) => theme.palette.grey5};
  margin-top: ${({ theme }) => theme.spacing(1)};
  width: 29;
  height: 4;
`

const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: ${({ theme }) => theme.spacing(1)};
`

const WrapperModal = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  padding-top: 4;
`

const ButtonClose = styled(_Button)`
  margin-left: auto;
`

const TopHeader = styled.Text`
  color: ${({ theme }) => theme.palette.grey1};
  ${({ theme }) => theme.typography.subtitle1}
  padding-right: ${({ theme }) => theme.spacing(3)};
  font-family: lato-bold;
`

const IconClose = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`

const IconCard = styled.Image`
  width: ${({ theme }) => theme.spacing(6)};
  height: ${({ theme }) => theme.spacing(4)};
`

const Button = styled(_Button)``

const Border = styled.View`
  border-top-width: 0.5;
  border-top-color: ${({ theme }) => theme.palette.grey3};
  shadow-offset: 1px 1px;
  shadow-radius: 2;
  shadow-opacity: 0.9;
  shadow-color: #000000;
  margin-bottom: 1;
`

const WebviewContainer = styled(_Container)`
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
`

const TouchableModal = styled.TouchableHighlight``

const HomeBanner = styled.TouchableOpacity``

const TagContainer = styled.View``

interface OwnProps {
  isGuest?: boolean
  handleMembershipModal?: () => void
  openModal?: boolean
}

const MembershipHome = ({
  isGuest = false,
  handleMembershipModal,
  openModal,
}: OwnProps) => {
  const [modalBenefitsIsVisible, setModalBenefitsIsVisible] = useState(
    openModal ? true : false,
  )
  const [modalWebviewTrigger, setModalWebviewTrigger] = useState(false)
  const [modalWebview, setModalWebview] = useState(false)
  const [webviewUrl, setWebviewUrl] = useState('')
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [loginModalTrigger, setLoginModalTrigger] = useState(false)

  useEffect(() => {
    !modalBenefitsIsVisible &&
      !modalWebviewTrigger &&
      !modalWebview &&
      !isLoginModalOpen &&
      !loginModalTrigger &&
      handleMembershipModal &&
      handleMembershipModal()
  }, [modalBenefitsIsVisible, isLoginModalOpen])

  const modalBenefitsHandler = () => {
    setModalBenefitsIsVisible(!modalBenefitsIsVisible)
  }

  const webviewHandler: (string) => any = (url) => {
    setWebviewUrl(url)
    setModalWebviewTrigger(true)
    setModalBenefitsIsVisible(!modalBenefitsIsVisible)
  }

  const loginHandler = () => {
    setLoginModalTrigger(true)
    setModalBenefitsIsVisible(!modalBenefitsIsVisible)
  }

  const modalBenefitsOnHide = () => {
    if (modalWebviewTrigger) {
      setModalWebview(true)
      setModalWebviewTrigger(false)
    } else if (loginModalTrigger) {
      setIsLoginModalOpen(true)
      setLoginModalTrigger(false)
    }
  }

  const configTag = {
    velocityThreshold: 0.1,
    directionalOffsetThreshold: 90,
  }

  return (
    <Container>
      <Modal
        animationType="fade"
        isVisible={modalBenefitsIsVisible}
        backdropOpacity={0.4}
        useNativeDriver={false}
        onSwipeComplete={modalBenefitsHandler}
        onModalHide={modalBenefitsOnHide}
        propagateSwipe={true}
        onBackdropPress={modalBenefitsHandler}
      >
        <GestureRecognizer onSwipeDown={() => modalBenefitsHandler()}>
          <TouchableModal>
            <MembershipBenefits
              modalBenefitsClose={modalBenefitsHandler}
              openLoginModal={loginHandler}
            />
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
            <ButtonClose
              icon
              onPress={() => {
                setModalWebview(false)
                handleMembershipModal && handleMembershipModal()
              }}
            >
              <IconClose source={icons.actionClose} />
            </ButtonClose>
          </WrapperModal>
          <Border />
          <Webview url={webviewUrl} closeModal={() => setModalWebview(false)} />
        </WebviewContainer>
      </Modal>
      <GuestUserModal
        bodyTextCentered={true}
        canContinue={false}
        animationType="fade"
        isOpen={isLoginModalOpen}
        onDismiss={() => {
          setIsLoginModalOpen(false)
        }}
      />
      <GestureRecognizer
        onSwipeUp={() => modalBenefitsHandler()}
        config={configTag}
      >
        <TagContainer>
          {!isGuest && (
            <HomeBanner onPress={modalBenefitsHandler}>
              <TopLineContainer>
                <TopLine />
              </TopLineContainer>
              <Wrapper>
                <IconCard source={cards.membercard} />
                <TopHeader>Membership</TopHeader>
                <Button icon onPress={modalBenefitsHandler}>
                  <IconClose source={icons.chevronUp} />
                </Button>
              </Wrapper>
            </HomeBanner>
          )}
        </TagContainer>
      </GestureRecognizer>
    </Container>
  )
}

export default MembershipHome
