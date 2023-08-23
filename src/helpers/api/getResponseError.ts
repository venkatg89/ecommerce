export default (response: APIResponse) => {
  if (response.error) {
    if (response.error.message) {
      return response.error.message
    }
    return String(response.error)
  }
  return 'no response.error'
}
