import React, { useState, useContext } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/native'

import Button from 'src/controls/Button'
import TextField from 'src/controls/form/TextField'
import LoadingIndicator from 'src/controls/progress/LoadingIndicator'
import { CafeCheckoutVerifyPhoneContext } from 'src/screens/cafe/Checkout'

import { CafeProfileModel } from 'src/models/CafeModel/ProfileModel'
import { verifyOtpAction, generateOtpAction } from 'src/redux/actions/verifyMobile'
import { updateCafeProfileData } from 'src/data/cafe/profile'

const Container = styled.View``

const DescriptionText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey2};
`

const BoldText = styled.Text`
  font-weight: bold;
`

const ButtonContainer = styled.View`
  flex-direction: row;
  margin-top: ${({ theme }) => theme.spacing(2)};
`



const TextFieldWrapper = styled.View`
  flex: 1;
`

const ButtonWrapper = styled.View`
  align-self: flex-start;
`

const SubmitButton = styled(Button)`
  min-width: ${({ theme }) => theme.spacing(12)};
  margin-left: ${({ theme }) => theme.spacing(2)};
  height: ${({ theme }) => theme.spacing(7)};
`

interface OwnProps {
  style?: any
  cafeProfile: CafeProfileModel | undefined
}

interface DispatchProps {
  verifyOtp: (params) => boolean
  generateOtp: (params) => boolean
}

const dispatcher = (dispatch) => ({
  verifyOtp: (params) => dispatch(verifyOtpAction(params)),
  generateOtp: (params) => dispatch(generateOtpAction(params)),
})

const connector = connect<{}, DispatchProps, OwnProps>(null, dispatcher,)

type Props = DispatchProps & OwnProps

const VerifyPhoneNumber = ({ style, cafeProfile, verifyOtp, generateOtp }: Props) => {
  const [hasSentSms, setHasSentSms] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [token, setToken] = useState<string>('')
  const { getCafeProfile } = useContext(CafeCheckoutVerifyPhoneContext)

  const generateOtpToken = async () => {
    if (!phoneNumber) { return }
    setIsLoading(true)
    const success = await generateOtp({ phoneNumber })
    if (success) {
      setHasSentSms(phoneNumber)
    }
    setIsLoading(false)
  }

  const verifyOtpToken = async () => {
    if (!token) { return }
    setIsLoading(true)
    const verifiedSuccess = await verifyOtp({ phoneNumber, token })
    if (verifiedSuccess) {
      const success = await updateCafeProfileData({ phoneNumber, verified: true })
      if (success) {
        getCafeProfile()
      }
    }
    setIsLoading(false)
  }

  const renderVerifyPhoneNumber = () => {
    switch (cafeProfile?.isVerified) {
      case undefined: {
        return (
          <LoadingIndicator isLoading />
        )
      }
      case true: {
        return (
          <DescriptionText>Phone number <BoldText>{ cafeProfile?.phoneNumber }</BoldText> verified</DescriptionText>
        )
      }
      case false: {
        if (!hasSentSms) {
          return (<>
            <DescriptionText>We’ll text you a code to verify your phone</DescriptionText>
            <ButtonContainer>
              <TextFieldWrapper>
                <TextField
                  onChange={ setPhoneNumber }
                  onSubmitEditing={ generateOtpToken }
                  label="Mobile Phone Number"
                  disabled={ isLoading}
                  value={ phoneNumber }
                  formId="CafePhoneVerification"
                  formFieldId="PhoneNumber"
                  helperText="US phone only"
                  keyboardType="phone-pad"
                />
              </TextFieldWrapper>
              <ButtonWrapper>
                <SubmitButton
                  onPress={ generateOtpToken }
                  variant="outlined"
                  disabled={ isLoading }
                  linkGreen
                  center
                >
                  Submit
                </SubmitButton>
              </ButtonWrapper>
            </ButtonContainer>
          </>)
        } else {
          return (<>
            <DescriptionText>We sent a code to <BoldText>{ hasSentSms }</BoldText></DescriptionText>
            <ButtonContainer>
              <TextFieldWrapper>
                <TextField
                  onChange={ setToken }
                  onSubmitEditing={ verifyOtpToken }
                  label="Verification Code"
                  disabled={ isLoading}
                  value={ token }
                  formId="CafePhoneVerification"
                  formFieldId="OtpToken"
                />
              </TextFieldWrapper>
              <ButtonWrapper>
                <SubmitButton
                  onPress={ verifyOtpToken }
                  variant="outlined"
                  disabled={ isLoading }
                  linkGreen
                  center
                >
                  Verify
                </SubmitButton>
              </ButtonWrapper>
            </ButtonContainer>
            <SubmitButton
              onPress={ generateOtpToken }
              linkGreen
              size="small"
            >
              Resend Code
            </SubmitButton>
          </>)
        }
      }
    }
  }

  return (
    <Container style={ style }>
      { renderVerifyPhoneNumber() }
    </Container>
  )
}

export default connector(VerifyPhoneNumber)
