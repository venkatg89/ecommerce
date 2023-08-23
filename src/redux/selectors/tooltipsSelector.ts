// https://github.com/Microsoft/TypeScript/issues/29479
import { State } from 'src/redux/reducers'

export const tooltipsStatusSelector = (state: State, props, name) => state.tooltipsStatus[name]
