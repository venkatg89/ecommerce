import React, { Fragment, useCallback } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import { MemberModel } from 'src/models/UserModel/MemberModel'
import { push, Routes, Params } from 'src/helpers/navigationService'

import UserIcon from 'src/components/UserIconList/UserIcon'
import FollowButton from 'src/components/MembersList/FollowButton'

import { memberSelector } from 'src/redux/selectors/userSelector'
import { isEmpty } from 'src/helpers/objectHelpers'

const Container = styled.TouchableOpacity`
  flex-direction: row;
  width: 100%;
  align-items: center;
`

const Content = styled.View`
  flex: 1;
  margin-left: 16;
  margin-right: 16;
`

const Name = styled.Text`
  color: ${({ theme }) => theme.font.default};
  font-size: 16;
`


interface OwnProps {
  style?: any;
  // eslint-disable-next-line react/no-unused-prop-types
  memberId: string;
}

interface StateProps {
  member: MemberModel;
}

const selector = createStructuredSelector({
  member: (state, ownProps) => {
    const id = ownProps.memberId
    return memberSelector(state, { id })
  },
})

const connector = connect<StateProps, {}, OwnProps>(selector)

type Props = StateProps & OwnProps

const Item = ({ style, member }: Props) => {
  // prevent crash when member doesn't exist in first render
  if (isEmpty(member)) {
    return <Fragment />
  }
  const { profile } = member

  const pushtoProfileScreen = useCallback(() => {
    push(Routes.PROFILE__MAIN, { [Params.MILQ_MEMBER_UID]: profile.uid })
  }, [profile.uid])


  return (
    <Container
      style={ style }
      onPress={ pushtoProfileScreen }
    >
      <UserIcon
        userId={ profile.uid }
        size="xlg"
      />
      <Content>
        <Name numberOfLines={ 1 }>{ profile.name }</Name>
      </Content>
      <FollowButton uid={ profile.uid } />
    </Container>
  )
}

export default connector(Item)
