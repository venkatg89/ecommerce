export const isEmpty = (obj) => {
  if (!obj || typeof obj !== 'object') { return true }
  let empty = true
  Object.keys(obj).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      empty = false
    }
  })
  return empty
}
