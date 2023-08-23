import { State } from 'src/redux/reducers'

const EMPTY_OBJECT = {}

export const bookSelector = (state: State, props) => {
  const { ean } = props
  return state.books.model[ean] || EMPTY_OBJECT
}
