import speedetabApiRequest from 'src/apis/speedetab'

import { CafeProfileModel } from 'src/models/CafeModel/ProfileModel'

export const PROFILE = '/identity/user'

export const fetchGetCafeProfile = () => {
  return speedetabApiRequest({
    method: 'GET',
    endpoint: PROFILE,
  })
}

export const fetchUpdateCafeProfile = ({ verified = false, phoneNumber }) => {
  return speedetabApiRequest({
    method: 'PUT',
    endpoint: PROFILE,
    data: {
      phone: phoneNumber,
      phone_verified_externally: verified,
    },
  })
}

export const fetchSetMembershipNumber = ({ bnMembershipNumber, phoneNumber }) => {
  return speedetabApiRequest({
    method: 'PUT',
    endpoint: PROFILE,
    data: {
      bn_member_number: bnMembershipNumber,
      alternate_phone: phoneNumber,
    },
  })
}

export const normalizeCafeProfileResponseDate = (data): CafeProfileModel => {
  const user = data.user
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    phoneNumber: user.phone,
    isVerified: user.phone_verified,
    isBnMembershipVerified: !!user.bn_member_is_valid,
    bnMembershipNumber: user.bn_member_number,
  }
}
