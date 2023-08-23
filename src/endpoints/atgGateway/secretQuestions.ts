import atgApiRequest from 'src/apis/atgGateway'

const SECRET_QUESTIONS_ENDPOINT = '/my-account/getSecretQuestions'

export const atgSecretQuestions = () => atgApiRequest({
  method: 'GET',
  endpoint: SECRET_QUESTIONS_ENDPOINT,
})

export const normalizeAtgSecretQuestionsResponse = (data: any) => (
  data.secretQuestion as string[]
)
