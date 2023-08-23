import React, { useEffect, useState, useContext } from 'react'
import { connect } from 'react-redux'
import TextField from 'src/controls/form/TextField'
import { createStructuredSelector } from 'reselect'
import Header from 'src/controls/navigation/Header'
import styled, { ThemeContext } from 'styled-components/native'
import Button from 'src/controls/Button'
import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'
import { RequestStatus } from 'src/models/ApiStatus'
import {
  myAtgAccountSelector,
  myAtgApiPhoneNumberStatusSelector,
  myAtgApiStatusSelector,
} from 'src/redux/selectors/userSelector'
import { ErrorMessage, FormErrors } from 'src/models/FormModel'
import { editAtgAccountDetails, resetPhoneNumberAPIStatus } from 'src/redux/actions/user/atgAccountAction'
import {
  clearFormFieldErrorMessagesAction,
  setformErrorMessagesAction,
} from 'src/redux/actions/form/errorsAction'
import { pop } from 'src/helpers/navigationService'
import { formErrorsSelector } from 'src/redux/selectors/formSelector'
import { useToast } from 'native-base'
import { ThemeModel } from 'src/models/ThemeModel'
import { getSuccessToastStyle } from 'src/constants/layout'

const Container = styled.View``

const NameHeader = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const TextFieldContainer = styled.View`
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-right: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const SaveChangesButton = styled(Button)`
  padding-vertical: ${({ theme }) => theme.spacing(1.5)};
`

const CurrentEmailAddress = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const CurrentEmailAddressValue = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const Description = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const ErrorText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.supportingError};
  margin-bottom: ${({ theme }) => theme.spacing(0.5)};
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-left: ${({ theme }) => theme.spacing(2)};
`

const FORM_ID = 'AccountPhoneNumber'
const PHONE_NUMBER_ID = 'phoneNumber'
const CONFIRM_PHONE_NUMBER_ID = 'confirmPhoneNumber'

interface StateProps {
  atgAccount?: AtgAccountModel
  atgApiStatus: Nullable<RequestStatus>
  phoneNumberApiStatus: Nullable<RequestStatus>
  formError: FormErrors
}

const selector = createStructuredSelector({
  atgAccount: myAtgAccountSelector,
  atgApiStatus: myAtgApiStatusSelector,
  phoneNumberApiStatus: myAtgApiPhoneNumberStatusSelector,
  formError: formErrorsSelector,
})

interface DispatchProps {
  editPhoneNumber: (phoneNumber: string, confirmPhoneNumber: string) => void
  setError: (error: ErrorMessage) => void
  clearError: (fieldId: string) => void
  resetPhoneNumberApiStatus: () => void
}

