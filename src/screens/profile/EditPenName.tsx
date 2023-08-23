import React from 'react'
import styled from 'styled-components/native'
import { Dimensions, ScaledSize } from 'react-native'
import { connect } from 'react-redux'
import { NavigationInjectedProps } from 'react-navigation'
import { createStructuredSelector } from 'reselect'

import Container from 'src/controls/layout/ScreenContainer'
import { CONTENT_HORIZONTAL_PADDING } from 'src/constants/layout'
import Header from 'src/controls/navigation/Header'
import TextField from 'src/controls/form/TextField'
import KeyboardAwareScrollView from 'src/controls/KeyboardAwareScrollView'

import _ScreenHeader from 'src/components/ScreenHeader'

import { ProfileModel as MilqProfileModel } from 'src/models/UserModel'
import { myMilqProfileSelector, userProfilePreferenceAPIStatusSelector } from 'src/redux/selectors/userSelector'
import { editPreferencesAction } from 'src/redux/actions/user/preferencesAction'
import Button from 'src/controls/Button'
import { RequestStatus } from 'src/models/ApiStatus'

interface ScreenHeaderProps {
  currentWidth: number
}

const ScreenHeader = styled(_ScreenHeader)<ScreenHeaderProps>`
  padding-horizontal: ${({ currentWidth }) => CONTENT_HORIZONTAL_PADDING(currentWidth)};
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const NoContent = styled.View``

const Text = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
`

interface State {
  penName: string;
  currentDimension: ScaledSize;
}

interface StateProps {
  milqProfile?: MilqProfileModel;
  milqApiStatus: Nullable<RequestStatus>,
}

const selector = createStructuredSelector({
  milqProfile: myMilqProfileSelector,
  milqApiStatus: userProfilePreferenceAPIStatusSelector,
})

interface DispatchProps {
  editPenName: (newPenName: string, newBio: string) => void;
}

const dispatcher = dispatch => ({
  editPenName: (newPenName: string, newBio: string) => {
    // Why include the bio as well? Because Milq server returns 500 otherwise =(
    dispatch(editPreferencesAction({ description: newBio, name: newPenName }))
  },
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps & NavigationInjectedProps

class ProfileEditPenNameScreen extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }) => ({
    header: headerProps => <Header headerProps={ headerProps } />,
  })

  constructor(props: Props) {
    super(props)
    if (!props.milqProfile) {
      return
    }
    this.state = {
      penName: props.milqProfile!.name,
      currentDimension: Dimensions.get('screen'),
    }
  }

  handleSetDimension = (dims) => {
    this.setState({ currentDimension: dims.screen })
  }

  componentWillMount() {
    Dimensions.addEventListener('change', this.handleSetDimension)
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.handleSetDimension)
  }

  handleChange = value => this.setState({ penName: value })

  handleSave = () => {
    const { milqProfile, editPenName } = this.props
    const { penName } = this.state
    if (milqProfile) {
      milqProfile.name !== penName && editPenName(penName, milqProfile.bio || '')
    }
  }

  render() {
    const { milqProfile, milqApiStatus } = this.props
    const { penName, currentDimension } = this.state
    const { width } = currentDimension
    const textInputStyles = {
      marginHorizontal: CONTENT_HORIZONTAL_PADDING(width),
    }
    if (!milqProfile) {
      return <NoContent />
    }
    const disabled = milqProfile.name === penName.trim() || !penName || milqApiStatus === RequestStatus.FETCHING
    const contentStyle = { flex: 1 }
    return (
      <Container>
        <KeyboardAwareScrollView
          style={ textInputStyles }
          contentContainerStyle={ contentStyle }
        >
          <ScreenHeader
            currentWidth={ width }
            header="Pen Name"
            body={ (
              <Text>
              Edit your pen name. This will be displayed on your profile and will appear with all of your app activity.
              </Text>
          ) }
          />
          <TextField
            value={ penName }
            placeholder="You Pen Name"
            label="Pen Name"
            onChange={ this.handleChange }
            autoFocus
            autoCorrect={ false }
          />

          <Button
            variant="contained"
            maxWidth
            isAnchor
            disabled={ disabled }
            showSpinner={ milqApiStatus === RequestStatus.FETCHING }
            onPress={ this.handleSave }
          >
            Save Changes
          </Button>
        </KeyboardAwareScrollView>
      </Container>
    )
  }
}

export default connector(ProfileEditPenNameScreen)
