import atgApiRequest from 'src/apis/atgGateway'

const VALIDATE_SECURITY_ANSWER = '/my-account/validateSecurityAnswer'

export const validateSecurityAnswer = (
  email: string,
  securityQuestion: string,
  securityAnswer: string,
) => {
  const data = {
    userEmail: email,
    securityQuestion,
    securityAnswer,
  }

  return atgApiRequest({
    method: 'POST',
    endpoint: VALIDATE_SECURITY_ANSWER,
    data,
  })
}
