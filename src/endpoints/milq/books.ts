import { milqBookSearchInstance } from 'src/apis/milq'

export interface BookSearchParams {
  q: string,
  type: string,
  from: number,
  limit: number
}

export const searchBook = (params: BookSearchParams) => milqBookSearchInstance({
  method: 'GET',
  endpoint: '/api/v0/external/barnes',
  params,
})
