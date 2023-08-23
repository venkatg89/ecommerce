import { Action as BaseAction } from 'redux'
import { ThunkAction } from 'redux-thunk'

declare global {
  interface Action<T> extends BaseAction {
    type: string
    payload?: T
  }

  type StateGetter<S> = () => S

  type ThunkedAction<S, R=void> = ThunkAction<Promise<R>, S, void>

  type ActionCreator<T> = (payload?: T) => Action<T>

}

export { }
