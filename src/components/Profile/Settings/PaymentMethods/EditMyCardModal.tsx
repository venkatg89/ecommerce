import DraggableModal from 'src/controls/Modal/BottomDraggable'
import React, { useState, useContext } from 'react'
import { connect } from 'react-redux'
import styled, { ThemeContext } from 'styled-components/native'
import { Dimensions } from 'react-native'
import _Button from 'src/controls/Button'
import _TextField from 'src/controls/form/TextField'
import { ShippingAddress } from 'src/models/ShopModel/CartModel'
import {
  getCreditCardsAction,
  removeCCAction,
} from 'src/redux/actions/shop/creditCardsAction'
import { refreshCartAction } from 'src/redux/actions/shop/cartAction'

import { atgUserIdSelector } from 'src/redux/selectors/userSelector'
import { updatePaymentFromProfile } from 'src/endpoints/atgGateway/cart'
import { CreditCardModel } from 'src/models/ShopModel/CreditCardModel'

import SelectBillingAddressCarousel from 'src/components/Cart/Checkout/SelectBillingAddressCarousel'
import { addressDetailsSelector } from 'src/redux/selectors/shopSelector'
import { paymentCardIconParser, paymentCardType } from 'src/helpers/paymentCard'
import Alert from 'src/controls/Modal/Alert'

interface OwnProps {
  editModal: boolean
  toggleEditModal: () => void
  editCard: CreditCardModel
}

interface DispatchProps {
  getCreditCards: (params: { atgUserId: string }) => void
  removeCC: (params: { atgUserId: string; creditCardNickName: string }) => void
  refreshCart: () => void
}

const FORM_ID = 'ShopEditPaymentCard'
interface StateProps {
  atgUserId: string
  addressList: ShippingAddress[]
}

const selector = (state) => ({
  atgUserId: atgUserIdSelector(state),
  addressList: addressDetailsSelector(state),
})

