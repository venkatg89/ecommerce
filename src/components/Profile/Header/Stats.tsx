import React from 'react'
import styled from 'styled-components/native'

// import convertToNearestUnit from 'src/helpers/convertToNearestUnit'

const Container = styled.TouchableOpacity`
  flex: 1;
  flex-direction: column;
  align-items: center;
`

interface CounterTextProps {
  disabled?: boolean
}

const CountText = styled.Text<CounterTextProps>`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme, disabled }) => (disabled ? theme.palette.disabledGrey : theme.palette.grey1)};
`

const DescriptionText = styled.Text`
  ${({ theme }) => theme.typography.caption};
  color: ${({ theme }) => theme.palette.grey3};
`

interface Props {
  title: string;
  value: number;
  onPress?: () => void;
  disabled?: boolean
}

export default ({ title, value, onPress, disabled }: Props) => (
  <Container onPress={ onPress } disabled={ disabled }>
    <CountText disabled={ disabled }>
      { value }
    </CountText>
    <DescriptionText>
      { title }
    </DescriptionText>
  </Container>
)
