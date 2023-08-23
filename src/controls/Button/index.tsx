import React, { useContext } from 'react'
import { AccessibilityProps, Platform } from 'react-native'
import styled from 'styled-components/native'
import { ThemeContext } from 'styled-components'
import DeviceInfo from 'react-native-device-info'
import { TABLET_BUTTON_MAXWIDTH, useResponsiveDimensions } from 'src/constants/layout'
import { debounce } from 'lodash'

export const BUTTON_DEBOUNCE_DELAY = 1000

interface WrapperOptions {
  center?: boolean
  end?: boolean
  flex1?: boolean
  isAnchor?: boolean
}

interface ContainerOptions {
  selected?: boolean
  maxWidth?: boolean
  isAnchor?: boolean
  disabled?: boolean
  flex1?: boolean
  linkGreen?: boolean
  currentWidth: number
}

interface TextOptions {
  variant?: string
  selected?: boolean
  linkGreen?: boolean
}

const AnchorContainer = styled.View`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing(2)};
  left: ${({ theme }) => theme.spacing(2)};
  right: ${({ theme }) => theme.spacing(2)};
`

const ButtonWrapper = styled.View<WrapperOptions>`
  ${({ flex1 }) => flex1 && 'flex: 1;'}
  flex-direction: row;
  ${({ center, isAnchor }) => (center || isAnchor) && 'align-self: center;'}
  ${({ end }) => end && 'align-self: flex-end;'}
  ${({ theme, isAnchor }) => isAnchor && theme.boxShadow.button};

`

const OutlinedContainer = styled.TouchableOpacity<ContainerOptions>`
  ${({ flex1 }) => (flex1 ? 'flex: 1;' : '')}
  flex-direction: row;
  justify-content: center;
  padding: ${({ theme, isAnchor }) => (isAnchor ? `${theme.spacing(2)}px` : `${theme.spacing(1)}px ${theme.spacing(2)}px`)};
  border: ${props => (props.selected ? 'none' : `1px solid ${props.linkGreen ? props.theme.palette.linkGreen : props.theme.palette.grey2}`)};
  border-radius: 2;
  background-color: ${props => (props.selected ? props.theme.palette.grey5 : props.theme.palette.white)};
  width: ${({ maxWidth, isAnchor }) => ((maxWidth || isAnchor) ? '100%' : 'auto')};
  align-items: center;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  ${({ maxWidth, isAnchor, currentWidth }) => DeviceInfo.isTablet() && (maxWidth || isAnchor) && `max-width: ${TABLET_BUTTON_MAXWIDTH(currentWidth)}`};
`

const DefaultContainer = styled.TouchableOpacity<ContainerOptions>`
  ${({ flex1 }) => flex1 && 'flex: 1;'}
  flex-direction: row;
  justify-content: center;
  width: ${({ maxWidth, isAnchor }) => ((maxWidth || isAnchor) ? '100%' : 'auto')};
  ${({ theme, isAnchor }) => (isAnchor ? (`padding: ${theme.spacing(2)}px;`) : '')}
  align-items: center;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  ${({ maxWidth, isAnchor, currentWidth }) => DeviceInfo.isTablet() && (maxWidth || isAnchor) && `max-width: ${TABLET_BUTTON_MAXWIDTH(currentWidth)}`};
`

const ContainedContainer = styled.TouchableOpacity<ContainerOptions>`
  ${({ flex1 }) => (flex1 ? 'flex: 1;' : '')}
  flex-direction: row;
  justify-content: center;
  background-color: ${({ theme, disabled }) => (disabled ? theme.palette.disabledGrey : theme.palette.primaryGreen)};
  width: ${({ maxWidth, isAnchor }) => ((maxWidth || isAnchor) ? '100%' : 'auto')};
  ${({ theme, isAnchor }) => (isAnchor ? (`padding: ${theme.spacing(2)}px;`) : '')}
  align-items: center;
  border-radius: 2;
  ${({ maxWidth, isAnchor, currentWidth }) => DeviceInfo.isTablet() && (maxWidth || isAnchor) && `max-width: ${TABLET_BUTTON_MAXWIDTH(currentWidth)}`};
`
const OutlinedText = styled.Text<TextOptions>`
  color: ${props => (props.selected ? props.theme.palette.grey2 : (props.linkGreen ? props.theme.palette.linkGreen : props.theme.palette.grey1))};
  text-transform: uppercase;
`