const dispatcher = (dispatch) => ({
  getCreditCards: (params: { atgUserId: string }) =>
    dispatch(getCreditCardsAction(params)),
  removeCC: (params: { atgUserId: string; creditCardNickName: string }) =>
    dispatch(removeCCAction(params)),
  refreshCart: () => dispatch(refreshCartAction()),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

const EditMyCardModal = ({
  editModal,
  toggleEditModal,
  addressList,
  editCard,
  getCreditCards,
  atgUserId,
  removeCC,
  refreshCart,
}: StateProps & DispatchProps & OwnProps) => {
  const [cardExpiryDate, setCardExpiry] = useState<string>(
    `${editCard.creditCardExpMo}${editCard.creditCardExpYr.substr(2)}`,
  )
  const [working, setWorking] = useState<boolean>(false)
  const [deleting, setDeleting] = useState<boolean>(false)
  const [billingAddress, setBillingAddress] = useState({} as ShippingAddress)
  const [paymentError, setPaymentError] = useState('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const removeCreditCard = async (creditCardNickName: string) => {
    setDeleting(true)
    await removeCC({ atgUserId, creditCardNickName })
    setDeleting(false)
    refreshCart()
    toggleEditModal()
  }

  const editPaymentCard = async () => {
    const paymentObject = {
      creditCardID: editCard.creditCardId,
      expirationMonth: cardExpiryDate.substr(0, 2),
      expirationYear: '20' + cardExpiryDate.substr(2, 2),
      ...billingAddress,
    }

    setWorking(true)
    let editResult
    try {
      editResult = await updatePaymentFromProfile(paymentObject)
    } catch (e) {
      setPaymentError('Please try again later')
    }

    setWorking(false)
    if (editResult.ok) {
      getCreditCards({ atgUserId })
      setCardExpiry('')
      toggleEditModal()
    } else if (editResult?.data?.response?.message) {
      setPaymentError(editResult?.data?.response?.message)
    }
  }

  const onExpiryChange = (value: string) => {
    const cardExpiry = value.replace(/\D/g, '').replace(/\/$/, '') // keep only numbers

    if (cardExpiry.length <= 4) {
      if (cardExpiry.length === 1 && cardExpiry !== '0' && cardExpiry !== '1') {
        setCardExpiry(`0${cardExpiry}`)
        return
      }
      if (cardExpiry === cardExpiryDate) {
        setCardExpiry(cardExpiry.charAt(0))
        return
      }
      setCardExpiry(cardExpiry)
    }
  }

  const formatExpiryValue = () => {
    const cardExpiry = cardExpiryDate
    if (cardExpiry.length < 2) {
      return cardExpiry
    }
    return `${cardExpiry.substr(0, 2)} / ${cardExpiry.substr(2)}`
  }

  const handleAddressCarouselSelection = (address) => {
    address.addressNickName = address?.addressNickname
    setBillingAddress(address)
  }
  const handleEditAddressBtn = () => {}
  const { palette } = useContext(ThemeContext)

  return (
    <DraggableModal
      isOpen={editModal}
      onDismiss={toggleEditModal}
      fullContent
      header={
        <HeaderHolder>
          <DeleteText
            onPress={() => setDeleteModalOpen(true)}
            textStyle={{ color: palette.supportingError }}
            size="small"
            showSpinner={deleting}
          >
            DELETE
          </DeleteText>
          <HeaderText>Edit Payment</HeaderText>
        </HeaderHolder>
      }
    >
      <ScrollContainer>
        <NameOnCard>{editCard.nameOnCard}</NameOnCard>
        <RowContainer>
          <PaymentCardIcon
            source={paymentCardIconParser(editCard.creditCardType)}
          />
          <PaymentDetailsDescriptionText>
            {`${paymentCardType(editCard.creditCardType)} *${
              editCard.displayNumber
            }`}
          </PaymentDetailsDescriptionText>
        </RowContainer>
        <FlexRow>
          <FlexTextField
            label="EXP (MM / YY)"
            value={
              formatExpiryValue() ||
              `${editCard.creditCardExpMo}/${editCard.creditCardExpYr.substr(
                2,
              )}`
            }
            onChange={onExpiryChange}
            keyboardType="numeric"
            maxLength={7}
            formId={FORM_ID}
            formFieldId="emptyExpirationMonth"
          />
          <Spacing />
        </FlexRow>
        <Spacing />
        <Spacing />
        <SelectBillingAddressCarousel
          handleEditBtn={handleEditAddressBtn}
          handleCarouselSelection={handleAddressCarouselSelection}
          handleAddBtn={() => {}}
        />
        <Spacing />
        <Spacing />
      </ScrollContainer>
      <Button
        onPress={editPaymentCard}
        disabled={working || !billingAddress?.firstName}
        variant="contained"
        maxWidth
        center
        // isAnchor
        showSpinner={working}
      >
        SAVE CARD
      </Button>
      <Alert
        isOpen={paymentError.length > 0}
        title="Something went wrong"
        description={paymentError}
        onDismiss={() => {
          setPaymentError('')
        }}
        cancelText="OK"
      />
      <Alert
        isOpen={deleteModalOpen}
        onDismiss={() => {
          setDeleteModalOpen(false)
        }}
        title="Delete payment method"
        description="Are you sure you want to delete this payment method?"
        buttons={[
          {
            title: 'DELETE CARD',
            onPress: () => {
              removeCreditCard(editCard.creditCardNickName)
            },
            showSpinner: deleting,
            warning: true,
          },
        ]}
        cancelText="Not now"
      />
    </DraggableModal>
  )
}

export default connector(EditMyCardModal)

const windowHeight = Dimensions.get('window').height
const ScrollContainer = styled.View`
  flex: 1;
  height: ${windowHeight - 200};
  padding-top: ${({ theme }) => theme.spacing(5)};
`
const FlexRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`

const FlexTextField = styled(_TextField)`
  flex: 1;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const Button = styled(_Button)`
  padding: ${({ theme }) => theme.spacing(2)}px;
`
const Spacing = styled.View`
  margin-left: ${({ theme }) => theme.spacing(2)};
`
const HeaderHolder = styled.View`
  width: 55%;
  flex-direction: row;
  justify-content: space-between;
  margin-left: ${({ theme }) => theme.spacing(3)};
`
const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  align-self: flex-end;
`
const NameOnCard = styled.Text`
  ${({ theme }) => theme.typography.subTitle2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`
const DeleteText = styled(_Button)`
  ${({ theme }) => theme.typography.button.small};
  color: ${({ theme }) => theme.palette.moderateRed};
  align-self: flex-end;
`
const PaymentCardIcon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`
const RowContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`
const PaymentDetailsDescriptionText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-left: ${({ theme }) => theme.spacing(1)};
  margin-top: ${({ theme }) => theme.spacing(0.5)};
  line-height: 16;
  letter-spacing: 0.4;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`