const dispatcher = (dispatch) => ({
  editPhoneNumber: (phoneNumber: string, confirmPhoneNumber: string) =>
    dispatch(
      editAtgAccountDetails({
        mobileNumber: phoneNumber,
        confirmMobileNumber: confirmPhoneNumber,
        changeMobileNumber: true,
      }),
    ),
  resetPhoneNumberApiStatus: () => dispatch(resetPhoneNumberAPIStatus()),
  setError: (error) => dispatch(setformErrorMessagesAction(FORM_ID, [error])),
  clearError: (fieldId) =>
    dispatch(
      clearFormFieldErrorMessagesAction({
        formId: FORM_ID,
        formFieldId: fieldId,
      }),
    ),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps

const AccountPhoneNumberScreen = ({
  atgAccount,
  editPhoneNumber,
  phoneNumberApiStatus,
  atgApiStatus,
  setError,
  clearError,
  resetPhoneNumberApiStatus,
  formError,
}: Props) => {
  const toast = useToast()
  const theme = useContext(ThemeContext) as ThemeModel
  const [phoneNumber, setPhoneNumber] = useState('')
  const [confirmPhoneNumber, setConfirmPhoneNumber] = useState('')
  const [isEdited, setIsEdited] = useState(false)

  const validateField = (field, formFieldId) => {
    if (!field) {
      setError({
        formFieldId: formFieldId,
        error: 'Field cannot be empty',
      })
      return false
    } else if (!/^[0-9]{10}$/.test(field)) {
      setError({
        formFieldId: formFieldId,
        error: 'Phone Number should be 10 digits',
      })
      return false
    } else if (phoneNumber !== confirmPhoneNumber) {
      setError({
        formFieldId: CONFIRM_PHONE_NUMBER_ID,
        error: 'Phone Number should match',
      })
      return false
    } else {
      clearError(PHONE_NUMBER_ID)
      clearError(CONFIRM_PHONE_NUMBER_ID)
      return true
    }
  }

  useEffect(() => {
    if (!isEdited) {
      return
    }
    validateField(phoneNumber, PHONE_NUMBER_ID)
  }, [phoneNumber])

  useEffect(() => {
    if (!isEdited) {
      return
    }
    validateField(confirmPhoneNumber, CONFIRM_PHONE_NUMBER_ID)
  }, [confirmPhoneNumber])

  useEffect(() => {
    if (phoneNumberApiStatus === RequestStatus.SUCCESS) {
      pop()
      resetPhoneNumberApiStatus()
      /* @ts-ignore */
      toast.show({
        title: 'Changes saved',
        ...getSuccessToastStyle(theme),
      })
    }
  }, [phoneNumberApiStatus])

  useEffect(() => {
    clearError(FORM_ID)
  }, [])

  const SaveChangesButtonHandler = () => {
    let isFormError = false
    const emailValid = validateField(phoneNumber, PHONE_NUMBER_ID)
    const confirmEmailValid = validateField(
      confirmPhoneNumber,
      CONFIRM_PHONE_NUMBER_ID,
    )
    isFormError = !(emailValid && confirmEmailValid)
    if (isFormError) {
      return
    }
    editPhoneNumber(phoneNumber, confirmPhoneNumber)
  }

  const disabled =
    !phoneNumber ||
    phoneNumber !== confirmPhoneNumber ||
    atgApiStatus === RequestStatus.FETCHING

  return (
    <React.Fragment>
      <Container>
        <NameHeader>Mobile Phone Number</NameHeader>
        <CurrentEmailAddress>Current Phone Number</CurrentEmailAddress>
        <CurrentEmailAddressValue>
          {atgAccount?.phoneNumber}
        </CurrentEmailAddressValue>
        <Description>
          For increased account security and future SMS identity verification,
          we recommend adding a primary mobile phone number to your account.
        </Description>
        <Description>
          By adding a mobile phone number to your account, you agree to
          potentially receive SMS messages for account verification (one-time
          codes).
        </Description>
        <TextFieldContainer>
          <TextField
            value={phoneNumber}
            label="Phone Number"
            onChange={(newValue) => {
              setPhoneNumber(newValue)
              setIsEdited(true)
            }}
            autoCorrect={false}
            autoCapitalize="none"
            formFieldId={PHONE_NUMBER_ID}
            formId={FORM_ID}
            style={{ backgroundColor: 'white' }}
          />
        </TextFieldContainer>
        <TextFieldContainer>
          <TextField
            value={confirmPhoneNumber}
            label="Confirm Phone Number"
            onChange={(newValue) => {
              setConfirmPhoneNumber(newValue)
              setIsEdited(true)
            }}
            autoCorrect={false}
            autoCapitalize="none"
            formFieldId={CONFIRM_PHONE_NUMBER_ID}
            formId={FORM_ID}
            style={{ backgroundColor: 'white' }}
          />
        </TextFieldContainer>
        {formError[FORM_ID] && (
          <ErrorText>{formError[FORM_ID].message}</ErrorText>
        )}
      </Container>
      <SaveChangesButton
        onPress={SaveChangesButtonHandler}
        variant="contained"
        maxWidth
        isAnchor
        center
        disabled={disabled}
        showSpinner={atgApiStatus === RequestStatus.FETCHING}
      >
        Save Changes
      </SaveChangesButton>
    </React.Fragment>
  )
}

AccountPhoneNumberScreen.navigationOptions = ({ navigation }) => ({
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default connector(AccountPhoneNumberScreen)
