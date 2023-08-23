import React from 'react'
import styled from 'styled-components/native'

import _FollowButton from 'src/components/MembersList/FollowButton'
import ProfileImage from './Image'
import Stats from './Stats'

import { push, Routes, Params } from 'src/helpers/navigationService'
import { ProfileModel as MilqProfileModel } from 'src/models/UserModel'
import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'

const Container = styled.View`
  flex-direction: column;
  max-width: 1200;
`

const Main = styled.View`
  flex-direction: row;
  align-content: flex-start;
  margin-top: ${({ theme }) => theme.spacing(1)};
`

const Section = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing(3)};
  align-self: center;
`

const Details = styled.View`
  flex:1;
  margin-left: 20;
  margin-top: 5;
  flex: 1;
`

const Nickname = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
`

const FollowButton = styled(_FollowButton)`
  margin-top: ${({ theme }) => theme.spacing(1)};
`

interface Props {
  milqProfile: MilqProfileModel
  atgAccount?: AtgAccountModel
}

const ProfileHeader = ({ milqProfile, atgAccount }: Props) => {
  const nQnA = milqProfile.createdQuestionCount + milqProfile.agreedAnswerCount
  return (
    <Container>
      <Main>
        <ProfileImage
          uid={ milqProfile.uid }
          uri={ milqProfile.image }
          isOwnProfile={ !!atgAccount }
        />
        <Details>
          <Nickname numberOfLines={ 1 }>
            { milqProfile.name || (atgAccount
              ? `${atgAccount!.firstName} ${atgAccount!.lastName.substr(0, 1)}.`
              : '') }
          </Nickname>
          { !atgAccount && (
            <FollowButton uid={ milqProfile.uid } />
          ) }
        </Details>
      </Main>
      <Section>
        <Stats
          title="Q&A"
          value={ nQnA || 0 }
          disabled={ nQnA === 0 }
          onPress={ () => { push(Routes.PROFILE__QA_POSTS, { [Params.MILQ_MEMBER_UID]: milqProfile.uid, totalQuestions: nQnA }) } }
        />
        <Stats
          title="Followers"
          value={ milqProfile.followerCount || 0 }
          disabled={ milqProfile.followerCount === 0 }
          onPress={ () => { push(Routes.PROFILE__FOLLOWERS, { [Params.MILQ_MEMBER_UID]: milqProfile.uid }) } }
        />
        <Stats
          title="Following"
          value={ milqProfile.followingCount || 0 }
          disabled={ milqProfile.followingCount === 0 }
          onPress={ () => { push(Routes.PROFILE__FOLLOWING, { [Params.MILQ_MEMBER_UID]: milqProfile.uid }) } }
        />
      </Section>
    </Container>
  )
}

export default ProfileHeader
