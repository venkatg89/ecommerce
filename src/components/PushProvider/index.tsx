import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import hmacSHA256 from 'crypto-js/hmac-sha256'
import Hex from 'crypto-js/enc-hex'
import LLLocalytics from 'localytics-react-native'
import { Platform } from 'react-native'

import { myAtgAccountSelector, notificationsSettingSelector } from 'src/redux/selectors/userSelector'
import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'
import { NotificationsModel } from 'src/models/UserModel/NotificationsModel'
import { NotificationSetting } from 'src/constants/notifications'

interface OwnProps {
  children?: React.ReactNode
}

interface StateProps {
  atgAccount: AtgAccountModel | undefined
  notificationsSetting: Nullable<NotificationsModel>
}

const selector = createStructuredSelector({
  atgAccount: myAtgAccountSelector,
  notificationsSetting: notificationsSettingSelector,
})

const connector = connect<StateProps, {}, OwnProps>(selector)

type Props = StateProps & OwnProps

const PushHandler = ({ children, atgAccount, notificationsSetting }: Props) => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      LLLocalytics.registerPush()
    }
  }, [])

  useEffect(() => {
    if (atgAccount) {
      const { atgUserId } = atgAccount
      const hash = hmacSHA256(`${atgUserId}-${__DEV__ ? 'prod' : ''}`, atgUserId).toString(Hex)
      LLLocalytics.setCustomerId(hash)
      if (!notificationsSetting) {
        LLLocalytics.setProfileAttribute({ name: NotificationSetting.CAFE_STATUS_PUSH_ENABLED, value: 1, scope: 'org' })
        LLLocalytics.setProfileAttribute({ name: NotificationSetting.MARKETING_PUSH_ENABLED, value: 1, scope: 'org' })
        LLLocalytics.setProfileAttribute({ name: NotificationSetting.CAFE_OFFERS_PUSH_ENABLED, value: 1, scope: 'org' })
      }
    } else {
      LLLocalytics.setCustomerId(undefined)
    }
  }, [atgAccount])

  return (
    <>
      { children }
    </>
  )
}

export default connector(PushHandler)
