import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import LoadingComponent from 'src/components/LoadingComponent'

import { fetchCommunityInterestsAction } from 'src/redux/actions/communities/fetchInterestsAction'
import { reduxAppIsStartingAction } from 'src/redux/actions/startup/appIsStarting'
import { fetchAgreedAnswersAction } from 'src/redux/actions/user/community/agreeAnswersAction'
import { fetchMyRelationsAction } from 'src/redux/actions/user/community/relationsAction'
import { navigateToFirstAppScreenAction } from 'src/redux/actions/onboarding'
import { setUserSessionAction } from 'src/redux/actions/user/sessionsAction'
import { fetchAtgAccountAction } from 'src/redux/actions/user/atgAccountAction'

interface StateProps { }

interface DispatchProps {
  fetchAtgAccount(): void;
  atgHackLogoutIntoAppStart(): void;
  fetchCategories(): void;
  reduxAppIsStarting(): void;
  fetchMyAgreedAnswers(): void;
  fetchMyRelations(): void;
  navigateToFirstAppScreen(): void;
  setUserSession(): void;
}

const dispatcher = dispatch => ({
  fetchAtgAccount: () => dispatch(fetchAtgAccountAction()),
  fetchCategories: () => dispatch(fetchCommunityInterestsAction()),
  reduxAppIsStarting: () => dispatch(reduxAppIsStartingAction()),
  fetchMyAgreedAnswers: () => dispatch(fetchAgreedAnswersAction()),
  fetchMyRelations: () => dispatch(fetchMyRelationsAction()),
  navigateToFirstAppScreen: () => dispatch(navigateToFirstAppScreenAction()),
  setUserSession: () => dispatch(setUserSessionAction()),
})

const selector = createStructuredSelector({ })

const connector = connect<{}, {}, DispatchProps>((selector as unknown as any), dispatcher)

type Props = StateProps & DispatchProps

class RootLoadingScreen extends React.Component<Props> {
  componentDidMount = async () => {
    // Asks reducers to clear state if they need to on app start
    await this.props.reduxAppIsStarting()

    // Fetch the latest data from these APIs
    await this.preFetchApiData()

    // Take it away!
    await this.props.navigateToFirstAppScreen()
  }

  preFetchApiData = async () => {
    // Neede before milq calls. up Milq - it needs the ARRA affinity.
    // TODO REMOVEMILQ this should probably be removed, but I'll leave this here until we decide what to add next
    // await milqFetchInitialARRAffinity()

    // Rest of API-pre fetches
    await Promise.all([
      this.props.fetchAtgAccount(), // Just a way to restore ATG session, if needed. No-op is user is not logged in.
      this.props.fetchCategories(),
      this.props.fetchMyAgreedAnswers(),
      this.props.fetchMyRelations(),
      this.props.setUserSession(), // not an API, but increments the session count
    ])
  }

  render = () => (
    <LoadingComponent />
  )
}

export default connector(RootLoadingScreen)
