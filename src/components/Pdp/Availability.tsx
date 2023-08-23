import React from 'react'
import { AvailabilityStatus } from 'src/models/BookModel'
import { DELIVERY_OPTIONS, StoreBasicInfo } from 'src/screens/pdp/Pdp'
import styled from 'styled-components/native'
import BopisOption from './AvailabilityOptions.tsx/BopisOption'
import ElectronicOption from './AvailabilityOptions.tsx/ElectronicOption'
import OnlineOption from './AvailabilityOptions.tsx/OnlineOption'

const Container = styled.View``

interface OwnProps {
  availabilityStatus: AvailabilityStatus
  bopisStore: StoreBasicInfo | undefined
  isElectronic: boolean
  isBopisAvailable: boolean
  isBopisEligible: boolean
  selectedOption?: DELIVERY_OPTIONS
  onPressChangeStore: () => any
  onSelectOption: (type: DELIVERY_OPTIONS) => any
}

const Availability = ({
  availabilityStatus,
  bopisStore,
  isElectronic,
  isBopisAvailable,
  isBopisEligible,
  onPressChangeStore,
  onSelectOption,
  selectedOption,
}: OwnProps) => {
  return (
    <Container>
      {isElectronic ? (
        <ElectronicOption />
      ) : (
        <>
          <OnlineOption
            inStock={
              availabilityStatus === 'inStock' ||
              availabilityStatus === 'preorder'
            }
            subheading="Free shipping on orders over $35"
            isSelected={selectedOption === DELIVERY_OPTIONS.ONLINE}
            onSelectOption={onSelectOption}
          />
          <BopisOption
            isEmpty={bopisStore?.id === ''}
            inStock={isBopisEligible && isBopisAvailable}
            storeName={bopisStore?.name || ''}
            onPressChangeStore={onPressChangeStore}
            isSelected={selectedOption === DELIVERY_OPTIONS.BOPIS}
            onSelectOption={onSelectOption}
          />
        </>
      )}
    </Container>
  )
}

export default Availability
