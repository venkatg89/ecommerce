import React from 'react'
import styled from 'styled-components/native'
import { USER_ICON_SIZE } from 'src/components/UserIconList/UserIcon'
import AnswerUserIcon from './AnswerUserIcon'
import { View } from 'react-native'

export const USER_ICON_SPACING = 15

const Container = styled.TouchableHighlight`
  flex-direction: row;
  height: ${USER_ICON_SIZE};
  min-width: ${USER_ICON_SIZE + USER_ICON_SPACING};
  width: 100%;
  overflow: hidden;
  flex-wrap: nowrap;
  background-color: white;
`

const UserCount = styled.View`
  position: absolute;
  padding-top: 3px;
  width: ${USER_ICON_SIZE}px;
  height: ${USER_ICON_SIZE}px;
  border-radius: ${USER_ICON_SIZE / 2}px;
  background-color: rgb(81,82,83);
  left: ${USER_ICON_SPACING * 2}px;
`

const UserCountText = styled.Text`
  width: ${USER_ICON_SIZE}px;
  height: 10px;
  text-align: center;
  font-size: 10px;
  color: white;
`

interface Props {
  style?: any
  users: any[]
  userCount: number
  onPress?
}

class AnswerUserIconList extends React.PureComponent<Props> {
  onPress = () => {
    const { onPress } = this.props
    onPress && onPress()
  }

  render() {
    const { style, users, userCount, onPress } = this.props
    return (
      <Container style={ style } onPress={ onPress }>
        <View>
          { users.slice(0, 2).map((user, index) => (
            <AnswerUserIcon key={ user.uid } position={ index } user={ user } />
          )) }
          { (users.length > 3) && (
            <UserCount>
              <UserCountText
                numberOfLines={ 1 }
              >
                { `${userCount}+` }
              </UserCountText>
            </UserCount>
          ) }
        </View>
      </Container>
    )
  }
}

export default AnswerUserIconList
