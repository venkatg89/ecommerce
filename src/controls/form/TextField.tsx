import React, { useState, useEffect, useRef, useContext } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Animated, Platform, TextInputProps } from 'react-native'
import styled, { ThemeContext } from 'styled-components/native'

import { FormErrors } from 'src/models/FormModel'

import {
  clearFormFieldErrorMessagesAction,
  clearFormErrorMessagesAction,
} from 'src/redux/actions/form/errorsAction'
import { formErrorsSelector } from 'src/redux/selectors/formSelector'

import _HelperText from 'src/controls/form/FormHelperText'
import { ThemeModel } from 'src/models/ThemeModel'

interface ErrorProps {
  hasError: boolean
}

interface InputBaseProps extends ErrorProps {
  label: boolean
  isFocused: boolean
  adornment?: boolean
  noBorder?: boolean
}

interface AndormentProps {
  label: boolean
  startAdornment?: boolean
}

const Container = styled.View`
  position: relative;
  background-color: ${({ theme }) => theme.palette.white};
`

const InputBase = styled.View<InputBaseProps>`
  ${({ noBorder, theme, hasError, isFocused }) =>
    noBorder && !hasError && !isFocused
      ? ''
      : `border: 1px solid ${
          hasError
            ? theme.palette.supportingError
            : isFocused
            ? theme.palette.primaryGreen
            : theme.palette.grey4
        }`};
  border-radius: 2;
  flex-direction: row;
  align-items: center;
`

const Input = styled.TextInput`
  ${({ theme }) => theme.typography.body1};
  /* ios doesn't work with number of lines props */
  ${({ theme, numberOfLines }) =>
    Platform.OS === 'ios' && numberOfLines
      ? `minHeight: ${theme.spacing(numberOfLines * 2)};`
      : ''}
  ${Platform.OS === 'ios'
    ? `
  `
    : ''}
  color: ${({ theme }) => theme.palette.grey1};
  flex: 1;
  padding-left: ${({ theme, startAdornment }) =>
    startAdornment ? 0 : theme.spacing(2)};
  padding-right: ${({ theme, endAdornment }) =>
    endAdornment ? 0 : theme.spacing(2)};
  padding-bottom: ${({ theme, label, noBorder }) =>
    (label ? theme.spacing(1) : theme.spacing(2)) - (noBorder ? 0 : 1)};
  padding-top: ${({ theme, label, noBorder }) => {
    if (label) {
      return theme.spacing(3) - (noBorder ? 0 : 1)
    } else {
      return theme.spacing(2) - (noBorder ? 0 : 1)
    }
  }};
`

const AdornmentContainer = styled.View<AndormentProps>`
  align-items: center;
  padding-horizontal: ${({ theme }) => theme.spacing(1)};
`

const HelperText = styled(_HelperText)`
  padding-left: ${({ theme }) => theme.spacing(1)};
  margin-top: ${({ theme }) => theme.spacing(1) / 2};
`
const Label = styled.Text<ErrorProps>`
  font-family: ${({ theme }) => theme.typography.body1.fontFamily};
  color: ${({ theme, hasError }) =>
    hasError ? theme.palette.supportingError : theme.palette.grey2};
  position: absolute;
  left: ${({ theme }) => theme.spacing(2)};
`

const AnimatedLabel = Animated.createAnimatedComponent(Label)

interface OwnProps extends TextInputProps {
  style?: any
  label?: string
  onChange?: (text: any) => void
  onSubmitEditing?: (event) => void
  description?: string
  formId?: string // for error handling
  formFieldId?: string // for error handling
  helperText?: string
  startAdornment?: React.ReactChild | boolean
  endAdornment?: React.ReactChild | boolean
  disabled?: boolean
  inputRef?: any
  inputStyle?: any
  noBorder?: boolean
}

interface StateProps {
  formErrors: FormErrors
}

const selector = createStructuredSelector({
  formErrors: formErrorsSelector,
})

interface DispatchProps {
  clearFormErrorMessages: (formId: string) => void
  clearFormFieldErrorMessages: (formId: string, formFieldId: string) => void
}

