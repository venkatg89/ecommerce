import DraggableModal from 'src/controls/Modal/BottomDraggable'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import { paymentCardIconParser } from 'src/helpers/paymentCard'
import { CARD_TYPES_LIST } from 'src/constants/cafe'
import { Dimensions } from 'react-native'
import _Button from 'src/controls/Button'
import _TextField from 'src/controls/form/TextField'
import RButton from 'src/controls/Button/RadioButton'
import { ShippingAddress } from 'src/models/ShopModel/CartModel'
import { chaseEncryption } from 'src/helpers/cardEncryption'
import {
  addCCAction,
  setCCAsDefaultAction,
} from 'src/redux/actions/shop/creditCardsAction'
import { refreshCartAction } from 'src/redux/actions/shop/cartAction'
import { ErrorMessage } from 'src/models/FormModel'
import { atgUserIdSelector } from 'src/redux/selectors/userSelector'

import {
  clearFormFieldErrorMessagesAction,
  setformErrorMessagesAction,
} from 'src/redux/actions/form/errorsAction'
import SelectBillingAddressCarousel from 'src/components/Cart/Checkout/SelectBillingAddressCarousel'
import { addressDetailsSelector } from 'src/redux/selectors/shopSelector'
import Alert from 'src/controls/Modal/Alert'
import { setGuestEmailNeedsUpdate } from 'src/redux/actions/guestInfo/guestInfoAction'
import { addEventAction, LL_PAYMENT_ADDED } from 'src/redux/actions/localytics'

interface OwnProps {
  addModal: boolean
  toggleAddModal: () => void
  selectedShippingAddress?: ShippingAddress
}

interface DispatchProps {
  setCCAsDefault: (params: {
    atgUserId: string
    creditCardNickName: string
  }) => void
  addCreditCard: (params) => Promise<APIResponse>
  setError: (error: ErrorMessage) => void
  clearError: (fieldId: string) => void
  refreshCart: () => void
  setEmailNeedsUpdating: (boolean) => void
  addEvent: (name) => void
}

const FORM_ID = 'ShopAddPaymentCard'
interface StateProps {
  atgUserId: string
  addressList?: ShippingAddress[]
}

const selector = (state) => ({
  atgUserId: atgUserIdSelector(state),
  addressList: addressDetailsSelector(state),
})

