/**
 * Shuffles the array values
 * @param {Array} arr
 * @returns {Array}
 */
export const shuffleArray = (arr) => {
  const result = arr.slice()
  for (let len = result.length, i = len - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }

  return result
}

/**
 * Shuffles the object properties
 * @param {Object} obj
 * @returns {Object}
 */
export const shuffleObject = (obj) => {
  const result = {}
  shuffleArray(Object.keys(obj)).map((item) => {
    result[item] = obj[item]
    return item
  })

  return result
}
