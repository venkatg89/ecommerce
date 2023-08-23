import React from 'react'
import styled from 'styled-components/native'

const Container = styled.TouchableOpacity`
  width: ${({ theme }) => theme.spacing(10)};
  justifyContent: center;
  alignItems: center;
  background-color: ${({ theme }) => theme.palette.supportingError};
`

const ButtonText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1}
  color: ${({ theme }) => theme.palette.white};
`

interface Props {
  onPress?: () => void;
}

const SwipeRemoveComponent = ({ onPress }: Props) => (
  <Container onPress={ onPress }>
    <ButtonText>
      Remove
    </ButtonText>
  </Container>
)

export default SwipeRemoveComponent
