import React, { useCallback, memo } from 'react'
import styled from 'styled-components/native'

import { icons } from 'assets/images'

interface DisabledProps {
  disabled?: boolean
  iconStyle?: string
}

interface Props extends DisabledProps {
  selected: boolean
  style?: any
  children?: React.ReactNode
  onPress(): void
  checkboxStyle?: boolean
  text?: boolean
}

const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`

const Icon = styled.Image<DisabledProps>`
  ${({ theme, iconStyle }) =>
    iconStyle === 'small'
      ? `height: ${theme.spacing(2)}`
      : `height: ${theme.spacing(3)}`};
  ${({ theme, iconStyle }) =>
    iconStyle === 'small'
      ? `width: ${theme.spacing(2)}`
      : `width: ${theme.spacing(3)}`};
`

const TextContainer = styled.Text<DisabledProps>`
  margin-left: ${({ theme }) => theme.spacing(2)};
  ${({ theme }) => theme.typography.subTitle1}
  color: ${({ theme, disabled }) =>
    disabled ? theme.palette.grey5 : theme.palette.grey1};
`

const ChildrenContainer = styled.View`
  flex: 1;
  margin-left: ${({ theme }) => theme.spacing(1)};
`

const RadioButton = ({
  style,
  children,
  onPress,
  selected,
  disabled,
  checkboxStyle,
  text,
  iconStyle,
}: Props) => {
  const renderIconSource = useCallback(() => {
    if (selected) {
      return checkboxStyle ? (
        disabled ? icons.checkboxCheckedDisabled : icons.checkboxChecked
      ) : (
        disabled ? icons.radioSelectedDisabled : icons.radioSelected
      )
    } else {
      return checkboxStyle ? (
        disabled ? icons.checkboxUncheckedDisabled : icons.checkboxUnchecked
      ) : (
        disabled ? icons.radioDeselectedDisabled : icons.radioDeselected
      )
    }
  }, [selected, disabled])

  return (
    <Container
      style={style}
      onPress={onPress}
      accessibilityStates={selected ? ['selected'] : []}
      disabled={disabled}
    >
      <Icon
        source={ renderIconSource() }
        iconStyle={ iconStyle }
      />
      {text ? (
        <TextContainer disabled={disabled}>{children}</TextContainer>
      ) : (
        <ChildrenContainer>{children}</ChildrenContainer>
      )}
    </Container>
  )
}

export default memo(RadioButton)
