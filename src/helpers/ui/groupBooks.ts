import { BookOrEan } from 'src/models/BookModel'

export default (books: BookOrEan[], n: number):BookOrEan[] => {
  const copy = [...books]
  const result: any = []
  while (copy.length) {result.push(copy.splice(0, n))}
  return result
}
