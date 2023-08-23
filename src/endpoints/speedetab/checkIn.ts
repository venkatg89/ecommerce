import speedetabApiRequest from 'src/apis/speedetab'

export const checkInUser = (venueId: string) => speedetabApiRequest({
  method: 'POST',
  endpoint: `/users/v1/venues/${venueId}/check-ins`,
})

export const checkOutUser = () => speedetabApiRequest({
  method: 'DELETE',
  endpoint: '/users/v1/check-ins/current',
})

export const getCurrentCheckedIn = () => speedetabApiRequest({
  method: 'GET',
  endpoint: '/users/v1/check-ins/current',
})
