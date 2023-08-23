import Routes from 'src/constants/routes'

// if we came from feed, remove the search and comment and add question screen, otherwise also remove the old question screen
export const submitAnswerContinueAction = (action, state) => {
  const cameFromAnswerScreen = state.routes[state.routes.length - 3].routeName === Routes.COMMUNITY__QUESTION
  const newRoutes = state.routes.slice(0, state.routes.length - (cameFromAnswerScreen ? 3 : 2))
  newRoutes.push(action)
  return ({
    ...state,
    routes: newRoutes,
    index: newRoutes.length - 1,
  })
}

export enum CustomActions {
  SUBMIT_NEW_ANSWER = 'SubmitedNewAnswerContinue'
}
