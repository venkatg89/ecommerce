import { State } from 'src/redux/reducers'
import { BnMembershipModelRecord } from 'src/models/UserModel/MembershipModel'

export const bnMembershipSelector = (stateAny: any, props: any): Nullable<BnMembershipModelRecord> => {
  const state = stateAny as State
  return state.user.account && state.user.account.membership.bnMembership
}

export const isBnMemberSelector = (stateAny) => {
  const state = stateAny as State
  return (!!bnMembershipSelector(state, {}))
}
