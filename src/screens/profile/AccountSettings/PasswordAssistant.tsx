import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Header from 'src/controls/navigation/Header'
import styled from 'styled-components/native'
import Button from 'src/controls/Button'
import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'
import {
  myAtgAccountSelector,
  myAtgApiValidateSecurityStatusSelector,
} from 'src/redux/selectors/userSelector'
import { push, Routes } from 'src/helpers/navigationService'
import { icons } from 'assets/images'
import { passwordResetStatusSelector } from 'src/redux/selectors/apiStatus/login'
import { resetPasswordFetchAction } from 'src/redux/actions/resetPasswordAction'
import TextField from 'src/controls/form/TextField'
import { vaidateSecuritAnswerAction } from 'src/redux/actions/user/validateSecurityAnswerAction'
import { RequestStatus } from 'src/models/ApiStatus'

const Container = styled.View``

const NameHeader = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`

const ContentSetting = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`

const ContentSettingContainer = styled.TouchableOpacity``

const ContinueButton = styled(Button)`
  padding-vertical: ${({ theme }) => theme.spacing(1.5)};
`

const CheckboxCircleIcon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
  margin-left: ${({ theme }) => theme.spacing(2)};
`

const RowContainer = styled.View`
  flex-direction: row;
`

const Description = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const SecurityQuestionContainer = styled.Text`
  ${({ theme }) => theme.typography.subTitle2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-left: ${({ theme }) => theme.spacing(7)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const TextFieldContainer = styled.View`
  margin-left: ${({ theme }) => theme.spacing(7)};
  margin-right: ${({ theme }) => theme.spacing(2)};
`

const ErrorAnswer = styled.Text`
  color: ${({ theme }) => theme.palette.supportingError};
  margin-left: ${({ theme }) => theme.spacing(7)};
  margin-top: ${({ theme }) => theme.spacing(2)};
`

interface StateProps {
  resetPasswordApiStatusFetching: boolean
  atgAccount?: AtgAccountModel
  atgApiStatus: Nullable<RequestStatus>
}

const selector = createStructuredSelector({
  atgAccount: myAtgAccountSelector,
  resetPasswordApiStatusFetching: passwordResetStatusSelector.isInProgress,
  atgApiStatus: myAtgApiValidateSecurityStatusSelector,
})

interface DispatchProps {
  resetPasswordFetch(email: string): void
  validateSecurityAnswer(
    email: string,
    securityQuestionId: string,
    securityAnswer: string,
  )
}

const dispatcher = (dispatch) => ({
  resetPasswordFetch: (email: string) =>
    dispatch(resetPasswordFetchAction(email)),
  validateSecurityAnswer: (
    email: string,
    securityQuestion: string,
    securityAnswer: string,
  ) =>
    dispatch(
      vaidateSecuritAnswerAction(email, securityQuestion, securityAnswer),
    ),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps

const PasswordAssistantScreen = ({
  atgAccount,
  resetPasswordApiStatusFetching,
  atgApiStatus,
  resetPasswordFetch,
  validateSecurityAnswer,
}: Props) => {
  const [link, setLink] = useState(false)
  const [chooseSecurityQuestion, setChooseSecurityQuestion] = useState(false)
  const [securityAnswer, setSecurityAnswer] = useState('')

  useEffect(() => {
    if (atgApiStatus === RequestStatus.SUCCESS) {
      push(Routes.PASSWORD__PASSWORD__ASSISTANT__FORM)
    }
  }, [atgApiStatus])

  const email = atgAccount?.email || ''
  const securityQuestion = atgAccount?.secretQuestionId || ''

  const continueButtonHandler = () => {
    if (link) {
      resetPasswordFetch(email)
      push(Routes.PASSWORD__RESET__MESSAGE)
    } else {
      validateSecurityAnswer(email, securityQuestion, securityAnswer)
    }
  }

  return (
    <React.Fragment>
      <Container>
        <NameHeader>Password Assistant</NameHeader>
        <Description>How would you like to reset your password?</Description>
        <RowContainer>
          <CheckboxCircleIcon
            source={link ? icons.radioSelected : icons.radioDeselected}
          />
          <ContentSettingContainer
            onPress={() => {
              setLink(true)
              setChooseSecurityQuestion(false)
            }}
          >
            <ContentSetting>Send a link to my email</ContentSetting>
          </ContentSettingContainer>
        </RowContainer>
        <RowContainer>
          <CheckboxCircleIcon
            source={
              chooseSecurityQuestion
                ? icons.radioSelected
                : icons.radioDeselected
            }
          />
          <ContentSettingContainer
            onPress={() => {
              setChooseSecurityQuestion(true)
              setLink(false)
            }}
          >
            <ContentSetting>Answer my security question</ContentSetting>
          </ContentSettingContainer>
        </RowContainer>
        {chooseSecurityQuestion && (
          <React.Fragment>
            <SecurityQuestionContainer>
              {atgAccount?.secretQuestionId}
            </SecurityQuestionContainer>
            <TextFieldContainer>
              <TextField
                label="Security Answer"
                autoCapitalize="none"
                autoCorrect={false}
                onChange={(newValue) => {
                  setSecurityAnswer(newValue)
                }}
                value={securityAnswer}
              />
            </TextFieldContainer>
            {atgApiStatus === RequestStatus.FAILED && (
              <ErrorAnswer>
                Your security question and answer combination does not match our
                records. Please try again
              </ErrorAnswer>
            )}
          </React.Fragment>
        )}
      </Container>
      <ContinueButton
        onPress={continueButtonHandler}
        variant="contained"
        maxWidth
        isAnchor
        center
        disabled={resetPasswordApiStatusFetching}
      >
        continue
      </ContinueButton>
    </React.Fragment>
  )
}

PasswordAssistantScreen.navigationOptions = ({ navigation }) => ({
  title: 'Change Password',
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default connector(PasswordAssistantScreen)
