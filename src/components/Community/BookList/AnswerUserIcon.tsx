import React from 'react'
import styled from 'styled-components/native'

import getProfilePhotoUrl from 'src/helpers/api/milq/getProfilePhotoUrl'
import { USER_ICON_SPACING } from 'src/components/Community/BookList/AnswerUserIconList'

interface AvatarProps {
  position: number;
}

const Avatar = styled.Image<AvatarProps>`
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  margin-right: 8px;
  left: ${({ position }) => USER_ICON_SPACING * position}px;
`

interface Props {
  position: number,
  user,
}

class AnswerUserIcon extends React.PureComponent<Props> {
  render() {
    const { position, user } = this.props
    const uri = getProfilePhotoUrl(user.uid)
    return (
      <Avatar position={ position } source={ { uri } } />
    )
  }
}

export default AnswerUserIcon
