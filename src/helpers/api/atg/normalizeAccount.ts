import { MembershipModel, BnMembershipModelRecord } from 'src/models/UserModel/MembershipModel'
import { AtgAccountModel, AddressModel, GiftCardModel } from 'src/models/UserModel/AtgAccountModel'

/* -= Normalizers =- */

const processAtgDate = (dateField) => {
  // Sample returneddate format: "2019-03-14 21:10:50.506"
  // Add 'Z' to the string treat the date as UTC
  const result = new Date(`${dateField}Z`)
  return !Number.isNaN(result.getTime()) ? result : undefined
}

const normalizeBnMembershipDetails = (membershipDetails: any): BnMembershipModelRecord => membershipDetails.bnMembership

export const extractJwtTokenFromLogin = (userDetails: any): string => {
  if (userDetails) {
    if (userDetails.userInfo) {
      return userDetails.userInfo.jtId || ''
    }
  }
  return ''
}

export const normalizeAtgUserDetails = (userDetails: any): AtgAccountModel => {
  const { membershipDetails, userInfo } = userDetails
  const membership: MembershipModel = {
    cohort: membershipDetails.cohort || '',
    bnMembership: normalizeBnMembershipDetails(membershipDetails),
    employee: membershipDetails.employee || null,
    educator: membershipDetails.educator || null,
    kidsClub: membershipDetails.kidsClub || null,
  }

  const inputAddressLists = userInfo.addressList || []
  const addressList: AddressModel[] = inputAddressLists.map(address => ({
    atgAddressId: address.atgAddressId || '',
    mercuryAddressId: address.mercuryAddressId || '',
    firstName: address.firstName || '',
    lastName: address.lastName || '',
    state: address.state || '',
    address1: address.address1 || '',
    address2: address.address2 || '',
    city: address.city || '',
    country: address.country || '',
    postalCode: address.postalCode || '',
    phoneNumber: address.phoneNumber || '',
  }))

  const accountGiftCards = userInfo.giftCardList || []
  const giftCards: GiftCardModel[] = accountGiftCards.map(giftCard => ({
    atgGiftCardId: giftCard.atgUserId || '',
    giftCardBalance: giftCard.giftCardBalance || 0,
    giftCardId: giftCard.giftCardId || '',
    giftCardIndex: giftCard.giftCardIndex || 0,
    giftCardNumber: giftCard.giftCardNumber || '',
    lastModified: giftCard.lastModified || '',
    mercuryAccountId: giftCard.mercuryAccountId || '',
    mercuryEntityId: giftCard.mercuryEntityId || '',
    mercuryPaymentId: giftCard.mercuryPaymentId || '',
  }))

  const accountInfo = userInfo.account
  const atgAccount: AtgAccountModel = {
    atgUserId: accountInfo.atgUserId,
    mercuryUserId: accountInfo.mercuryUserId,
    customerKey: accountInfo.customerKey,

    firstName: accountInfo.firstName,
    lastName: accountInfo.lastName,
    email: accountInfo.email,
    registrationDate: processAtgDate(accountInfo.registrationDate) || new Date(),

    addressList,
    membership,
    giftCards,
    favoriteStoreId: accountInfo.storeId,
    phoneNumber: accountInfo.accountPhoneNumber,
    explicitContentSetting: accountInfo.explicitContentSetting === 'true',
    secretQuestionId: accountInfo.secretQuestionId,
  }

  return atgAccount
}


export const normalizeUserMembership = (userDetails: any): MembershipModel => {
  const { membershipDetails } = userDetails
  return {
    cohort: membershipDetails.cohort || '',
    bnMembership: normalizeBnMembershipDetails(membershipDetails),
    employee: membershipDetails.employee || null,
    educator: membershipDetails.educator || null,
    kidsClub: membershipDetails.kidsClub || null,
  }
}
