import React from 'react'
import styled from 'styled-components/native'
import { AccessibilityProps } from 'react-native'

const Button = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  padding-horizontal: ${({ theme }) => theme.spacing(1)}px;
`

interface TitleProps {
  hasDetails?: boolean;
  disabled?: boolean;
}

const Container = styled.View`
  align-self: center;
`

const Title = styled.Text<TitleProps>`
  ${({ theme }) => theme.typography.button.small};
  color: ${({ theme }) => theme.palette.linkGreen};
  text-transform: uppercase;
`

const Details = styled.Text`
  margin-right: 10;
  ${({ theme }) => theme.typography.caption};
  color: ${({ theme }) => theme.palette.grey3};
`

interface Props extends AccessibilityProps{
  title: string;
  onPress?: () => void;
  details?: string;
  disabled?: boolean;
}

export default ({ title, onPress, details, disabled }: Props) => (
  // TODO: accessibility
  <Container>
    {
      details && (
        <Details>
          { details }
        </Details>
      )
    }
    {
      onPress
        ? (
          <Button
            accessibilityLabel={ title }
            accessibilityRole="button"
            onPress={ onPress }
            disabled={ disabled }
          >
            <Title hasDetails={ !!details } disabled={ disabled }>
              { title }
            </Title>
          </Button>
        )
        : (
          <Details>
            { title }
          </Details>
        )
    }
  </Container>
)
