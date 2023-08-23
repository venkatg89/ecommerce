import React from 'react'
import styled from 'styled-components/native'

interface TextProps {
  selected?: boolean;
}

const Container = styled.TouchableOpacity`
  height: 20;
  justify-content: center;
  align-items: center;
`

const Text = styled.Text<TextProps>`
  color: ${({ selected, theme }) => (selected ? theme.font.default : theme.font.light)};
  ${({ selected }) => (selected ? 'font-weight: bold;' : '')}
`

interface Props extends TextProps {
  title: string;
  onPress: () => void;
}

export default ({ title, selected, onPress }: Props) => (
  <Container onPress={ onPress }>
    <Text selected={ selected }>
      { title }
    </Text>
  </Container>
)
