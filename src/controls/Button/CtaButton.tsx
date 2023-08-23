import React from 'react'
import { ImageSourcePropType } from 'react-native'
import styled from 'styled-components/native'

import Button from 'src/controls/Button'

interface WarningProp {
  warning?: boolean;
}
const Wrapper = styled.View`
  flex-direction: row;
  margin-vertical: ${({ theme }) => theme.spacing(2)};
  align-items: center;
`

const Icon = styled.Image<WarningProp>`
  height: ${({ theme }) => theme.spacing(3)};
  width: ${({ theme }) => theme.spacing(3)};
  ${({ theme, warning }) => (warning ? `tint-color: ${theme.palette.supportingError};` : '')}
`

const ButtonLabel = styled.Text<WarningProp>`
  flex: 1;
  margin-left: ${({ theme }) => theme.spacing(1)};
  ${({ theme }) => theme.typography.body1}
  color: ${({ theme, warning }) => (warning ? theme.palette.supportingError : theme.palette.grey1)};
`

interface Props extends WarningProp {
  icon: ImageSourcePropType;
  label: string;
  onPress: () => void;
  accessibilityLabel?: string
}

export default ({ icon, label, onPress, warning, accessibilityLabel }: Props) => (
  <Button icon maxWidth onPress={ onPress }>
    <Wrapper>
      <Icon source={ icon } warning={ warning } />
      <ButtonLabel accessibilityLabel={ accessibilityLabel } warning={ warning }>{ label }</ButtonLabel>
    </Wrapper>
  </Button>
)
