import { shuffleArray } from './shuffleHelper'

export const comparePrimitiveArraysOrderInsensitive = (input1: (string | number)[], input2: (string | number)[]) => {
  if (!Array.isArray(input1) || !Array.isArray(input2)) {
    return false
  }

  if (input1.length !== input2.length) {
    return false
  }
  const sortedInput1 = input1.sort((a, b) => (a < b ? -1 : 1))
  const sortedInput2 = input2.sort((a, b) => (a < b ? -1 : 1))
  let i = sortedInput1.length
  while (i > 0) {
    i -= 1
    if (sortedInput1[i] !== sortedInput2[i]) {return false}
  }
  return true
}


export const getUniqueArray = (array) => {
  const result:any = []
  const map = new Map()
  array.forEach((item) => {
    const key = JSON.stringify(item)
    if (!map.has(key)) {
      map.set(key, true)
      result.push(item)
    }
  })
  return result
}

export const getRandomValue = (array, shuffle?: boolean) => {
  let list = array.slice()
  if (shuffle) {
    list = shuffleArray(list)
  }
  return list[Math.floor(Math.random() * list.length)]
}
