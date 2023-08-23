import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'
import LLLocalytics from 'localytics-react-native'

import Header from 'src/controls/navigation/Header'
import _RadioButton from 'src/controls/Button/RadioButton'
import LoadingIndicator from 'src/controls/progress/LoadingIndicator'

import { getNotificationsAction } from 'src/redux/actions/user/notifications'
import { notificationsSettingSelector } from 'src/redux/selectors/userSelector'
import { NotificationsModel } from 'src/models/UserModel/NotificationsModel'
import { NotificationSetting } from 'src/constants/notifications'

const Container = styled.View`
  margin-horizontal: ${({ theme }) => theme.spacing(2)};
`

const LoadingOverlay = styled.View`
  align-items: center;
  justify-content: center;
`

const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const RadioButton = styled(_RadioButton)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const ButtonText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
`

const ContentText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

interface StateProps {
  notifications: Nullable<NotificationsModel>
}

const selector = createStructuredSelector({
  notifications: notificationsSettingSelector,
})

interface DispatchProps {
  getNotifications: () => boolean
}

const dispatcher = (dispatch) => ({
  getNotifications: () => dispatch(getNotificationsAction()),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps

const AccountNotifications = ({ notifications, getNotifications }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [orderStatus, setOrderStatus] = useState<boolean>(false)
  const [offer, setOffer] = useState<boolean>(false)
  const [marketing, setMarketing] = useState<boolean>(false)

  useEffect(() => {
    const callback = async () => {
      await getNotifications()
      setIsLoading(false)
    }
    callback()
  }, [])

  useEffect(() => {
    if (notifications) {
      setOrderStatus(!!notifications[NotificationSetting.CAFE_STATUS_PUSH_ENABLED])
      setOffer(!!notifications[NotificationSetting.CAFE_OFFERS_PUSH_ENABLED])
      setMarketing(!!notifications[NotificationSetting.MARKETING_PUSH_ENABLED])
    }
  }, [notifications])

  const toggleOrderStatus = () => {
    const value = !orderStatus
    setOrderStatus(value)
    LLLocalytics.setProfileAttribute({ name: NotificationSetting.CAFE_STATUS_PUSH_ENABLED, value: value ? 1 : 0, scope: 'org' })
  }

  const toggleOffer = () => {
    const value = !offer
    setOffer(value)
    LLLocalytics.setProfileAttribute({ name: NotificationSetting.CAFE_OFFERS_PUSH_ENABLED, value: value ? 1 : 0, scope: 'org' })
  }

  const toggleMarketing = () => {
    const value = !marketing
    setMarketing(value)
    LLLocalytics.setProfileAttribute({ name: NotificationSetting.MARKETING_PUSH_ENABLED, value: value ? 1 : 0, scope: 'org' })
  }

  if (isLoading) {
    return (
      <LoadingOverlay>
        <LoadingIndicator isLoading />
      </LoadingOverlay>
    )
  }

  return (
    <Container>
      <HeaderText>Notifications</HeaderText>
      <ContentText>Cafe</ContentText>
      <RadioButton
        selected={ orderStatus }
        onPress={ toggleOrderStatus }
        checkboxStyle
      >
        <ButtonText>Order is ready</ButtonText>
      </RadioButton>
      <RadioButton
        selected={ offer }
        onPress={ toggleOffer }
        checkboxStyle
      >
        <ButtonText>Offer</ButtonText>
      </RadioButton>
      <ContentText>Marketing</ContentText>
      <RadioButton
        selected={ marketing }
        onPress={ toggleMarketing }
        checkboxStyle
      >
        <ButtonText>Marketing</ButtonText>
      </RadioButton>
    </Container>
  )
}

AccountNotifications.navigationOptions = ({ navigation }) => ({
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default connector(AccountNotifications)
