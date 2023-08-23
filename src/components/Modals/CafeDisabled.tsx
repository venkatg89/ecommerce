import React from 'react'

import Alert from 'src/controls/Modal/Alert'

interface Props {
  isOpen: boolean;
  onDismiss: () => void;
}

const CafeDisabledModal = ({ isOpen, onDismiss }: Props) => (
  <Alert
    isOpen={isOpen}
    onDismiss={onDismiss}
    title="Something went wrong"
    description="We're sorry! An error occurred while trying to access Café. Contact Barnes & Noble Customer Service for support."
    cancelText="Dismiss"
  />
)

export default CafeDisabledModal
