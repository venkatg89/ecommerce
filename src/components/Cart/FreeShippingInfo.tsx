import React from 'react'
import styled from 'styled-components/native'
import { icons } from 'assets/images'
import { TouchableOpacity } from 'react-native'
import { freeShippingText } from 'src/constants/freeShippingInfoText'

const Container = styled.View`
  flex: 1;
  margin-top: ${({ theme }) => theme.spacing(3)};
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
`
const TextContainer = styled.ScrollView``

const TitleText = styled.Text`
  ${({ theme }) => theme.typography.heading2}
`

const TermsText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  font-size: 16;
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(5)};
`

const IconClose = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`
const CloseContainer = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: flex-end;
`
interface Props {
  onPressClose: () => void
}
const FreeShippingInfo = ({ onPressClose }: Props) => {
  return (
    <Container>
      <CloseContainer onPress={onPressClose}>
        <IconClose source={icons.actionClose} />
      </CloseContainer>
      <TitleText>Free Shipping</TitleText>
      <TextContainer>
        <TouchableOpacity>
          <TermsText>{freeShippingText}</TermsText>
        </TouchableOpacity>
      </TextContainer>
    </Container>
  )
}

export default FreeShippingInfo
