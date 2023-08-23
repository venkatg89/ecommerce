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
  myAtgApiEmailAddressStatusSelector,
  myAtgApiStatusSelector,
} from 'src/redux/selectors/userSelector'
import { ErrorMessage, FormErrors } from 'src/models/FormModel'
import { editAtgAccountDetails, resetEmailAPIStatus } from 'src/redux/actions/user/atgAccountAction'
import {
  clearFormFieldErrorMessagesAction,
  setformErrorMessagesAction,
} from 'src/redux/actions/form/errorsAction'
import { pop } from 'src/helpers/navigationService'
import checkEmailFormat from 'src/helpers/ui/checkEmailFormat'
import { useToast } from 'native-base'
import { ThemeModel } from 'src/models/ThemeModel'
import { getSuccessToastStyle } from 'src/constants/layout'
import { formErrorsSelector } from 'src/redux/selectors/formSelector'


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
  margin-bottom: ${({ theme }) => theme.spacing(5)};
`

const ErrorText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.supportingError};
  margin-bottom: ${({ theme }) => theme.spacing(0.5)};
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-left: ${({ theme }) => theme.spacing(2)};
`

const FORM_ID = 'AccountEmailAddress'
const EMAIL_ID = 'emailId'
const CONFIRM_EMAIL_ID = 'confirmEmail'

interface StateProps {
  atgAccount?: AtgAccountModel
  atgApiStatus: Nullable<RequestStatus>
  emailAddressApiStatus: Nullable<RequestStatus>
  formError: FormErrors
}

const selector = createStructuredSelector({
  atgAccount: myAtgAccountSelector,
  atgApiStatus: myAtgApiStatusSelector,
  emailAddressApiStatus: myAtgApiEmailAddressStatusSelector,
  formError: formErrorsSelector,
})

interface DispatchProps {
  editProfileEmailAddress: (email: string, confirmEmail: string) => void
  setError: (error: ErrorMessage) => void
  clearError: (fieldId: string) => void
  resetEmailAddressApiStatus: () => void
}

const dispatcher = (dispatch) => ({
  editProfileEmailAddress: (email: string, confirmEmail: string) =>
    dispatch(
      editAtgAccountDetails(
        {
          email: email,
          confirmEmail: confirmEmail,
          changeEmail: true,
        },
        FORM_ID,
      ),
    ),
  resetEmailAddressApiStatus: () => dispatch(resetEmailAPIStatus()),
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

const AccountEmailAddressScreen = ({
  atgAccount,
  editProfileEmailAddress,
  resetEmailAddressApiStatus,
  emailAddressApiStatus,
  atgApiStatus,
  setError,
  clearError,
  formError,
}: Props) => {
  const toast = useToast()
  const theme = useContext(ThemeContext) as ThemeModel
  const [emaild, setEmaild] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [isEdited, setIsEdited] = useState(false)

  const validateField = (field, formFieldId) => {
    if (!field) {
      setError({
        formFieldId: formFieldId,
        error: 'Field cannot be empty',
      })
      return false
    } else if (!checkEmailFormat(field)) {
      setError({
        formFieldId: formFieldId,
        error: 'Please provide a valid email address',
      })
      return false
    } else if (emaild !== confirmEmail) {
      setError({
        formFieldId: CONFIRM_EMAIL_ID,
        error: 'EmailId should match',
      })
      return false
    } else {
      clearError(EMAIL_ID)
      clearError(CONFIRM_EMAIL_ID)
      return true
    }
  }

  useEffect(() => {
    if (!isEdited) {
      return
    }
    validateField(emaild, EMAIL_ID)
  }, [emaild])

  useEffect(() => {
    if (!isEdited) {
      return
    }
    validateField(confirmEmail, CONFIRM_EMAIL_ID)
  }, [confirmEmail])

  useEffect(() => {
    if (emailAddressApiStatus === RequestStatus.SUCCESS) {
      pop()
      resetEmailAddressApiStatus()
      /* @ts-ignore */
      toast.show({
        title: 'Changes saved',
        ...getSuccessToastStyle(theme),
      })
    }
  }, [emailAddressApiStatus])

  useEffect(() => {
    clearError(FORM_ID)
  }, [])

  const saveChangesButtonHandler = () => {
    const emailValid = validateField(emaild, EMAIL_ID)
    const confirmEmailValid = validateField(confirmEmail, CONFIRM_EMAIL_ID)
    let isFormError = false
    isFormError = !(emailValid && confirmEmailValid)
    if (isFormError) {
      return
    }
    editProfileEmailAddress(emaild, confirmEmail)
  }

  const disabled =
    !emaild ||
    emaild !== confirmEmail ||
    atgApiStatus === RequestStatus.FETCHING

  return (
    <React.Fragment>
      <Container>
        <NameHeader>Email Address</NameHeader>
        <CurrentEmailAddress>Current Email Address</CurrentEmailAddress>
        <CurrentEmailAddressValue>{atgAccount?.email}</CurrentEmailAddressValue>
        <TextFieldContainer>
          <TextField
            value={emaild}
            label="New Email Address"
            onChange={(newValue) => {
              setEmaild(newValue)
              setIsEdited(true)
            }}
            autoCorrect={false}
            autoCapitalize="none"
            formFieldId={EMAIL_ID}
            formId={FORM_ID}
            style={{ backgroundColor: 'white' }}
          />
        </TextFieldContainer>
        <TextFieldContainer>
          <TextField
            value={confirmEmail}
            label="Confirm New Email Address"
            onChange={(newValue) => {
              setConfirmEmail(newValue)
              setIsEdited(true)
            }}
            autoCorrect={false}
            autoCapitalize="none"
            formFieldId={CONFIRM_EMAIL_ID}
            formId={FORM_ID}
            style={{ backgroundColor: 'white' }}
          />
        </TextFieldContainer>
        {formError[FORM_ID] && (
          <ErrorText>{formError[FORM_ID].message}</ErrorText>
        )}
      </Container>
      <SaveChangesButton
        onPress={saveChangesButtonHandler}
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

AccountEmailAddressScreen.navigationOptions = ({ navigation }) => ({
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default connector(AccountEmailAddressScreen)
