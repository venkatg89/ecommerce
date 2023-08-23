import {
  UpdateAtgAccountDetailsModel,
  AtgAddMembershipModel,
} from 'src/models/UserModel/AtgAccountModel'

import atgApiRequest from 'src/apis/atgGateway'
import {
  ShippingAddress,
  VerifyAddressRequest,
} from 'src/models/ShopModel/CartModel'

/* -= Endpoints =- */

const GET_ACCOUNT_DETAILS_ENDPOINT = '/my-account/getUserDetails'
const UPDATE_ACCOUNT_DETAILS_ENDPOINT = '/my-account/updateUserDetails'
const ADD_MEMBERSHIP_ENDPOINT = '/memberships/addMembershipToProfile'
const GET_ALL_COUNTRIES = '/my-account/getAllCountries'
const GET_ALL_STATES = '/my-account/getAllStatesForCountry'
const GET_ADDRESS_DETAILS = '/my-account/v1/getAddressDetails'
const GET_VERIFY_ADDRESS = '/address-verification/verifyAddress'
const REMOVE_GIFT_CARD = '/gift-card/removeGiftCardFromProfile'
const ADD_GIFT_CARD = '/gift-card/addGiftCardToProfile'
const CHECK_GIFT_CARD_BALANCE = '/gift-card/checkGiftCardBalance'
const SET_DEFAULT_ADDRESS = '/my-account/setDefaultAddressOnProfile'
const ADD_ADDRESS_TO_PROFILE = '/my-account/addAddressToProfile'
const EDIT_ADDRESS_ON_PROFILE = '/my-account/updateAddressOnProfile'
const DELETE_ADDRESS_FROM_PROFILE = '/my-account/deleteAddressFromProfile'

/* -= API Requests =- */

export const getAccountDetails = (atgProfileId: string) =>
  atgApiRequest({
    method: 'POST',
    endpoint: GET_ACCOUNT_DETAILS_ENDPOINT,
    data: { profileId: atgProfileId },
  })

export const updateAccountDetails = (
  atgProfileId: string,
  updateData: UpdateAtgAccountDetailsModel,
) =>
  atgApiRequest({
    method: 'POST',
    endpoint: UPDATE_ACCOUNT_DETAILS_ENDPOINT,
    data: { ...updateData, profileId: atgProfileId },
  })

export const profileRemoveGiftCard = (profileId: string, id: string) =>
  atgApiRequest({
    method: 'POST',
    endpoint: REMOVE_GIFT_CARD,
    data: {
      profileId: profileId,
      id: id,
    },
  })

export const checkGiftCardBalance = (
  profileId: string | undefined,
  mercuryId: string | undefined,
  giftCardNumber: string,
  giftCardPin: string,
) =>
  atgApiRequest({
    method: 'POST',
    endpoint: CHECK_GIFT_CARD_BALANCE,
    data: {
      profileId: profileId,
      mercuryId: mercuryId,
      giftCardNumber: giftCardNumber,
      giftCardPin: giftCardPin,
      recaptcha: 'abc',
    },
  })

export const profileAddGiftCard = (
  profileId: string,
  mercuryId: string,
  giftCardNumber: string,
  giftCardPin: string,
) =>
  atgApiRequest({
    method: 'POST',
    endpoint: ADD_GIFT_CARD,
    data: {
      profileId: profileId,
      giftCardNumber: giftCardNumber,
      giftCardPin: giftCardPin,
      mercuryId: mercuryId,
      recaptcha: 'abc',
    },
  })

export const addMembership = (payload) => {
  const data: AtgAddMembershipModel = {
    programType: 'BNMembership',
    ...payload,
  }

  return atgApiRequest({
    method: 'POST',
    endpoint: ADD_MEMBERSHIP_ENDPOINT,
    data,
  })
}

interface AddFavoriteStoreParams {
  storeId: string
  atgUserId: string
}

export const atgGwSetFavoriteStore = ({
  storeId,
  atgUserId,
}: AddFavoriteStoreParams) =>
  atgApiRequest({
    method: 'POST',
    endpoint: '/my-account/addStoreToProfile',
    data: {
      profileStore: storeId,
      profileId: atgUserId,
    },
  })

export const getAllCountries = () =>
  atgApiRequest({
    method: 'GET',
    endpoint: GET_ALL_COUNTRIES,
  })

export const getAllStates = (countryCode: string) =>
  atgApiRequest({
    method: 'GET',
    endpoint: GET_ALL_STATES,
    params: { countryCode },
  })

export const verifyAddress = (request: VerifyAddressRequest) =>
  atgApiRequest({
    method: 'POST',
    endpoint: GET_VERIFY_ADDRESS,
    data: request,
  })

export const getAddressDetails = (profileId: string) =>
  atgApiRequest({
    method: 'POST',
    endpoint: GET_ADDRESS_DETAILS,
    data: { profileId },
  })

export const editAddresOnProfile = (
  atgProfileId: string,
  address: ShippingAddress,
) =>
  atgApiRequest({
    method: 'POST',
    endpoint: EDIT_ADDRESS_ON_PROFILE,
    data: { ...address, profileId: atgProfileId },
  })

export const deleteAddressFromProfile = (
  atgProfileId: string,
  addressNickName: string,
) =>
  atgApiRequest({
    method: 'POST',
    endpoint: DELETE_ADDRESS_FROM_PROFILE,
    data: { addressNickName, profileId: atgProfileId },
  })
export const addAddressToProfile = (request: ShippingAddress) =>
  atgApiRequest({
    method: 'POST',
    endpoint: ADD_ADDRESS_TO_PROFILE,
    data: request,
  })

export const updateDefaultAddress = (request: any) =>
  atgApiRequest({
    method: 'POST',
    endpoint: SET_DEFAULT_ADDRESS,
    data: request,
  })
