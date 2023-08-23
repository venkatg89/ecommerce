import React from 'react'
import styled from 'styled-components/native'

import UserIcon, { MoreUsersIcon, EACH_USER_ICON_LENGTH, USER_ICON_SIZE } from './UserIcon'
import countLabelText from 'src/helpers/countLabelText'

const Container = styled.TouchableOpacity`
  flex-direction: row;
  height: ${USER_ICON_SIZE};
  min-width: ${USER_ICON_SIZE * 1.5};
  flex-wrap: nowrap;
`

interface State {
  canShowHowManyIcons: number
}

interface Props {
  style?: any
  userIds: string[]
  canShowHowManyIcons?: number
  userCount?: number // use this if ther count is higher than userIds array
  onPress?: () => void
  overlapping?: boolean
}

class UserIconList extends React.PureComponent<Props, State> {
  static defaultProps = {
    onPress: () => {},
  }

  state = {
    canShowHowManyIcons: 0,
  }

  calculateIconsToShow = (event) => {
    const { width } = event.nativeEvent.layout
    const canShowHowManyIcons = Math.max(Math.floor(width / EACH_USER_ICON_LENGTH), 1)
    this.setState({ canShowHowManyIcons })
  }

  render() {
    const { userIds, style, userCount, onPress, overlapping } = this.props
    const canShowHowManyIcons = this.props.canShowHowManyIcons || this.state.canShowHowManyIcons
    return (
      <Container
        accessibilityLabel={ countLabelText(userCount || 0, 'user who agrees', 'users who agree') }
        accessibilityHint="press to view users who agree"
        style={ style }
        onLayout={ this.calculateIconsToShow }
        onPress={ onPress }
        disabled={ !onPress }
      >
        {userIds.length > 0 &&
          userIds.slice(0, canShowHowManyIcons).map((userId, index, arr) => {
            // if icon to show is last and theres still more users, show a different icon
            if (arr.length - 1 === index && index + 1 < userIds.length) {
              return (
                <MoreUsersIcon
                  key={ userId }
                  userId={ userId }
                  usersLeft={ (userCount || userIds.length) - (index + 1) }
                />
              )
            }
            return <UserIcon key={ userId } userId={ userId } overlapping={ overlapping } />
          })}
      </Container>
    )
  }
}

export default UserIconList
