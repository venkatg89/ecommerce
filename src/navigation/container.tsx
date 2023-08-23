import React, { useEffect } from 'react'
import { createAppContainer } from 'react-navigation'
import { withTheme } from 'styled-components'
import LLLocalytics from 'localytics-react-native'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import hmacSHA256 from 'crypto-js/hmac-sha256'
import Hex from 'crypto-js/enc-hex'
import stringBuilder, { StringBuilderProps } from 'src/higherOrderComponents/stringBuilder'
import withLogger from 'src/higherOrderComponents/withLogger'

import NavigationService from 'src/helpers/navigationService'
import RootStack from 'src/navigation/stack/modals'
import { getMyProfileUidSelector } from 'src/redux/selectors/userSelector'
import { Uid } from 'src/models/UserModel'
import { fetchCurrentOrdersAction } from 'src/redux/actions/cafe/orderAction'

import OfflineNotice from 'src/components/OfflineNotice'


const AppContainer = createAppContainer(RootStack)

const prefix = 'barnesnoble://'
interface StateProps {
  userId: Uid
}

const selector = createStructuredSelector({
  userId: getMyProfileUidSelector,
})

interface DispatchProps {
  fetchCurrentOrders: () => void;
}

const dispatcher = dispatch => ({
  fetchCurrentOrders: () => dispatch(fetchCurrentOrdersAction()),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps & StringBuilderProps

const Root = ({ userId, fetchCurrentOrders, ...restProps }: Props) => {
  useEffect(() => {
    if (userId) {
      const hash = hmacSHA256(`${userId}-${__DEV__ ? 'prod' : ''}`, userId).toString(Hex)
      LLLocalytics.setCustomerId(hash)
    }
  }, [userId])

  return (
    <>
      <AppContainer
        ref={ (ref) => { NavigationService.setTopLevelNavigator(ref) } }
        onNavigationStateChange={ NavigationService.onNavigationStateChange }
        screenProps={ restProps }
        uriPrefix={ prefix }
      />
      <OfflineNotice />
    </>
  )
}

export default withTheme(withLogger(stringBuilder(connector(Root))))
