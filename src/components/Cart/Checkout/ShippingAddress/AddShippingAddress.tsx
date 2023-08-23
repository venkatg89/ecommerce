import React, { useState } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Button from 'src/controls/Button'
import { ShippingAddress } from 'src/models/ShopModel/CartModel'
import VerifyShippingAddress, {
  ADD_ADDRESS,
  VERIFY_ADDRESS,
} from 'src/screens/cart/VerifyShippingAddress'
import styled from 'styled-components/native'
import AddShippingAddressForm from './AddShippingAddressForm'

const Container = styled.View`
  background-color: #ffffff;
`

const ShippingContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing(2.5)};
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-right: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const StoreContainer = styled.View`
  flex: 1;
  margin-horizontal: ${({ theme }) => theme.spacing(1)};
  margin-top: ${({ theme }) => theme.spacing(0.5)};
`

const NameText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(0.5)};
`

const AddShippingAddressButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(2)}px;
  text-transform: uppercase;
  border-color: ${({ theme }) => theme.palette.primaryGreen};
  color: ${({ theme }) => theme.palette.primaryGreen};
  box-shadow: 2px 2px 3px ${({ theme }) => theme.palette.grey4};
`

const ReviewNumberText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey1};
  border-radius: 13;
  height: 26;
  width: 26;
  border: ${({ theme }) => theme.palette.grey1};
  padding-top: ${({ theme }) => theme.spacing(0.3)};
  text-align: center;
`

interface StateProps {}

interface OwnProps {
  add?: boolean
  edit?: boolean
  addressToEdit?: ShippingAddress
  isGuest: boolean
  addressList: ShippingAddress[]
  reload: () => void
  handleModalClose: () => void
}

interface DispatchProps {}

const selector = createStructuredSelector<any, StateProps>({})

type Props = OwnProps & StateProps & DispatchProps

const connector = connect<StateProps, DispatchProps, {}>(selector)
const AddShippingAddress = ({
  add,
  edit,
  addressToEdit,
  isGuest,
  addressList,
  reload,
  handleModalClose,
}: Props) => {
  const [showAddressForm, setShowAddressForm] = useState(add || edit)
  const [addAddress, setAddAddress] = useState(add)
  const [verifyModalOpen, setVerifyModalOpen] = useState(edit && isGuest)

  const handleAddBtn = () => {
    setShowAddressForm(true)
    setVerifyModalOpen(true)
    setAddAddress(true)
  }

  const handleAddAddressContinueBtn = () => {
    setVerifyModalOpen(true)
  }

  const handleVerifyModalClose = (edit1) => {
    setVerifyModalOpen(false)
    setShowAddressForm(false)
    setAddAddress(!edit1)
    if (edit) {
      handleModalClose()
    }
  }

  const handleVerifyDoneBtn = () => {
    setVerifyModalOpen(false)
    setShowAddressForm(false)
    reload()
  }
  return (
    <Container>
      <ShippingContainer>
        <ReviewNumberText>1</ReviewNumberText>
        <StoreContainer>
          <NameText>Shipping Address</NameText>
        </StoreContainer>
      </ShippingContainer>

      {!isGuest &&
        !showAddressForm &&
        (!addressList || addressList.length <= 0) && (
          <AddShippingAddressButton
            variant="outlined"
            center
            style={{ width: '90%' }}
            linkGreen
            onPress={handleAddBtn}
          >
            + add shipping address
          </AddShippingAddressButton>
        )}

      {isGuest && !verifyModalOpen && (
        <AddShippingAddressForm
          reload={reload}
          edit={!addAddress && edit}
          isGuest={isGuest}
          addressToEdit={addAddress ? {} : addressToEdit}
          handleAddAddressContinueBtn={handleAddAddressContinueBtn}
        />
      )}

      {(verifyModalOpen || (!isGuest && edit)) && (
        <VerifyShippingAddress
          add={addAddress}
          edit={edit}
          open={true}
          isGuest={isGuest}
          viewToDisplay={showAddressForm ? ADD_ADDRESS : VERIFY_ADDRESS}
          reload={reload}
          addressToEdit={addressToEdit}
          handleVerifyDoneBtn={handleVerifyDoneBtn}
          handleModalClose={handleVerifyModalClose}
        />
      )}
    </Container>
  )
}

export default connector(AddShippingAddress)
