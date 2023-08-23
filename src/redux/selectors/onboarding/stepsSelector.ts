import { State } from 'src/redux/reducers'

export const onboardingStepStateSelector = (stateAny: any) => {
  const state = stateAny as State
  return state.user.onboarding.steps
}
