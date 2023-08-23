export default (countIn: number, singularWord: string, pluralWord: string) => {
  // To render NaN's on error
  const count = Number(countIn)

  // Pick the appropriate given word
  return (count === 1) ? `1 ${singularWord}` : `${count} ${pluralWord}`
}
