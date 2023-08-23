export default (obj: object, term: string, keys: string | string[]) => {
  if (!term) {
    return false
  }
  const termLowerCase = term.toLowerCase()
  const keysArray = Array.isArray(keys) ? keys : [keys]
  for (let i = 0; i < keysArray.length; i++) {
    const val = obj[keysArray[i]]
    if (typeof val === 'string' || val.length > 0) {
      const valLowerCase = val.toLowerCase()
      if (valLowerCase.includes(termLowerCase)) {
        return true
      }
    }
  }
  return false
}
