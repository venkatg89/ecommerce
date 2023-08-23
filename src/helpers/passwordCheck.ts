export const passwordCheck = (password: string) => {
  if (password.length > 7 && password.length < 16) {
    return true
  }
  return false
}

export const passwordCheckForAtleastOneUpperCase = (password: string) => {
  return /([A-Z]+)/.test(password)
}

export const passwordCheckForAtleastOneDigit = (password: string) => {
  return /([0-9]+)/.test(password)
}
