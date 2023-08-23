import { icons } from 'assets/images'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Button from 'src/controls/Button'
import TextField from 'src/controls/form/TextField'
import Alert from 'src/controls/Modal/Alert'
import { Params, push, Routes, WebRoutes } from 'src/helpers/navigationService'
import checkEmailFormat from 'src/helpers/ui/checkEmailFormat'
import { ErrorMessage } from 'src/models/FormModel'
import {
  clearFormFieldErrorMessagesAction,
  setformErrorMessagesAction,
} from 'src/redux/actions/form/errorsAction'
import { setGuestEmailAction } from 'src/redux/actions/guestInfo/guestInfoAction'
import { formErrorsSelector } from 'src/redux/selectors/formSelector'
import { guestEmailSelector } from 'src/redux/selectors/guestSelector'
import styled from 'styled-components/native'

const Container = styled.View``

const CheckboxContainer = styled.TouchableOpacity`
  margin: ${({ theme }) => theme.spacing(2)}px;
  margin-left: 0;
  flex-direction: row;
`

const SignUpText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  flex-wrap: wrap;
  flex: 1;
`

const SignUpContainer = styled.Text`
  flex: 1;
  margin-left: ${({ theme }) => theme.spacing(1)};
`

const Icon = styled.Image`
  height: ${({ theme }) => theme.spacing(3)};
  width: ${({ theme }) => theme.spacing(3)};
`

const EmailAddedContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-vertical: ${({ theme }) => theme.spacing(2)};
`

const EmailText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.black};
`

const AddEmailContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

const ChangeEmailButton = styled(Button)``

const ChangeText = styled.Text`
  font-size: 12;
`

const AddButton = styled(Button)`
  height: 60;
  width: 60;
  margin-left: ${({ theme }) => theme.spacing(2)}px;
`

const AddText = styled.Text`
  margin-horizontal: ${({ theme }) => theme.spacing(2)}px;
`

const EmailRequiredText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  margin-bottom: ${({ theme }) => theme.spacing(1)}px;
`

const PrivacyLinkText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  text-decoration: underline;
  text-decoration-color: ${({ theme }) => theme.palette.grey1};
`

const FORM_ID = 'checkoutEmail'

const selector = createStructuredSelector({
  email: guestEmailSelector,
  formErrors: formErrorsSelector,
})

interface OwnProps {
  isOptedIn: boolean
  onToggle: () => void
}

interface DispatchProps {
  setError: (error: ErrorMessage) => void
  setEmail: (email: string) => void
  clearError: (fieldId: string) => void
}

interface StateProps {
  email: string
}

type Props = OwnProps & DispatchProps & StateProps

const dispatcher = (dispatch) => ({
  setError: (error) => dispatch(setformErrorMessagesAction(FORM_ID, [error])),
  clearError: (fieldId) =>
    dispatch(
      clearFormFieldErrorMessagesAction({
        formId: FORM_ID,
        formFieldId: fieldId,
      }),
    ),
  setEmail: (email) => dispatch(setGuestEmailAction(email)),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(
  selector,
  dispatcher,
)

const EmailOptIn = ({
  setError,
  clearError,
  isOptedIn,
  onToggle,
  email,
  setEmail,
}: Props) => {
  const [newEmail, setNewEmail] = useState(email)
  const [isEdited, setIsEdited] = useState(false)
  const [hasEmail, setHasEmail] = useState(!!email)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (!isEdited) {
      return
    }
    const hasError = !checkEmailFormat(newEmail)
    if (hasError) {
      setError({
        formFieldId: FORM_ID,
        error: 'Please insert a valid email address',
      })
    } else {
      clearError(FORM_ID)
    }
  }, [newEmail])

  return (
    <Container>
      <EmailRequiredText>
        Email address required for order confirmation and shipping updates
      </EmailRequiredText>
      {hasEmail ? (
        <EmailAddedContainer>
          <EmailText>{email}</EmailText>
          <ChangeEmailButton
            linkGreen
            onPress={() => {
              setIsModalOpen(true)
            }}
          >
            <ChangeText>Change</ChangeText>
          </ChangeEmailButton>
        </EmailAddedContainer>
      ) : (
        <AddEmailContainer>
          <TextField
            helperText="For order confirmation and shipping updates"
            placeholder="Email Address"
            value={newEmail}
            onChange={(value) => {
              if (!isEdited) {
                setIsEdited(true)
              }
              setNewEmail(value)
            }}
            formFieldId={FORM_ID}
            formId={FORM_ID}
            style={{ flex: 1 }}
          />
          <AddButton
            disabled={!checkEmailFormat(newEmail)}
            variant="contained"
            onPress={() => {
              const hasError = !checkEmailFormat(newEmail)
              if (!hasError) {
                setEmail(newEmail)
                setHasEmail(true)
              }
            }}
          >
            <AddText>Add</AddText>
          </AddButton>
        </AddEmailContainer>
      )}
      <Alert
        isOpen={isModalOpen}
        onDismiss={() => {
          setIsModalOpen(false)
        }}
        title="Payment Method Will Be Removed"
        description="By changing your email address, your current payment method will be removed and will need to be added in again."
        buttons={[
          {
            title: 'Continue',
            onPress: () => {
              setEmail('')
              setHasEmail(false)
              setIsEdited(false)
              setIsModalOpen(false)
              setNewEmail('')
            },
          },
        ]}
      />
      <CheckboxContainer onPress={onToggle}>
        <Icon
          source={isOptedIn ? icons.checkboxChecked : icons.checkboxUnchecked}
        />
        <SignUpContainer>
          <SignUpText>
            Sign me up to receive Barnes & Nobles offers & updates. You can view
            Barnes & Noble’s Privacy Policy{' '}
          </SignUpText>
          <PrivacyLinkText
            onPress={() => {
              push(Routes.WEBVIEW__WITH_SESSION, {
                [Params.WEB_ROUTE]: WebRoutes.PRIVACY_POLICY,
              })
            }}
          >
            here
          </PrivacyLinkText>
          <SignUpText>. Unsubscribe from our emails at any time.</SignUpText>
        </SignUpContainer>
      </CheckboxContainer>
    </Container>
  )
}

export default connector(EmailOptIn)