const DefaultText = styled.Text<TextOptions>`
  text-transform: uppercase;
  color: ${(props) => {
    if (props.linkGreen) {
      return props.theme.palette.linkGreen
    }
    if (props.variant === 'contained') {
      return props.theme.palette.white
    }
    return props.theme.palette.grey1
  }
};
`

const IconContainer = styled.View<Pick<ButtonProps, 'variant'>>`
  flex-direction: row;
  align-items: center;
  ${({ theme, variant }) => variant === 'contained' && `margin: ${theme.spacing(-1)}px;`}
`

// A temporary stop-gap for displaying that the button was pressed and is busy.
const SpinnerIOS = styled.ActivityIndicator`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right:0;
  width: 0;
  transform: translateX(20px) scale(1.2);
`

const SpinnerAndroid = styled.ActivityIndicator`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right:0;
  width: 0;
  transform: translateX(16px) scale(1.4);
`

export type Variant = 'default' | 'outlined' | 'contained'
export type Size = 'regular' | 'small'
interface ButtonProps extends AccessibilityProps {
  style?: any
  children?: any
  onPress: (any?) => void
  disabled?: boolean
  variant?: Variant
  selected?: boolean
  textStyle?: any
  size?: Size
  maxWidth?: boolean
  icon?: boolean
  center?: boolean
  flex?: boolean
  end?: boolean
  showSpinner?: boolean
  linkGreen?: boolean
  isAnchor?: boolean
  overrideTextStyle?: object
  large?: boolean
}

const Button = ({
  // Accessibility props to pass down to Touchable
  accessible,
  accessibilityIgnoresInvertColors,
  accessibilityHint,
  accessibilityLabel,
  accessibilityRole,
  accessibilityState,

  style,
  children,
  onPress,
  disabled,
  variant,
  selected = false,
  textStyle,
  maxWidth,
  size = 'regular',
  center,
  end,
  icon,
  flex,
  linkGreen,
  showSpinner,
  isAnchor,
  overrideTextStyle,
  large,
}: ButtonProps) => {
  const { width } = useResponsiveDimensions()
  let Container
  switch (variant) {
    case 'outlined':
      Container = OutlinedContainer
      break
    case 'contained':
      Container = ContainedContainer
      break
    default:
      Container = DefaultContainer
  }
  let TextContainer
  if (icon) {TextContainer = IconContainer}
  else {TextContainer = variant === 'outlined' ? OutlinedText : DefaultText}
  const { typography } = useContext(ThemeContext)
  const text = overrideTextStyle ? overrideTextStyle : { ...typography.button[size], ...textStyle }

  const AnchorWrapper = isAnchor ? AnchorContainer : React.Fragment

  const spinner = React.useMemo(() => Platform.select({
    ios: (<SpinnerIOS
      accessibilityLabel={ showSpinner ? 'loading' : ' ' }
      size="small"
      animating={ !!showSpinner }
      hidesWhenStopped
    />),
    android: showSpinner ? (
      <SpinnerAndroid
        accessibilityLabel={ showSpinner ? 'loading' : ' ' }
        size="small"
        color="white"
      />
    ) : <React.Fragment />,
  }), [showSpinner])


  let handlePress
  if (onPress) {handlePress = debounce(onPress, BUTTON_DEBOUNCE_DELAY, { leading: true, trailing: false })}

  return (
    <AnchorWrapper>
      <ButtonWrapper center={ center } end={ end } flex1={ flex } isAnchor={ isAnchor }>
        <Container
          currentWidth={ width }
          accessible={ accessible }
          accessibilityIgnoresInvertColors={ accessibilityIgnoresInvertColors }
          accessibilityHint={ accessibilityHint }
          accessibilityLabel={ accessibilityLabel }
          accessibilityRole={ accessibilityRole || 'button' }
          accessibilityState={ { disabled, ...accessibilityState } }
          maxWidth={ maxWidth }
          isAnchor={ (isAnchor || large) }
          selected={ selected }
          onPress={ handlePress }
          disabled={ disabled || showSpinner }
          style={ style }
          flex1={ flex }
          linkGreen={ linkGreen }
        >
          <TextContainer variant={ variant } style={ text } linkGreen={ linkGreen }>
            {children}
          </TextContainer>
          { spinner }
        </Container>
      </ButtonWrapper>
    </AnchorWrapper>
  )
}

export default Button
