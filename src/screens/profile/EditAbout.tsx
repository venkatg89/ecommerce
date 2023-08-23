import React, { useState, useMemo } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import _Container from 'src/controls/layout/ScreenContainer'
import { getScrollHorizontalPadding, useResponsiveDimensions } from 'src/constants/layout'
import Header from 'src/controls/navigation/Header'

import { ProfileModel as MilqProfileModel } from 'src/models/UserModel'
import { myMilqProfileSelector, userProfilePreferenceAPIStatusSelector } from 'src/redux/selectors/userSelector'
import { editPreferencesAction } from 'src/redux/actions/user/preferencesAction'
import _KeyboardAwareScrollView from 'src/controls/KeyboardAwareScrollView'
import _TextField from 'src/controls/form/TextField'
import Button from 'src/controls/Button'
import { RequestStatus } from 'src/models/ApiStatus'

interface HeaderProps {
  currentWidth: number
}

const CharLength = styled.Text`
  align-self: flex-end;
  padding-right: ${({ theme }) => theme.spacing(2)};
  padding-top: ${({ theme }) => theme.spacing(1) / 2};
`

const KeyboardAwareScrollView = styled(_KeyboardAwareScrollView)`
`

const Container = styled(_Container)<HeaderProps>`
  padding-horizontal: ${({ theme, currentWidth }) => getScrollHorizontalPadding(theme, currentWidth)};
`

const HeaderContainer = styled.View`  
  padding-top: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const HeaderDesc = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
`

const NoContent = styled.View``

const TextField = styled(_TextField)`
  max-height: ${({ theme }) => theme.spacing(28)};
`

interface StateProps {
  milqProfile?: MilqProfileModel
  milqApiStatus: Nullable<RequestStatus>
}

const selector = createStructuredSelector({
  milqProfile: myMilqProfileSelector,
  milqApiStatus: userProfilePreferenceAPIStatusSelector,
})

interface DispatchProps {
  editProfileBio: (newBio: string) => void;
}

const dispatcher = dispatch => ({
  editProfileBio: (newBio: string) => {
    dispatch(editPreferencesAction({ description: newBio }))
  },
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps

const ProfileEditAboutScreen = ({ milqProfile, editProfileBio, milqApiStatus }:Props) => {
  const { width } = useResponsiveDimensions()
  const [bio, setBio] = useState(milqProfile ? (milqProfile.bio || '') : '')
  const contentStyle = useMemo(() => ({ flex: 1 }), [])

  if (!milqProfile) {return <NoContent />}

  const _onChange = value => setBio(value)
  const _onEditingEnd = () => {
    if (bio !== milqProfile.bio) {
      editProfileBio(bio)
    }
  }

  const disabled = bio.length < 1 || bio === milqProfile.bio || milqApiStatus === RequestStatus.FETCHING
  return (
    <Container currentWidth={ width }>
      <KeyboardAwareScrollView contentContainerStyle={ contentStyle }>
        <HeaderContainer>
          <HeaderText>About</HeaderText>
          <HeaderDesc>Edit your pen name. This will be displayed on your profile and will appear with all of your app activity.</HeaderDesc>
        </HeaderContainer>
        <TextField
          value={ bio }
          placeholder="Your about secition"
          label="About"
          maxLength={ 256 }
          onChange={ _onChange }
          numberOfLines={ 4 }
        />
        <CharLength>{`${bio.length} / 256`}</CharLength>

        <Button
          variant="contained"
          maxWidth
          onPress={ _onEditingEnd }
          isAnchor
          disabled={ disabled }
          showSpinner={ milqApiStatus === RequestStatus.FETCHING }
        >
        Save Changes
        </Button>
      </KeyboardAwareScrollView>
    </Container>
  )
}

ProfileEditAboutScreen.navigationOptions = () => ({
  header: headerProps => <Header headerProps={ headerProps } />,
})

export default connector(ProfileEditAboutScreen)
