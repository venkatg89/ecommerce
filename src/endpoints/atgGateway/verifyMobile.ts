import atgApiRequest from 'src/apis/atgGateway'

export const GENERATE_OTP = '/recaptcha/generateOTPToken'
export const VERIFY_OTP = '/recaptcha/verifyOTPToken'

export const fetchGenerateOtp = ({ phoneNumber }) => {
  return atgApiRequest({
    method: 'POST',
    endpoint: GENERATE_OTP,
    data: {
      channelValue: phoneNumber,
      channel: 'sms',
    },
  })
}

export const fetchVerifyOtp = ({ token, phoneNumber }) => {
  return atgApiRequest({
    method: 'POST',
    endpoint: VERIFY_OTP,
    data: {
      channelValue: phoneNumber,
      channel: 'sms',
      otp: token,
    },
  })
}
