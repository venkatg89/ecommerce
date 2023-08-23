import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components/native'
import { Platform, TextInputProps } from 'react-native'

import { Dropdown } from '@mopinion-mobile/react-native-material-dropdown'

import { icons } from 'assets/images'

interface SelectorProps {
  title?: boolean
}


const SelectorBase = styled.View<SelectorProps>`
  border: 1px solid ${({ theme }) => theme.palette.grey4};
  border-radius: 2;
  padding-vertical: ${({ theme, title }) => (title ? theme.spacing(1) : 14.8)};
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
  min-width: 60;
  flex-direction: row;
  align-items: center;
`

const LabelText = styled.Text<SelectorProps>`
  ${({ theme, title }) => (title ? theme.typography.caption : theme.typography.body1)};
  color: ${({ theme }) => theme.palette.grey2};
`
const ValueText = styled(LabelText)`
  color: ${({ theme }) => theme.palette.grey1};
  margin-top: ${(Platform.OS === 'ios') ? 3.5 : 6.5}px;
`

const Icon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`

const InputContainer = styled.View`
  flex: 1;
`
// Check https://github.com/n4kz/react-native-material-dropdown to see all available props
// @ts-ignore
interface Props extends TextInputProps {
  label: string
  data: any[]
  onChange: (value) => void
  icon?: any
  valueExtractor?: (arg) => number
  labelExtractor?: (arg) => string
  rippleInsets?: { top: number, bottom: number}
  containerStyle?: any
  style?: any
  dropDownRef?: any
  value: number | string
  disabled?: boolean
  dropdownOffset?: any
}


const Select = (props: Props) => {
  const { typography, palette } = useContext(ThemeContext)
  const { style, label, data, onChange, dropdownOffset, value, icon = icons.expand, dropDownRef, ...restProps } = props
  return (
    <Dropdown
      { ...restProps }
      ref={ dropDownRef }
      label={ label }
      dropdownOffset={dropdownOffset}
      data={ data }
      itemTextStyle={ { ...typography.body1, color: palette.grey1 } }
      value={ value }
      onChangeText={ onChange }
      // rippleInsets={ { top: spacing(3), bottom: -spacing(2) } }
      renderBase={ ({ title }) => (
        <SelectorBase title={ !!title } style={ style }>
          <InputContainer>
            <LabelText title={ !!title }>
              {label}
            </LabelText>
            {!!title && <ValueText>{title}</ValueText> }
          </InputContainer>
          <Icon source={ icon } />
        </SelectorBase>
      ) }
    />

  )
}

export default Select
