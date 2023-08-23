import React, { useState, useContext } from 'react'
import { connect } from 'react-redux'
import TextField from 'src/controls/form/TextField'
import { createStructuredSelector } from 'reselect'
import Header from 'src/controls/navigation/Header'
import styled, { ThemeContext } from 'styled-components/native'
import Button from 'src/controls/Button'
import _Select from 'src/controls/form/Select'
import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'
import { RequestStatus } from 'src/models/ApiStatus'
import {
  myAtgAccountSelector,
  myAtgApiStatusSelector,
} from 'src/redux/selectors/userSelector'
import { editAtgAccountDetails } from 'src/redux/actions/user/atgAccountAction'
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

const Select = styled(_Select)`
  margin-top: ${({ theme }) => theme.spacing(0.5)};
`

interface StateProps {
  atgAccount?: AtgAccountModel
  atgApiStatus: Nullable<RequestStatus>
}

const selector = createStructuredSelector({
  atgAccount: myAtgAccountSelector,
  atgApiStatus: myAtgApiStatusSelector,
})

interface DispatchProps {
  editSecurityQuestion: (secretQuestionId: string, secretAnswer: string) => void
}

const dispatcher = (dispatch) => ({
  editSecurityQuestion: (secretQuestionId: string, secretAnswer: string) =>
    dispatch(
      editAtgAccountDetails({
        secretQuestionId: secretQuestionId,
        secretAnswer: secretAnswer,
      }),
    ),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps

const securityQuestionOptions = [
  {
    value: 'What is your favourite film?',
  },
  {
    value: 'What is your favourite school?',
  },
  {
    value: 'In what city were you born?',
  },
  {
    value: 'What is the last name of your favorite author?',
  },
  {
    value: "What is your Mother's middle name?",
  },
  {
    value: "What is your Father's middle name?",
  },
  {
    value: 'What is your favorite car?',
  },
  {
    value: "What is your pet's name?",
  },
  {
    value: 'What is your favorite team?',
  },
  {
    value: 'What was the name of your elementary school?',
  },
  {
    value: 'What is your dream job?',
  },
]

const AccountSecurityQuestionScreen = ({
  atgAccount,
  editSecurityQuestion,
  atgApiStatus,
}: Props) => {
  const toast = useToast()
  const theme = useContext(ThemeContext) as ThemeModel
  const [secretQuestionId, setSecretQuestionId] = useState(
    atgAccount?.secretQuestionId || '',
  )
  const [secretAnswer, setSecretAnswer] = useState('')

  const saveChangesButtonHandler = () => {
    editSecurityQuestion(secretQuestionId, secretAnswer)
    pop()
    /* @ts-ignore */
    toast.show({
      title: 'Changes saved',
      ...getSuccessToastStyle(theme),
    })
  }

  const disabled = !secretAnswer || atgApiStatus === RequestStatus.FETCHING

  return (
    <React.Fragment>
      <Container>
        <NameHeader>Change Security Question</NameHeader>
        <TextFieldContainer>
          <Select
            overlayStyle={{ width: '80%' }}
            label={'Security Question'}
            dropdownMargins={{ min: 17, max: 17 }}
            dropdownPosition={-5.2}
            onChange={setSecretQuestionId}
            data={securityQuestionOptions}
            useNativeDriver={false}
            value={secretQuestionId}
            style={{ backgroundColor: 'white' }}
          />
        </TextFieldContainer>
        <TextFieldContainer>
          <TextField
            value={secretAnswer}
            label="Secret Answer"
            onChange={(newValue) => {
              setSecretAnswer(newValue)
            }}
            autoCorrect={false}
            autoCapitalize="none"
            secureTextEntry
            style={{ backgroundColor: 'white' }}
          />
        </TextFieldContainer>
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

AccountSecurityQuestionScreen.navigationOptions = ({ navigation }) => ({
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default connector(AccountSecurityQuestionScreen)
