import { AnyAction } from 'redux'

const makeDummyReducer = <S>(defaultState: S) => (state: S = defaultState, _: AnyAction) => state

export default makeDummyReducer
