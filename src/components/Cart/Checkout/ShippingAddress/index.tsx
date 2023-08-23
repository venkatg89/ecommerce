import React, { useState } from 'react'
import {
  SelectShippingAddressRequest,
  ShippingAddress,
} from 'src/models/ShopModel/CartModel'
import { CheckoutStepState } from 'src/screens/cart/Checkout'
import AddShippingAddress from './AddShippingAddress'
import SelectShippingAddressCarousel from './SelectShippingAddressCarousel'
import ShippingAddressDetails from './ShippingAddressDetails'

interface OwnProps {
  stepState: CheckoutStepState
  setStepState: (state: CheckoutStepState) => void
  addressList: ShippingAddress[]
  selectShippingAddress: (request: SelectShippingAddressRequest) => void
  isGuest: boolean
  setSelectedAddressIndex: (value: number) => void
  setReloadValue: (value: number) => void
  reloadValue: number
  selectedAddressIndex: number
}

const CartShippingAddress = ({
  stepState,
  setStepState,
  addressList,
  selectShippingAddress,
  isGuest,
  selectedAddressIndex,
  setSelectedAddressIndex,
  reloadValue,
  setReloadValue,
}: OwnProps) => {
  const [addAddress, setAddAddress] = useState(false)
  const [editAddress, setEditAddress] = useState(false)
  const [editAddressSelection, setEditAddressSelection] = useState(
    stepState !== CheckoutStepState.COMPLETE,
  )

  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleAddBtn = () => {
    setAddAddress(true)
    setEditAddress(true)
    setEditAddressSelection(false)
  }

  const handleEditBtn = (index: number) => {
    setAddAddress(false)
    setEditAddress(true)
    setEditAddressSelection(false)
    setSelectedAddressIndex(index)
  }

  const handleCarouselSelection = async (index: number) => {
    if (isGuest) {
      setStepState(CheckoutStepState.COMPLETE)
      return
    }
    setIsRefreshing(true)
    setSelectedAddressIndex(index)
    await selectShippingAddress({
      isPostOrder: false,
      shippingNNameId: addressList[index].addressNickname || '',
    })
    setEditAddressSelection(false)
    setAddAddress(false)
    setEditAddress(false)
    setIsRefreshing(false)
    setStepState(CheckoutStepState.COMPLETE)
  }

  const handleAddressSelectionEditBtn = () => {
    setEditAddressSelection(true)
    setStepState(CheckoutStepState.EDIT)
  }

  const handleModalClose = () => {
    setEditAddress(false)
    setAddAddress(false)
    setEditAddressSelection(true)
  }
  const reload = () => {
    setEditAddress(false)
    setAddAddress(false)
    setEditAddressSelection(true)
    setReloadValue(reloadValue + 1)
  }
  return (
    <>
      {stepState === CheckoutStepState.COMPLETE &&
        addressList[selectedAddressIndex] && (
          <>
            <ShippingAddressDetails
              address={addressList[selectedAddressIndex]}
              handleAddressSelectionEditBtn={handleAddressSelectionEditBtn}
            />
          </>
        )}
      {stepState !== CheckoutStepState.COMPLETE &&
        (editAddress || !addressList || addressList.length <= 0) && (
          <AddShippingAddress
            reload={reload}
            add={addAddress}
            edit={editAddress}
            isGuest={isGuest}
            addressToEdit={addAddress ? {} : addressList[selectedAddressIndex]}
            addressList={addressList}
            handleModalClose={handleModalClose}
          />
        )}
      {stepState !== CheckoutStepState.COMPLETE &&
        !editAddress &&
        editAddressSelection &&
        addressList &&
        addressList.length > 0 && (
          <SelectShippingAddressCarousel
            isRefreshing={isRefreshing}
            addressList={addressList}
            handleEditBtn={handleEditBtn}
            handleCarouselSelection={handleCarouselSelection}
            handleAddBtn={handleAddBtn}
          />
        )}
    </>
  )
}
export default CartShippingAddress
