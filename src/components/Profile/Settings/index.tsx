import React, { useState, useEffect } from 'react'
import styled from 'styled-components/native'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'

import TitledSwitch from 'src/controls/TitledSwitch'
import { icons } from 'assets/images'
import Section, { Icon } from './Section'
import Alert from 'src/controls/Modal/Alert'

import Routes from 'src/constants/routes'
import { push } from 'src/helpers/navigationService'

import { ProfileModel as MilqProfileModel } from 'src/models/UserModel'
import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'
import { myNotInterestedList, myNodePrivacySelector } from 'src/redux/selectors/userSelector'
import { Ean } from 'src/models/BookModel'
import { clearMyNotInterestedList } from 'src/redux/actions/legacyHome/markBookAsNotInterestedAction'
import { PrivacyModel } from 'src/models/UserModel/NodeProfileModel'

import { sendMailLogs } from 'src/helpers/logger/logsSender'
import { updatePrivacyAction } from 'src/redux/actions/user/privacyAction'

const Container = styled.View``

const PROFILE_PRIVACY_VALUES = [true, false]
const PUSH_NOTIFACTION_VALUES = ['on', 'off']

const SETTINGS_STATE_POLL_INTERVAL = 500

const WarningIcon = styled(Icon)`
  tint-color: ${({ theme }) => theme.palette.supportingError};
`


interface OwnProps {
  atgAccount: AtgAccountModel
  milqProfile: MilqProfileModel
}

interface StateProps {
  notInterested: Ean[]
  nodePrivacy: PrivacyModel
}

interface DispatchProps {
  clearNotInterested: () => void
  updatePrivacy: (privacyParams) => void
}

const selector = createStructuredSelector({
  notInterested: myNotInterestedList,
  nodePrivacy: myNodePrivacySelector,
})

const dispatcher = dispatch => ({
  clearNotInterested: () => dispatch(clearMyNotInterestedList()),
  updatePrivacy: privacyParams => dispatch(updatePrivacyAction(privacyParams)),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(selector, dispatcher)

type Props = OwnProps & StateProps & DispatchProps

const settings = [
  { title: 'Name', details: 'name', icon: icons.settingEdit, id: 'name' },
  { title: 'Pen Name', details: 'penName', icon: icons.settingEdit, id: 'penName' },
  { title: 'Change Password', icon: icons.settingEdit, id: 'password', details: 'Forgot your password? Change that here too.' },
  { title: 'Profile Privacy', details: 'Public profiles\' lists are visible', control: { left: 'Public', right: 'Private' }, id: 'privacy' },
  { title: 'Push Notifications', details: 'Allow push notifications to get the latest updates', control: { left: 'On', right: 'Off' }, id: 'notifications' },
  { title: '"Not Interested" Recommendations', details: 'Reset {book_length} books that you are not interested', icon: icons.delete, id: 'notInterested', iconColor: 'warning' },
  { title: 'Send Feedback', details: 'Find a problem? Hoping for more? Let us know.', id: 'feedback' },
  { title: 'Legal and Policies', details: 'Terms, Conditions, and App Details', id: 'policies', icon: icons.forward },
]


const ProfileSettings = ({ atgAccount, milqProfile, notInterested, clearNotInterested, nodePrivacy, updatePrivacy }: Props) => {
  const [privacy, setPrivacy] = useState<boolean>(true)
  const [isOpenAlert, setOpen] = useState<boolean>(false)

  const getDetailsText = (id, details) => {
    if (id === 'name') {return `${atgAccount.firstName} ${atgAccount.lastName}`}
    if (id === 'penName') {return milqProfile.name}
    if (id === 'notInterested') {return details.replace('{book_length}', notInterested.length)}
    return details
  }

  const handleChangeSwitch = (id: string) => () => {
    switch (id) {
      case 'privacy':
        updatePrivacy({ profile: !privacy })
        break
      default: break
    }
  }

  const getSwitchValue = (id: string) => {
    switch (id) {
      case 'privacy': return privacy
      default: return false
    }
  }

  const handleOpenModal = () => {
    if (!isOpenAlert && notInterested.length > 0) {setOpen(true)}
    else {setOpen(false)}
  }

  const getOnpress = (id: string) => {
    switch (id) {
      case 'name':
        return () => push(Routes.PROFILE__EDIT_NAME)
      case 'penName':
        return () => push(Routes.PROFILE__EDIT_PEN_NAME)
      case 'feedback':
        return () => sendMailLogs()
      case 'notInterested':
        return handleOpenModal
      case 'policies':
        return () => push(Routes.PROFILE__LEGAL)
      case 'password':
        return () => push(Routes.PROFILE__EDIT_PASSWORD)
      default:
        return null
    }
  }

  const getPossibleValues = (id: string) => {
    switch (id) {
      case 'privacy': return PROFILE_PRIVACY_VALUES
      case 'notifications': return PUSH_NOTIFACTION_VALUES
      default: return ['Off', 'On']
    }
  }

  useEffect(() => {
    if (nodePrivacy.profile) {
      setPrivacy(nodePrivacy.profile.public)
    }
  }, [nodePrivacy.profile])

  // For Settings that are not part of redux
  useEffect(() => {
    // if (nodePrivacy.profile) {
    //   setPrivacy(nodePrivacy.profile.public)
    // }
    const pollFunction = () => {
    }
    pollFunction() // First Run
    // Set Timer
    const pollInterval = setInterval(pollFunction, SETTINGS_STATE_POLL_INTERVAL)
    // Cleanup timer
    return () => clearInterval(pollInterval)
  })

  return (
    <Container>
      {settings.map(setting => (
        <Section
          key={ setting.id }
          onPress={ getOnpress(setting.id)! }
          title={ setting.title }
          details={ getDetailsText(setting.id, setting.details) }
          icon={ setting.icon && setting.iconColor ? <WarningIcon source={ setting.icon } /> : <Icon source={ setting.icon } /> }
        >
          {!!setting.control && (
            <TitledSwitch
              onValueChange={ handleChangeSwitch(setting.id) }
              activeValue={ getSwitchValue(setting.id) }
              values={ getPossibleValues(setting.id) }
              leftText={ setting.control.left }
              rightText={ setting.control.right }
            />
          )}
        </Section>
      ))}
      <Alert
        isOpen={ isOpenAlert }
        onDismiss={ getOnpress('notInterested')! }
        title="Not Interested Recommendations"
        description="All books you've marked as Not Interested in recommendations will be cleared and can be recommended."
        buttons={ [{ title: 'reset list', warning: true, onPress: clearNotInterested }] }
        cancelText="Not Now"
      />
    </Container>
  )
}

export default connector(ProfileSettings)
