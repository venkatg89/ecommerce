import React from 'react'
import { Image } from 'react-native'
import styled from 'styled-components/native'
import { icons } from 'assets/images'

const Container = styled.TouchableOpacity`
  justify-content: space-between;
  flex-direction: row;
  padding-vertical: ${({ theme }) => theme.spacing(2)};
  align-items: center;
`

const TitleText = styled.Text`
  font-size: 20;
  ${({ theme }) => theme.typography.heading3};
  color: ${({ theme }) => theme.palette.grey1};
`

interface Props {
  title: string
  onPress: () => void
}

const AdditionalInfoTab = ({ title, onPress }: Props) => {
  return (
    <Container onPress={onPress}>
      <TitleText>{title}</TitleText>
      <Image source={icons.arrowRight} />
    </Container>
  )
}

export default AdditionalInfoTab
