import milqApi from 'src/apis/milq'

export interface BookRelatedQuestionParams {
  workId: string,
}

export const getBookRelatedQuestions = ({ workId }: BookRelatedQuestionParams) => milqApi({
  method: 'GET',
  /*
   * not part of swagger docs, but is how the browersy apps currently fetches related questions
   * note: becareful the param is workId and not book ean
   */
  endpoint: '/api/v0/questions/products',
  params: {
    workId,
  },
})

export const normalizeBookRelatedQuestionsResponseData = (data: any) => {}
