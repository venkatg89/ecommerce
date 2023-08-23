import React from 'react'

export interface ReplacementCollection {
  [key: string]: string | number | React.ReactNode
}

// :STRING_KEY: the emoji format

// %{STRING_KEY}
const INTERPOLATION_REGEX = /%\{(\w+)\}/g

// #{STRING_KEY,SINGULAR_FORM,PLURAL_FORM}, use with key #STRING_KEY as object key
const PLURALIZER_REGEX = /#\{(\w+,\w+,\w+)\}/g
const PLURALIZER_KEY_REGEX = /^(\w+)[?^,]/ // extract the key, everything before first comma
const SINGULAR_REGEX = /[?^,](\w+)[?^,]/ // extract singular form, everything between the commas
const PLURAL_REGEX = /[?^,](\w+)$/ // extrac plural form, everything after the second comma

const makeInjectionStringKey = (value) => `:${value}`

const makePluralizerStringKey = (value) => `#${value}`

// this is not combined with interpolate to reduce fragment usage
export function inject(rawString: string, replacements: ReplacementCollection) {
  if (!rawString || !replacements) {
    return rawString
  }

  const rawChunks = rawString.split(':')
  // should always be an odd number of chunks and atleast 3 parts (string, chunk string)
  // otherwise assume a false positive on wanting to inject and use string as is
  if (rawChunks.length < 3 || rawChunks.length % 2 === 0) {
    return rawString
  }

  const transformedChunks = rawChunks.reduce<React.ReactNode[]>(
    (accumulator, currentChunk, index) => {
      if (index % 2 === 0) {
        accumulator.push(currentChunk)
      } else if (currentChunk === '') {
        accumulator.push(':')
      } else {
        const STRING_KEY = makeInjectionStringKey(currentChunk)
        if (STRING_KEY in replacements) {
          accumulator.push(replacements[STRING_KEY])
        } else {
          accumulator.push(`:${currentChunk}:`)
        }
      }

      return accumulator
    },
    [],
  ) // order doesnt change, should safe to ignore key=index error

  /* eslint-disable */ return transformedChunks.map((chunk, index) => (
    <React.Fragment key={index}>{chunk}</React.Fragment>
  ))
  /* eslint-disable */
}

export function interpolate(
  rawString: string,
  replacements: ReplacementCollection,
) {
  if (!rawString || !replacements) {
    return rawString
  }

  return rawString.replace(INTERPOLATION_REGEX, (_, stringKey: string) => {
    const value = replacements[stringKey]
    return value ? String(value) : stringKey
  })
}

export function pluralize(
  rawString: string,
  replacements: ReplacementCollection,
) {
  if (!rawString || !replacements) {
    return rawString
  }

  return rawString.replace(PLURALIZER_REGEX, (_, stringOj: string) => {
    const keyMatches = stringOj.match(PLURALIZER_KEY_REGEX)
    const num =
      keyMatches && replacements[makePluralizerStringKey(keyMatches[1])]

    const regexMatches =
      num === 1 ? stringOj.match(SINGULAR_REGEX) : stringOj.match(PLURAL_REGEX)
    return (regexMatches && regexMatches[1]) || stringOj
  })
}

export function rankParser(rankString: string) {
  let ret: string[] = []
  for (let i = 0, len = rankString.length; i < len; i += 3) {
    ret.push(rankString.substr(i, 3))
  }

  return ret.reverse().join(',')
}
