type BnMembershipModel = BnMembershipModelRecord
type EducatorMembershipModel = any // For future release
type KidsClubMembershipModel = any // For future release
type EmployeeMembershipModel = any // For future release

export interface BnMembershipModelRecord {
  lastName: string,
  newEmail: string,
  expirationDate: Date,
  lastUpdate: Date,
  membershipStatus: string,
  renew: boolean,
  memberType: string,
  sendSpecialOffers: boolean,
  contactByEmail: boolean,
  memberBirthDate: number,
  purchaseDate: Date,
  memberBirthMonth: number,
  memberId: string,
  firstName: string,
  termDescription: string
}

export interface MembershipModel {
  cohort: string
  bnMembership: Nullable<BnMembershipModel>
  kidsClub: Nullable<KidsClubMembershipModel> // For future release
  educator: Nullable<EducatorMembershipModel> // For future release
  employee: Nullable<EmployeeMembershipModel> // For future release
}

export interface MembershipWalletPassModel {
  os: string,
  membershipNumber: string,
  expirationDate: string
}
