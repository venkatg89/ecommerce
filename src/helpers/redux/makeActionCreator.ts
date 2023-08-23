export default function<T> (type: string): ActionCreator<T> {
  return payload => ({ type, payload })
}
