import React, { useState } from 'react'
import styled from 'styled-components/native'
import { icons } from 'assets/images'
import RadioButton from 'src/controls/Button/RadioButton'
import _Modal from 'react-native-modal'
import { Platform } from 'react-native'
import FreeShippingInfo from 'src/components/Cart/FreeShippingInfo'

const Container = styled.View`
  border-bottom-color: ${({ theme }) => theme.palette.grey5};
  border-bottom-width: 1;
`

const ShippingText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-left: ${({ theme }) => theme.spacing(2)};
  width: 85%;
`
const IncludesGiftContainer = styled.View`
  flex-direction: row;
  align-items: center;
`
const Checkbox = styled(RadioButton)<Props>`
  margin-left: ${({ theme }) => theme.spacing(2)};
  ${({ theme, freeShipping }) =>
    freeShipping
      ? `margin-top: ${theme.spacing(2)}`
      : `margin-top: ${theme.spacing(3)}`};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const GiftText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  padding-horizontal: ${({ theme }) => theme.spacing(1)};
`

const GiftIcon = styled.Image`
  padding-horizontal: ${({ theme }) => theme.spacing(1)};
`

const InfoIcon = styled.Image`
  margin-left: ${({ theme }) => theme.spacing(1.5)};
  align-self: center;
  width: 22;
  height: 22;
`

const ShippingTextContainer = styled.TouchableOpacity`
  flex-direction: row;
  margin-top: ${({ theme }) => theme.spacing(3)};
`

const Modal = styled(_Modal)`
  background-color: white;
  margin-horizontal: 0;
  margin-bottom: 0;
  ${Platform.OS === 'android'
    ? `
      margin-top: 15%
    `
    : 'margin-top: 25%'}

  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  padding-bottom: ${({ theme }) => theme.spacing(4)};
`

interface Props {
  shippingtText?: string
  selected: boolean
  onPress: () => void
}

const ShippingDetailsComponent = ({
  shippingtText,
  selected,
  onPress,
}: Props) => {
  const [modalIsVisible, setModalIsVisible] = useState(false)
  const modalCloseHandler = () => {
    setModalIsVisible(!modalIsVisible)
  }
  const shippingTextParse = () => {
    if (!!shippingtText) {
      let text = shippingtText.toLowerCase()
      if (text[text.length - 1] === '-') {
        text = text.substring(0, text.length - 1).trim()
      }
      let endChar = '.!'.includes(text[text.length - 1]) ? '' : '.'
      return text.charAt(0).toUpperCase() + text.slice(1) + endChar
    } else {
      return undefined
    }
  }

  return (
    <Container>
      {!!shippingtText && (
        <ShippingTextContainer onPress={() => setModalIsVisible(true)}>
          <ShippingText>{shippingTextParse()}</ShippingText>
          <InfoIcon source={icons.actionInfo} />
        </ShippingTextContainer>
      )}
      <Checkbox checkboxStyle selected={selected} onPress={onPress}>
        <IncludesGiftContainer freeShipping={!!shippingtText}>
          <GiftIcon source={icons.gift} />
          <GiftText>This order includes a gift</GiftText>
        </IncludesGiftContainer>
      </Checkbox>
      <Modal
        animationType="slide"
        isVisible={modalIsVisible}
        backdropOpacity={0.4}
        useNativeDriver={false}
        swipeDirection={['down']}
        onSwipeComplete={modalCloseHandler}
        propagateSwipe={true}
      >
        <FreeShippingInfo onPressClose={modalCloseHandler} />
      </Modal>
    </Container>
  )
}

export default ShippingDetailsComponent
