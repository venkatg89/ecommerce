import React from 'react'
import styled from 'styled-components/native'
import { Dimensions, ScaledSize } from 'react-native'
import { connect } from 'react-redux'
import { NavigationInjectedProps } from 'react-navigation'
import { createStructuredSelector } from 'reselect'

import Container from 'src/controls/layout/ScreenContainer'
import { CONTENT_HORIZONTAL_PADDING } from 'src/constants/layout'
import Header from 'src/controls/navigation/Header'
import _TextField from 'src/controls/form/TextField'
import _ScreenHeader from 'src/components/ScreenHeader'
import Button from 'src/controls/Button'
import KeyboardAwareScrollView from 'src/controls/KeyboardAwareScrollView'

import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'
import { ErrorMessage } from 'src/models/FormModel'

import { myAtgAccountSelector, myAtgApiStatusSelector } from 'src/redux/selectors/userSelector'
import { editAtgAccountDetails } from 'src/redux/actions/user/atgAccountAction'
import { setformErrorMessagesAction } from 'src/redux/actions/form/errorsAction'
import { RequestStatus } from 'src/models/ApiStatus'

interface HeaderProps {
  currentWidth: number
}

const ScreenHeader = styled(_ScreenHeader)<HeaderProps>`
  padding-horizontal: ${({ currentWidth }) => CONTENT_HORIZONTAL_PADDING(currentWidth)};
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const NoContent = styled.View``

const Text = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
`

const TextField = styled(_TextField)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

interface State {
  firstName: string;
  lastName: string;
  currentDimension: ScaledSize
}

interface StateProps {
  atgAccount?: AtgAccountModel
  atgApiStatus: Nullable<RequestStatus>
}

const selector = createStructuredSelector({
  atgAccount: myAtgAccountSelector,
  atgApiStatus: myAtgApiStatusSelector,
})

const PROFILE_NAME = 'PROFILE_NAME'
interface DispatchProps {
  editProfileName: (first: string, last: string) => void;
  setError: (error: ErrorMessage) => void
}

const dispatcher = dispatch => ({
  editProfileName: (first, last) => {
    if (!first || !last) {return}
    dispatch(editAtgAccountDetails({ firstName: first, lastName: last }))
  },
  setError: error => dispatch(setformErrorMessagesAction(PROFILE_NAME, [error])),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps & NavigationInjectedProps


class ProfileEditNameScreen extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }) => ({
    header: headerProps => <Header headerProps={ headerProps } />,
  })

  constructor(props: Props) {
    super(props)
    if (!props.atgAccount) {
      return
    }
    this.state = {
      firstName: props.atgAccount.firstName,
      lastName: props.atgAccount.lastName,
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

  handleChagneText = field => (value) => {
    this.setState({ [field]: value } as Pick<State, keyof State>)
  }

  handleEndEditing = field => () => {
    const { setError } = this.props
    if (!this.state[field]) {
      const convertText = field.replace(/([A-Z])/g, ' $1')
      const errorText = convertText.charAt(0).toUpperCase() + convertText.slice(1)
      setError({ formFieldId: field, error: `${errorText} field cannot be left blank.` })
    }
  }

  handleSave = () => {
    const { firstName, lastName } = this.state
    const { atgAccount, editProfileName } = this.props
    if (atgAccount) {
      if (firstName && lastName) {
        editProfileName(firstName, lastName)
      }
    }
  }


  render() {
    const { atgAccount, atgApiStatus } = this.props
    const { firstName, lastName, currentDimension } = this.state
    const { width } = currentDimension


    const textInputStyles = {
      marginHorizontal: CONTENT_HORIZONTAL_PADDING(width),
    }

    if (!atgAccount) {
      return <NoContent />
    }

    const atgName = `${atgAccount.firstName}${atgAccount.lastName}`
    const fullName = `${firstName}${lastName}`
    const disabled = !firstName || !lastName || fullName === atgName || atgApiStatus === RequestStatus.FETCHING
    const contentStyle = { flex: 1 }


    return (
      <Container>
        <ScreenHeader
          currentWidth={ width }
          header="Name"
          body={ (
            <Text>
              Edit your first and last name. This is only visible to you and is not displayed on your profile.
            </Text>
          ) }
        />
        <KeyboardAwareScrollView
          style={ textInputStyles }
          contentContainerStyle={ contentStyle }
        >
          <TextField
            value={ firstName }
            label="First Name"
            placeholder="First Name"
            onChange={ this.handleChagneText('firstName') }
            onEndEditing={ this.handleEndEditing('firstName') }
            autoCorrect={ false }
            formId={ PROFILE_NAME }
            formFieldId="firstName"
          />

          <TextField
            value={ lastName }
            label="Last Name"
            onChange={ this.handleChagneText('lastName') }
            placeholder="Last Name"
            onEndEditing={ this.handleEndEditing('lastName') }
            autoCorrect={ false }
            formId={ PROFILE_NAME }
            formFieldId="lastName"
          />

          <Button
            variant="contained"
            onPress={ this.handleSave }
            isAnchor
            maxWidth
            disabled={ disabled }
            showSpinner={ atgApiStatus === RequestStatus.FETCHING }
          >
          Save Changes
          </Button>
        </KeyboardAwareScrollView>
      </Container>
    )
  }
}

export default connector(ProfileEditNameScreen)
