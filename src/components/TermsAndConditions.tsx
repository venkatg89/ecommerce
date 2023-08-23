import React, { useEffect } from 'react'
import styled from 'styled-components/native'
import { icons } from 'assets/images'
import { FormErrors } from 'src/models/FormModel'
import { formErrorsSelector } from 'src/redux/selectors/formSelector'
import { createStructuredSelector } from 'reselect'
import {
  clearFormFieldErrorMessagesAction,
  clearFormErrorMessagesAction,
} from 'src/redux/actions/form/errorsAction'
import { connect } from 'react-redux'
import _HelperText from 'src/controls/form/FormHelperText'

const MainContainer = styled.View`
  flex-direction: column;
  padding-vertical: ${({ theme }) => theme.spacing(4)};
`

const TermsContainer = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-self: flex-start;
`
const OptIn = styled.TouchableOpacity`
  width: 24;
  height: 24;
  margin-right: ${({ theme }) => theme.spacing(1)};
`

const Check = styled.Image`
  width: 24;
  height: 24;
`

const AgreeText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  font-size: 14;
  letter-spacing: 0.4;
  color: ${({ theme }) => theme.palette.grey1};
  margin-right: ${({ theme }) => theme.spacing(0.5)};
  align-self: center;
`

const LinkText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  font-size: 14;
  letter-spacing: 0.4;
  color: ${({ theme }) => theme.palette.linkGreen};
  text-decoration: underline;
  align-self: center;
`
const ExtraInfoText = styled.Text`
  ${({ theme }) => theme.typography.caption};
  font-size: 12;
  color: ${({ theme }) => theme.palette.grey3};
  margin-top: ${({ theme }) => theme.spacing(2)};
`

const HelperText = styled(_HelperText)`
  padding-left: ${({ theme }) => theme.spacing(1)};
  margin-top: ${({ theme }) => theme.spacing(1) / 2};
`

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

interface OwnProps {
  onPress: () => void
  onSelect: () => void
  isSelected: boolean
  formId?: string
  formFieldId?: string
}

const connector = connect<StateProps, DispatchProps, OwnProps>(
  selector,
  dispatcher,
)
type Props = StateProps & DispatchProps & OwnProps
const TermsAndConditions = ({
  onSelect,
  onPress,
  isSelected,
  formFieldId,
  formId,
  formErrors,
  clearFormFieldErrorMessages,
  clearFormErrorMessages,
}: Props) => {
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
  }, [isSelected])
  const text = hasError && errorMessage

  return (
    <MainContainer>
      <TermsContainer>
        <OptIn onPress={onSelect}>
          {isSelected ? (
            <Check source={icons.checkboxChecked} />
          ) : (
            <Check source={icons.checkboxUnchecked} />
          )}
        </OptIn>
        <AgreeText>I agree to the</AgreeText>
        <LinkText onPress={onPress}>terms & conditions</LinkText>
      </TermsContainer>
      {!!text && <HelperText error={hasError}>{text}</HelperText>}
      <ExtraInfoText>
        You may receive emails regarding this submission. Any emails will
        include the ability to opt-out of future communications.
      </ExtraInfoText>
    </MainContainer>
  )
}

export default connector(TermsAndConditions)
