export interface CafeProfileModel {
  id: number
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  isVerified: boolean
  isBnMembershipVerified: boolean
  bnMembershipNumber?: string
}
