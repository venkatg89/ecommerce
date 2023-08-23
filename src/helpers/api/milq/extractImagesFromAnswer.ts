import { AnswerModel } from 'src/models/Communities/AnswerModel'

export const extractBooksFromAnswer = (answers: AnswerModel[]) => answers.map(item => item.product)
