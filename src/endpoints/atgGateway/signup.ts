import atgApiRequest from 'src/apis/atgGateway'
import { SignupForm } from 'src/redux/actions/login/signupAction'

const SIGNUP_ENDPOINT = '/my-account/createUser'

interface AtgSignupData {
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
  secretQuestionId: string;
  secretAnswer: string;
}

export const atgSignup = (form: SignupForm) => {
  const data = {
    firstName: form.firstName,
    lastName: form.lastName,
    email: form.email,
    confirmEmail: form.email,
    password: form.password,
    confirmPassword: form.password,
    secretQuestionId: form.secretQuestion,
    secretAnswer: form.secretAnswer,
  } as AtgSignupData

  return atgApiRequest({
    method: 'POST',
    endpoint: SIGNUP_ENDPOINT,
    data,
  })
}
