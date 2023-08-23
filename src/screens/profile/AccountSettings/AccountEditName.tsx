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
  myAtgApiStatusSelector,
} from 'src/redux/selectors/userSelector'
import { ErrorMessage } from 'src/models/FormModel'
import { editAtgAccountDetails } from 'src/redux/actions/user/atgAccountAction'
import {
  clearFormFieldErrorMessagesAction,
  setformErrorMessagesAction,
} from 'src/redux/actions/form/errorsAction'
import { pop } from 'src/helpers/navigationService'
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

const FORM_ID = 'AccountName'
const FIRST_NAME_ID = 'firstName'
const LAST_NAME_ID = 'lastName'

interface StateProps {
  atgAccount?: AtgAccountModel
  atgApiStatus: Nullable<RequestStatus>
}

const selector = createStructuredSelector({
  atgAccount: myAtgAccountSelector,
  atgApiStatus: myAtgApiStatusSelector,
})

interface DispatchProps {
  editProfileName: (first: string, last: string) => void
  setError: (error: ErrorMessage) => void
  clearError: (fieldId: string) => void
}

const dispatcher = (dispatch) => ({
  editProfileName: (first, last) => {
    if (!first || !last) {
      return
    }
    dispatch(editAtgAccountDetails({ firstName: first, lastName: last }))
  },
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

const AccountNameScreen = ({
  atgAccount,
  editProfileName,
  atgApiStatus,
  setError,
  clearError,
}: Props) => {
  const toast = useToast()
  const theme = useContext(ThemeContext) as ThemeModel
  const [firstName, setFirstName] = useState(atgAccount?.firstName || '')
  const [lastName, setLastName] = useState(atgAccount?.lastName || '')
  const [isEdited, setIsEdited] = useState(false)

  const validateField = (field, formFieldId) => {
    if (!field) {
      setError({
        formFieldId: formFieldId,
        error: 'Field cannot be empty',
      })
      return false
    } else if (!/^[a-zA-Z]*$/.test(field)) {
      setError({
        formFieldId: formFieldId,
        error: 'Name should be alphabets A-Z',
      })
      return false
    } else {
      clearError(formFieldId)
      return true
    }
  }

  useEffect(() => {
    if (!isEdited) {
      return
    }
    validateField(firstName, FIRST_NAME_ID)
  }, [firstName])

  useEffect(() => {
    if (!isEdited) {
      return
    }
    validateField(lastName, LAST_NAME_ID)
  }, [lastName])

  const firstNameValid = validateField(firstName, FIRST_NAME_ID)
  const lastNameValid = validateField(lastName, LAST_NAME_ID)

  const SaveChangesButtonHandler = () => {
    let isFormError = false
    isFormError = !(firstNameValid && lastNameValid)
    if (isFormError) {
      return
    }
    editProfileName(firstName, lastName)
    pop()
    /* @ts-ignore */
    toast.show({
      title: 'Changes saved',
      ...getSuccessToastStyle(theme),
    })
  }

  const disabled =
    !firstName ||
    !lastName ||
    !firstNameValid ||
    !lastNameValid ||
    atgApiStatus === RequestStatus.FETCHING

  return (
    <React.Fragment>
      <Container>
        <NameHeader>Name</NameHeader>
        <TextFieldContainer>
          <TextField
            value={firstName}
            label="First Name"
            onChange={(newValue) => {
              setFirstName(newValue)
              setIsEdited(true)
            }}
            autoCorrect={false}
            formFieldId={FIRST_NAME_ID}
            formId={FORM_ID}
            style={{ backgroundColor: 'white' }}
          />
        </TextFieldContainer>
        <TextFieldContainer>
          <TextField
            value={lastName}
            label="Last Name"
            onChange={(newValue) => {
              setLastName(newValue)
              setIsEdited(true)
            }}
            autoCorrect={false}
            formFieldId={LAST_NAME_ID}
            formId={FORM_ID}
            style={{ backgroundColor: 'white' }}
          />
        </TextFieldContainer>
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

AccountNameScreen.navigationOptions = ({ navigation }) => ({
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default connector(AccountNameScreen)
