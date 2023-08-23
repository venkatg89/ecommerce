import STRINGS from './source'

export function getRawString(locale: string, stringKey: string) {
  return STRINGS[locale][stringKey]
}