const dispatcher = (dispatch) => ({
  setCCAsDefault: (params: { atgUserId: string; creditCardNickName: string }) =>
    dispatch(setCCAsDefaultAction(params)),
  addCreditCard: (params) => dispatch(addCCAction(params)),
  refreshCart: () => dispatch(refreshCartAction()),
  setError: (error) => dispatch(setformErrorMessagesAction(FORM_ID, [error])),
  clearError: (fieldId) =>
    dispatch(
      clearFormFieldErrorMessagesAction({
        formId: FORM_ID,
        formFieldId: fieldId,
      }),
    ),
  setEmailNeedsUpdating: (update) => dispatch(setGuestEmailNeedsUpdate(update)),
  addEvent: (name) => dispatch(addEventAction(name)),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

const AddCardModal = ({
  addModal,
  toggleAddModal,
  selectedShippingAddress,
  addCreditCard,
  setError,
  clearError,
  atgUserId,
  setCCAsDefault,
  addressList,
  refreshCart,
  setEmailNeedsUpdating,
  addEvent,
}: StateProps & DispatchProps & OwnProps) => {
  const [name, setName] = useState<string>('')
  const [cardNumber, setCardNumber] = useState<string>('')
  const [cardCvc, setCardCvc] = useState<string>('')
  const [cardExpiryDate, setCardExpiry] = useState<string>('')
  const [working, setWorking] = useState<boolean>(false)
  const [defaultAddressMode, setDefaultAddressMode] = useState<boolean>(false)
  const [selectedAddress, setSelectedAddress] = useState<boolean>(false)
  const [billingAddress, setBillingAddress] = useState(selectedShippingAddress)
  const [paymentError, setPaymentError] = useState('')

  if (!billingAddress && addressList?.length) {
    setBillingAddress(addressList[0])
  }

  const addNewPaymentCard = async () => {
    setPaymentError('')
    const chase = await chaseEncryption()
    const protectCC = chase.ProtectPANandCVV
    let protectedCC = {}
    const encCC = protectCC(cardNumber, cardCvc, false)

    if (encCC) {
      clearError('emptyCreditCardNumber')
      clearError('cvvMissing')
      protectedCC = {
        creditCardNumber: encCC[0],
        cryptCvv: encCC[1],
        integrityCheckVal: encCC[2],
        nameOnCard: name,
        creditCardExpirationMonth: cardExpiryDate?.substr(0, 2),
        creditCardExpirationYear: '20' + cardExpiryDate?.substr(2, 2),
        cvv: cardCvc,
      }
    } else {
      //chase encryption can fail because of bad cc or cvc number but it does not tell which one
      setError({
        formFieldId: 'emptyCreditCardNumber',
        error: 'Please provide a valid credit card number',
      })
      setError({
        formFieldId: 'cvvMissing',
        error: 'Please provide a valid CVC number',
      })
      return
    }
    const paymentObject = { ...protectedCC, ...billingAddress }

    setWorking(true)
    const addResult = await addCreditCard(paymentObject)

    const displayableErrorCodes = [
      'nameOnCardMissing',
      'emptyCreditCardNumber',
      'emptyExpirationMonth',
      'cvvMissing',
      'shippingError',
    ]

    setWorking(false)
    if (addResult.ok) {
      refreshCart()
      setCardNumber('')
      setCardCvc('')
      setCardExpiry('')
      setName('')
      toggleAddModal()
      setEmailNeedsUpdating(false)
      addEvent(LL_PAYMENT_ADDED)
    } else if (addResult.data.formError) {
      addResult.data.formExceptions.forEach((exception) => {
        //month and year are handled in the same form field
        if (
          exception.errorCode === 'invalidExpirationYear' ||
          exception.errorCode === 'invalidExpirationMonth' ||
          exception.errorCode === 'creditcardnotValidOrExpired'
        ) {
          exception.errorCode = 'emptyExpirationMonth'
        }

        if (exception.errorCode === 'creditcardnotValid') {
          exception.errorCode = 'emptyCreditCardNumber'
        }

        if (exception.errorCode === 'duplicateCreditcard') {
          exception.errorCode = 'emptyCreditCardNumber'
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

  const isAmexCard = cardNumber.toString()?.substring(0, 1) === '3' // amex first digits start with 3

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
    return `${cardExpiry?.substr(0, 2)} / ${cardExpiry?.substr(2)}`
  }

  const toggleDefaultAddressMode = () => {
    if (!defaultAddressMode) {
      setBillingAddress(selectedShippingAddress)
    } else {
      setSelectedAddress(false)
    }
    setDefaultAddressMode(!defaultAddressMode)
  }

  const handleAddressCarouselSelection = (address) => {
    setBillingAddress(address)
    setSelectedAddress(true)
  }
  const handleEditAddressBtn = () => {}

  return (
    <DraggableModal
      isOpen={addModal}
      onDismiss={toggleAddModal}
      fullContent
      header={<HeaderText>Add Payment</HeaderText>}
    >
      <ScrollContainer>
        <CardList>
          {CARD_TYPES_LIST.map((type) => (
            <CardIcon source={paymentCardIconParser(type)} />
          ))}
        </CardList>
        <TextField
          label="Cardholder Name"
          value={name}
          onChange={setName}
          formId={FORM_ID}
          formFieldId="nameOnCardMissing"
        />
        <TextField
          label="Card Number"
          value={cardNumber}
          onChange={setCardNumber}
          keyboardType="numeric"
          maxLength={19}
          formId={FORM_ID}
          formFieldId="emptyCreditCardNumber"
        />
        <FlexRow>
          <FlexTextField
            label="EXP (MM / YY)"
            value={formatExpiryValue()}
            onChange={onExpiryChange}
            keyboardType="numeric"
            maxLength={7}
            formId={FORM_ID}
            formFieldId="emptyExpirationMonth"
          />
          <Spacing />
          <FlexTextField
            label="Card CVV"
            value={cardCvc}
            onChange={setCardCvc}
            keyboardType="numeric"
            maxLength={isAmexCard ? 4 : 3} // if amex card
            formId={FORM_ID}
            formFieldId="cvvMissing"
          />
        </FlexRow>
        <Spacing />
        <Spacing />
        {billingAddress && (
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
        )}
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
        onPress={addNewPaymentCard}
        disabled={working || !(defaultAddressMode || selectedAddress)}
        variant="contained"
        maxWidth
        center
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
const ScrollContainer = styled.ScrollView`
  flex: 1;
  height: ${windowHeight - 200};
`

const CardList = styled.View`
  flex-direction: row;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const ShippingAddressHolder = styled.View`
  margin-left: ${({ theme }) => theme.spacing(4)};
`

const CardIcon = styled.Image`
  height: ${({ theme }) => theme.spacing(2.4)};
  width: ${({ theme }) => theme.spacing(3.6)};
  margin-right: ${({ theme }) => theme.spacing(1)};
  margin-top: ${({ theme }) => theme.spacing(4)};
`

const TextField = styled(_TextField)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
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

const RadioButton = styled(RButton)`
  padding-top: ${({ theme }) => theme.spacing(2)};
`
const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  align-self: center;
`
