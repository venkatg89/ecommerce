import { CommunityDictionnary } from 'src/constants/communityDictionnary'

export const extractTypeFromDictionary = (dictionnary, search: CommunityDictionnary) => (
  Object.entries(dictionnary).reduce((result, item) => {
    const [key, value] = item
    const [type] = key.split(':')
    if (type === search) {
      result.push(value)
    }
    return result
  }, [] as any[])
)
