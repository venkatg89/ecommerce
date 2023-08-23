import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import GuestUserModal from 'src/components/Modals/GuestUser'
import CalendarPermissionModal from 'src/components/Modals/CalendarPermission'
import LocationPermissionModal from 'src/components/Modals/LocationPermission'
import StoreLocationPermissionModal from 'src/components/Modals/StoreLocationPermission'
import CameraPermissionModal from 'src/components/Modals/CameraPermission'
import AccountErrorModal from 'src/components/Modals/AccountError'
import CafeErrorModal from 'src/components/Modals/CafeError'
import CartErrorModal from './Modals/CartError'
import RelogAccount from './Modals/RelogAccount'
import CafeDisabledModal from './Modals/CafeDisabled'

import { GlobalModals } from 'src/constants/globalModals'

import { dismissGlobalModalAction } from 'src/redux/actions/modals/globalModals'
import { activeGlobalModalSelector } from 'src/redux/selectors/widgetSelector'
import PdpErrorModal from './Modals/PdpError'

interface StateProps {
  activeGlobalModal?: string
}

const selector = createStructuredSelector({
  activeGlobalModal: activeGlobalModalSelector,
})

interface DispatchProps {
  dismissModal: () => void
}

const dispatcher = (dispatch) => ({
  dismissModal: () => dispatch(dismissGlobalModalAction()),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps

/*
 * Since this handler won't be able to receive props, try to keep those modals with
 * prop specific actions tied to their parent actioned component instead of here
 */
const GlobalModalHandler = ({ activeGlobalModal, dismissModal }: Props) => (
  <React.Fragment>
    <GuestUserModal
      canContinue={false}
      isOpen={GlobalModals.GUEST_USER === activeGlobalModal}
      onDismiss={dismissModal}
    />
    <GuestUserModal
      canContinue
      isOpen={GlobalModals.GUEST_USER_CONTINUE === activeGlobalModal}
      onDismiss={dismissModal}
    />
    <CalendarPermissionModal
      isOpen={GlobalModals.CALENDAR_PERMISSION === activeGlobalModal}
      onDismiss={dismissModal}
    />
    <LocationPermissionModal
      isOpen={GlobalModals.LOCATION_PERMISSION === activeGlobalModal}
      onDismiss={dismissModal}
    />
    <StoreLocationPermissionModal
      isOpen={GlobalModals.LOCATION_PERMISSION_STORE === activeGlobalModal}
      onDismiss={dismissModal}
    />
    <CameraPermissionModal
      isOpen={GlobalModals.CAMERA_PERMISSION === activeGlobalModal}
      onDismiss={dismissModal}
    />
    <CafeErrorModal
      isOpen={GlobalModals.CAFE_ERROR === activeGlobalModal}
      onDismiss={dismissModal}
    />
    <CartErrorModal
      isOpen={GlobalModals.CART_ERROR === activeGlobalModal}
      onDismiss={dismissModal}
    />
    <PdpErrorModal
      isOpen={GlobalModals.PDP_ERROR === activeGlobalModal}
      onDismiss={dismissModal}
    />
    <AccountErrorModal
      isOpen={GlobalModals.ACCOUNT_ERROR === activeGlobalModal}
      onDismiss={dismissModal}
    />
    <RelogAccount
      isOpen={GlobalModals.RELOG_ACCOUNT === activeGlobalModal}
      onDismiss={dismissModal}
    />
    <CafeDisabledModal
      isOpen={GlobalModals.CAFE_DISABLED === activeGlobalModal}
      onDismiss={dismissModal}
    />
  </React.Fragment>
)

export default connector(GlobalModalHandler)
