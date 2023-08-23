import DraggableModal from 'src/controls/Modal/BottomDraggable'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import { Dimensions } from 'react-native'
import _Button from 'src/controls/Button'
import _TextField from 'src/controls/form/TextField'
import RButton from 'src/controls/Button/RadioButton'
import { ShippingAddress } from 'src/models/ShopModel/CartModel'
import {
  addCCAction,
  getCreditCardsAction,
  removeCCAction,
} from 'src/redux/actions/shop/creditCardsAction'
import { refreshCartAction } from 'src/redux/actions/shop/cartAction'

import { ErrorMessage } from 'src/models/FormModel'
import { atgUserIdSelector } from 'src/redux/selectors/userSelector'
import { editCreditCard } from 'src/endpoints/atgGateway/cart'
import { CreditCardModel } from 'src/models/ShopModel/CreditCardModel'

import {
  clearFormFieldErrorMessagesAction,
  setformErrorMessagesAction,
} from 'src/redux/actions/form/errorsAction'
import SelectBillingAddressCarousel from 'src/components/Cart/Checkout/SelectBillingAddressCarousel'
import { addressDetailsSelector } from 'src/redux/selectors/shopSelector'
import { paymentCardIconParser, paymentCardType } from 'src/helpers/paymentCard'
import Alert from 'src/controls/Modal/Alert'

interface OwnProps {
  editModal: boolean
  toggleEditModal: () => void
  selectedShippingAddress?: ShippingAddress
  editCard: CreditCardModel
}

interface DispatchProps {
  addCreditCard: (params) => Promise<APIResponse>
  setError: (error: ErrorMessage) => void
  clearError: (fieldId: string) => void
  getCreditCards: (params: { atgUserId: string }) => void
  removeCC: (params: { atgUserId: string; creditCardNickName: string }) => void
  refreshCart: () => void
}

const FORM_ID = 'ShopEditPaymentCard'
interface StateProps {
  atgUserId: string
  addressList?: ShippingAddress[]
}

const selector = (state) => ({
  atgUserId: atgUserIdSelector(state),
  addressList: addressDetailsSelector(state),
})

const dispatcher = (dispatch) => ({
  addCreditCard: (params) => dispatch(addCCAction(params)),
  getCreditCards: (params: { atgUserId: string }) =>
    dispatch(getCreditCardsAction(params)),
  setError: (error) => dispatch(setformErrorMessagesAction(FORM_ID, [error])),
  clearError: (fieldId) =>
    dispatch(
      clearFormFieldErrorMessagesAction({
        formId: FORM_ID,
        formFieldId: fieldId,
      }),
    ),
  removeCC: (params: { atgUserId: string; creditCardNickName: string }) =>
    dispatch(removeCCAction(params)),
  refreshCart: () => dispatch(refreshCartAction()),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

const AddCardModal = ({
  editModal,
  toggleEditModal,
  selectedShippingAddress,
  addCreditCard,
  setError,
  clearError,
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
  const [defaultAddressMode, setDefaultAddressMode] = useState<boolean>(false)
  const [billingAddress, setBillingAddress] = useState({} as ShippingAddress)
  const [paymentError, setPaymentError] = useState('')
  // used to check is carousel selection is active
  const [selected, setSelected] = useState(false)

  const editPaymentCard = async () => {
    const displayableErrorCodes = ['emptyExpirationMonth', 'shippingError']
    const paymentObject = {
      cardNickName: editCard.creditCardNickName,
      creditCardExpirationMonth: cardExpiryDate.substr(0, 2),
      creditCardExpirationYear: '20' + cardExpiryDate.substr(2, 2),
      ...billingAddress,
    }

    setWorking(true)
    let editResult
    try {
      editResult = await editCreditCard(paymentObject)
    } catch (e) {
      setPaymentError('Please try again later')
    }

    setWorking(false)
    if (editResult.ok) {
      getCreditCards({ atgUserId })
      setCardExpiry('')
      refreshCart()
      toggleEditModal()
    } else if (editResult.data.formError) {
      editResult.data.formExceptions.forEach((exception) => {
        //month and year are handled in the same form field
        if (
          exception.errorCode === 'invalidExpirationYear' ||
          exception.errorCode === 'invalidExpirationMonth'
        ) {
          exception.errorCode = 'emptyExpirationMonth'
        }
        if (displayableErrorCodes.includes(exception.errorCode)) {
          try {
            setError({
              formFieldId: exception.errorCode,
              error: exception.localizedMessage,
            })
          } catch (e) {
            //probably formFieldId not available on the screen
          }
        } else {
          setPaymentError(exception.localizedMessage)
        }
      })
    } else {
      setPaymentError('Please try again later')
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

  const toggleDefaultAddressMode = () => {
    if (!defaultAddressMode && selectedShippingAddress) {
      setBillingAddress(selectedShippingAddress)
    }
    if (defaultAddressMode) {
      setSelected(false)
    }
    setDefaultAddressMode(!defaultAddressMode)
  }

  const handleAddressCarouselSelection = (address) => {
    setSelected(true)
    setBillingAddress(address)
  }
  const handleEditAddressBtn = () => {}

  return (
    <DraggableModal
      isOpen={editModal}
      onDismiss={toggleEditModal}
      fullContent
      header={
        <HeaderHolder>
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

        <RadioButton
          disabled={false}
          selected={defaultAddressMode}
          checkboxStyle={true}
          onPress={toggleDefaultAddressMode}
          formId={FORM_ID}
          formFieldId="shippingError"
        >
          <Text>Use shipping address as billing address</Text>
        </RadioButton>
        {selectedShippingAddress && (
          <ShippingAddressHolder>
            <Text>{`${selectedShippingAddress.firstName} ${selectedShippingAddress.lastName}`}</Text>
            <Text>{selectedShippingAddress.address1}</Text>
            <Text>{`${selectedShippingAddress.city}, ${selectedShippingAddress.state}`}</Text>
            <Text>{selectedShippingAddress.postalCode}</Text>
          </ShippingAddressHolder>
        )}
        {!defaultAddressMode && (
          <SelectBillingAddressCarousel
            handleEditBtn={handleEditAddressBtn}
            handleCarouselSelection={handleAddressCarouselSelection}
            handleAddBtn={() => {}}
          />
        )}
        <Spacing />
        <Spacing />
      </ScrollContainer>
      <Button
        onPress={editPaymentCard}
        disabled={
          working ||
          !billingAddress?.firstName ||
          !(defaultAddressMode || selected)
        }
        variant="contained"
        maxWidth
        center
        // isAnchor
        showSpinner={working}
      >
        Apply in checkout
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
    </DraggableModal>
  )
}

export default connector(AddCardModal)

const windowHeight = Dimensions.get('window').height
const ScrollContainer = styled.View`
  flex: 1;
  height: ${windowHeight - 200};
  padding-top: ${({ theme }) => theme.spacing(5)};
`

const ShippingAddressHolder = styled.View`
  margin-left: ${({ theme }) => theme.spacing(4)};
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

const Text = styled.Text``

const Spacing = styled.View`
  margin-left: ${({ theme }) => theme.spacing(2)};
`
const HeaderHolder = styled.View`
  width: 55%;
  flex-direction: row;
  margin-left: ${({ theme }) => theme.spacing(20)};
`

const RadioButton = styled(RButton)`
  padding-top: ${({ theme }) => theme.spacing(2)};
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