const dispatcher = (dispatch) => ({
  clearFormErrorMessages: (formId) =>
    dispatch(clearFormErrorMessagesAction({ formId })),
  clearFormFieldErrorMessages: (formId, formFieldId) =>
    dispatch(clearFormFieldErrorMessagesAction({ formId, formFieldId })), // eslint-disable-line
})

const connector = connect<StateProps, DispatchProps, OwnProps>(
  selector,
  dispatcher,
)

type Props = StateProps & DispatchProps & OwnProps

const TextField = (props: Props) => {
  const {
    style,
    label,
    value,
    onChange,
    numberOfLines,
    disabled,
    maxLength,
    placeholder,
    formErrors,
    formId,
    formFieldId,
    clearFormFieldErrorMessages,
    clearFormErrorMessages,
    helperText,
    startAdornment,
    endAdornment,
    onFocus,
    inputRef,
    inputStyle,
    noBorder,
    ...restProps
  } = props

  const [isFocused, setFocus] = useState<boolean>(false)
  const _animatedIsFocused = useRef(new Animated.Value(value === '' ? 0 : 1))
    .current
  const { typography, spacing } = useContext(ThemeContext)

  const theme = useContext(ThemeContext) as ThemeModel

  useEffect(() => {
    Animated.timing(_animatedIsFocused, {
      toValue:
        startAdornment || placeholder || isFocused || value !== '' ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }, [isFocused, value])

  const labelStyle = {
    top: _animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [spacing(2), spacing(1)],
    }),
    fontSize: _animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [typography.body1.fontSize, typography.caption.fontSize],
    }),
  }

  const handleFocus = (e) => {
    if (onFocus) {
      onFocus(e)
    }
    setFocus(true)
  }
  const handleBlur = () => setFocus(false)

  let hasError = false
  let errorMessage = ''

  if (formId && formErrors[formId]) {
    if (formFieldId && formErrors[formId] && formErrors[formId][formFieldId]) {
      errorMessage = formErrors[formId][formFieldId]
      hasError = true
    } else if (!formFieldId) {
      // if no formFieldId, but formId has error, make it generic and show error
      hasError = true
    }
  }

  // this will clear on unmount
  useEffect(
    () => () => {
      if (formId && formErrors[formId]) {
        clearFormErrorMessages(formId)
      }
    },
    [],
  )

  useEffect(() => {
    if (hasError && formId && formFieldId) {
      clearFormFieldErrorMessages(formId, formFieldId)
    }
  }, [value])
  const text = hasError ? errorMessage : helperText
  const errorHight = text && text?.length > 120
  return (
    <Container style={style}>
      {label && (
        <AnimatedLabel style={labelStyle} hasError={hasError}>
          {label}
        </AnimatedLabel>
      )}
      <InputBase
        style={inputStyle}
        noBorder={noBorder}
        adornment={!!startAdornment || !!endAdornment}
        label={!!label}
        hasError={hasError}
        isFocused={isFocused}
      >
        {startAdornment && (
          <AdornmentContainer startAdornment label={!!label}>
            {startAdornment}
          </AdornmentContainer>
        )}
        <Input
          style={inputStyle ? inputStyle.text : {}}
          {...restProps}
          ref={inputRef}
          placeholder={placeholder}
          placeholderTextColor={theme.palette.grey2}
          maxLength={maxLength}
          editable={!disabled}
          multiline={!!numberOfLines}
          numberOfLines={numberOfLines}
          value={value}
          onChangeText={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          adornment={!!startAdornment || !!endAdornment}
          label={!!label}
          startAdornment={!!startAdornment}
          endAdornment={!!endAdornment}
        />
        {endAdornment && (
          <AdornmentContainer label={!!label}>
            {endAdornment}
          </AdornmentContainer>
        )}
      </InputBase>
      {!!text && (
        <HelperText error={hasError} errorHight={errorHight}>
          {text}
        </HelperText>
      )}
    </Container>
  )
}

export default connector(TextField)
