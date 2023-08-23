import React from 'react'
import styled from 'styled-components/native'
import { StyleProp, ViewStyle } from 'react-native'

import { icons } from 'assets/images'

interface TextProps {
  error?: boolean
  errorHight?: boolean
}

const HelperContainer = styled.View<TextProps>`
  flex: 1;
  flex-direction: row;
  align-items: flex-start;
  ${({ errorHight }) => (errorHight ? 'min-height: 60' : 'min-height: 20')}
`
const ErrorIcon = styled.Image`
  width: ${({ theme }) => theme.spacing(2)};
  height: ${({ theme }) => theme.spacing(2)};
  tint-color: ${({ theme }) => theme.palette.supportingError};
  margin-right: ${({ theme }) => theme.spacing(1) / 2};
`

const HelperText = styled.Text<TextProps>`
  flex: 1;
  ${({ theme }) => theme.typography.caption};
  color: ${({ theme, error }) =>
    error ? theme.palette.supportingError : theme.palette.grey2};
`

interface OwnProps {
  error?: boolean
  children: string
  style?: StyleProp<ViewStyle>
  errorHight?: boolean
}

type Props = OwnProps

const FormHelperText = ({ error, children, style, errorHight }: Props) => (
  <HelperContainer style={style} errorHight={errorHight}>
    {error && <ErrorIcon source={icons.error} />}
    <HelperText error={error}>{children}</HelperText>
  </HelperContainer>
)

export default FormHelperText
