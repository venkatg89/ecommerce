import React from 'react'

import styled from 'styled-components/native'
import { SimpleMember } from 'src/models/Communities/QuestionModel'
import UserIcon from 'src/components/UserIconList/UserIcon'
import FollowButton from 'src/components/MembersList/FollowButton'
import { push, Routes, Params } from 'src/helpers/navigationService'

interface RowProps {
  container?: boolean
}

const Row = styled.TouchableOpacity<RowProps>`
  flex-direction: row;
  align-items: center;
  ${({ container }) => (container && 'justify-content: space-between')}
`
const Details = styled.View`
  flex-direction: row;
  align-items: center;
`

const Name = styled.Text`
  ${({ theme }) => theme.typography.body1}
  color: ${({ theme }) => theme.palette.grey2};
  padding-left: ${({ theme }) => theme.spacing(1)};
`

interface Props {
  member: SimpleMember
}

const RecommendedUserListItem = ({ member }:Props) => {
  const onPress = () => push(Routes.PROFILE__MAIN, { [Params.MILQ_MEMBER_UID]: member.uid })
  return (
    <Row container onPress={ onPress }>
      <Details>
        <UserIcon userId={ member.uid } size="xlg" />
        <Name numberOfLines={ 1 }>{ member.name }</Name>
      </Details>
      <FollowButton uid={ member.uid } />
    </Row>
  )
}

export default RecommendedUserListItem
