import { icons } from 'assets/images'
import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import {
  getCreditCardsAction,
  setCCAsDefaultAction,
  removeCCAction,
} from 'src/redux/actions/shop/creditCardsAction'
import {
  atgUserIdSelector,
  accountEmailSelector,
} from 'src/redux/selectors/userSelector'
import {
  creditCardsSelector,
  shopCartSelector,
} from 'src/redux/selectors/shopSelector'
import { CreditCardModel } from 'src/models/ShopModel/CreditCardModel'
import { paymentCardIconParser, paymentCardType } from 'src/helpers/paymentCard'
// re-enable for guest mode
// import EmailOptIn from 'src/components/Cart/Checkout/EmailOptIn'

import { Scroll } from 'src/components/Cart/Checkout/ShippingAddress/SelectShippingAddressCarousel'
import Button from 'src/controls/Button'

import AddCardModal from 'src/components/Cart/Checkout/AddCardModal'
import EditCardModal from 'src/components/Cart/Checkout/EditCardModal'
import EnterDiscounts from '../EnterDiscounts'
import {
  CreditCardDisplay,
  ShippingAddress,
  ShopCartModel,
} from 'src/models/ShopModel/CartModel'
import { CheckoutStepState } from 'src/screens/cart/Checkout'
import { selectCheckoutPayment } from 'src/endpoints/atgGateway/cart'
import { refreshCartAction } from 'src/redux/actions/shop/cartAction'
import Alert from 'src/controls/Modal/Alert'
import CreditCardBox from 'src/components/Cart/Checkout/CreditCardBox'
import EmailOptIn from './EmailOptIn'
import { guestEmailNeedsUpdatingSelector } from 'src/redux/selectors/guestSelector'

interface StateProps {
  creditCards: CreditCardModel[]
  atgUserId: string
  cart: ShopCartModel
  userEmail: string
  emailNeedsUpdating: boolean
}

interface OwnProps {
  step: number
  shippingAddress?: ShippingAddress
  isOptedIn: boolean
  toggleOptedIn: (isOptedIn: boolean) => void
  stepState: CheckoutStepState
  setStepState: (state: CheckoutStepState) => void
  showDiscounts?: boolean
}

const selector = (state) => ({
  creditCards: creditCardsSelector(state),
  atgUserId: atgUserIdSelector(state),
  cart: shopCartSelector(state),
  userEmail: accountEmailSelector(state),
  emailNeedsUpdating: guestEmailNeedsUpdatingSelector(state),
})

interface DispatchProps {
  getCreditCards: (params: { atgUserId: string }) => void
  setCCAsDefault: (params: {
    atgUserId: string
    creditCardNickName: string
  }) => void
  removeCC: (params: { atgUserId: string; creditCardNickName: string }) => void
  refreshCart: () => void
}

const dispatcher = (dispatch) => ({
  getCreditCards: (params: { atgUserId: string }) =>
    dispatch(getCreditCardsAction(params)),
  setCCAsDefault: (params: { atgUserId: string; creditCardNickName: string }) =>
    dispatch(setCCAsDefaultAction(params)),
  removeCC: (params: { atgUserId: string; creditCardNickName: string }) =>
    dispatch(removeCCAction(params)),
  refreshCart: () => dispatch(refreshCartAction()),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

const PaymentDetails = ({
  creditCards,
  atgUserId,
  getCreditCards,
  setCCAsDefault,
  removeCC,
  shippingAddress,
  isOptedIn,
  toggleOptedIn,
  setStepState,
  stepState,
  cart,
  userEmail,
  refreshCart,
  emailNeedsUpdating,
  step,
  showDiscounts,
}: StateProps & DispatchProps & OwnProps) => {
  const [editMode, setEditMode] = useState<boolean>(
    stepState === CheckoutStepState.EDIT,
  )
  const [addModal, setAddModal] = useState<boolean>(false)
  const [editModal, setEditModal] = useState<boolean>(false)
  const [editCard, setEditCard] = useState<CreditCardModel>()
  const [loadingSelected, setLoadingSelected] = useState<number>(-1)
  const [isSelected, setIsSelected] = useState<number>(-1)
  const [paymentError, setPaymentError] = useState('')
  const [firstPass, setFirstPass] = useState(true)
  const [selectedCard, setSelectedCard] = useState<
    CreditCardDisplay | undefined
  >(undefined)
  useEffect(() => {
    getCreditCards({ atgUserId })
  }, [])

  useEffect(() => {
    const defaultCard = creditCards?.find?.((card) => card.defaultPayment)
    // we're ensuring the section is marked as completed from the start only if we have a default payment set up
    if (defaultCard !== undefined && !firstPass) {
      setStepState(CheckoutStepState.COMPLETE)
    }
    setFirstPass(false)
  }, [creditCards])
  const toggleEdit = () => {
    setStepState(CheckoutStepState.EDIT)
    //if we are entering edit mode, unselect carrousel and make user select card
    if (!editMode) {
      setIsSelected(-1)
    }
    setEditMode(!editMode)
  }

  useEffect(() => {
    setEditMode(stepState === CheckoutStepState.EDIT)
  }, [stepState])

  const getSelectedCard = useCallback(() => {
    if (atgUserId) {
      return cart.selectedCard
    }
    return emailNeedsUpdating ? undefined : cart.selectedCard
  }, [emailNeedsUpdating, cart.selectedCard])

  useEffect(() => {
    setSelectedCard(getSelectedCard())
  }, [emailNeedsUpdating, cart.selectedCard])

  const toggleAddModal = () => {
    setAddModal(!addModal)
  }
  const toggleEditModal = () => {
    setEditModal(!editModal)
  }
  const setDefaultCC = async (creditCardNickName: string, index: number) => {
    setPaymentError('')
    setLoadingSelected(index)
    const defaultPayment = await selectCheckoutPayment({
      cardNickName: creditCardNickName,
      email: userEmail,
      confirmEmail: userEmail,
    })

    setLoadingSelected(-1)
    if (defaultPayment.ok) {
      refreshCart()
      setIsSelected(index)
    } else {
      if (defaultPayment?.data?.formExceptions?.[0]?.localizedMessage) {
        setPaymentError(
          defaultPayment?.data?.formExceptions?.[0]?.localizedMessage,
        )
      } else {
        setPaymentError('Something went wrong, please try again later.')
      }
    }
  }
  const sortedCards = (atgUserId
    ? creditCards
    : selectedCard
    ? [selectedCard]
    : []
  )?.sort((first, second) => {
    if (first.defaultPayment) {
      return -1
    } else {
      return 1
    }
  })

  if (stepState === CheckoutStepState.PENDING) {
    return (
      <ContainerHiddenCarousel>
        <HeaderContainer>
          <StepContainer>
            <StepText>{step}</StepText>
          </StepContainer>
          <TitleText>Payment Details</TitleText>
          <Flex />
        </HeaderContainer>
      </ContainerHiddenCarousel>
    )
  }

  return (
    <Container>
      <PaymentContainer>
        {!editMode && selectedCard && (
          <CheckboxCircleIcon source={icons.checkboxCheckedCircle} />
        )}
        {(editMode || !selectedCard) && (
          <ReviewNumberText>{step}</ReviewNumberText>
        )}
        <TitleContainer>
          <NameText>Payment Details</NameText>
          <Flex />
          {!editMode && <EditButton onPress={toggleEdit}>EDIT</EditButton>}
        </TitleContainer>
      </PaymentContainer>
      {selectedCard && !editMode && (
        <RowContainer>
          <PaymentCardIcon
            source={paymentCardIconParser(selectedCard.creditCardType)}
          />
          <PaymentDetailsDescriptionText>
            {`${paymentCardType(selectedCard.creditCardType)} *${
              selectedCard.creditCardNumber
            }`}
          </PaymentDetailsDescriptionText>
        </RowContainer>
      )}
      <>
        {editMode && (
          <Scroll
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            {(sortedCards as any[])?.map((card, index) => (
              <CreditCardBox
                guestMode={!atgUserId}
                card={card}
                index={index}
                selectedIndex={isSelected}
                loadingIndex={loadingSelected}
                editAction={(card) => {
                  setEditCard(card)
                  toggleEditModal()
                }}
                selectAction={(creditCardNickName, index) =>
                  atgUserId ? setDefaultCC(creditCardNickName, index) : {}
                }
                radioText={
                  isSelected === index || !atgUserId ? 'Selected' : 'Select'
                }
              />
            ))}
          </Scroll>
        )}
      </>
      {editMode && (
        <>
          <BottomContainer>
            {/* TODO Email OptIn is required only for guest mode so commenting here for */}
            {!atgUserId && (
              <EmailOptIn
                isOptedIn={isOptedIn}
                onToggle={() => toggleOptedIn(!isOptedIn)}
              />
            )}
            <AddNewCCButton
              maxWidth
              center
              disabled={userEmail === ''}
              variant="outlined"
              onPress={toggleAddModal}
              linkGreen
            >
              + Add Credit/Debit
            </AddNewCCButton>
          </BottomContainer>
          {showDiscounts && <EnterDiscounts otherDiscountsVisible={true} />}
          <BottomContainer>
            <ContinueButton
              style={{ padding: 14 }}
              onPress={() => {
                toggleEdit()
                setStepState(CheckoutStepState.COMPLETE)
              }}
              variant="contained"
              maxWidth
              center
              disabled={
                !atgUserId ? selectedCard === undefined : isSelected === -1
              }
            >
              Continue
            </ContinueButton>
          </BottomContainer>
        </>
      )}
      <AddCardModal
        addModal={addModal}
        toggleAddModal={toggleAddModal}
        selectedShippingAddress={shippingAddress}
      />
      {editModal && editCard && (
        <EditCardModal
          editModal={editModal}
          editCard={editCard}
          toggleEditModal={toggleEditModal}
          selectedShippingAddress={shippingAddress}
        />
      )}
      <Alert
        isOpen={paymentError.length > 0}
        title="Something went wrong with the order"
        description={paymentError}
        onDismiss={() => {
          setPaymentError('')
        }}
        cancelText="OK"
      />
    </Container>
  )
}

export default connector(PaymentDetails)
const Container = styled.View`
  background-color: #fafafa;
`
const PaymentContainer = styled.View`
  align-items: center;
  flex-direction: row;
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-right: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`
const BottomContainer = styled.View`
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing(2.5)};
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-right: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const CheckboxCircleIcon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`

export const ReviewNumberText = styled.Text`
  color: ${({ theme }) => theme.palette.grey1};
  border-radius: ${({ theme }) => theme.spacing(1.5)};
  height: ${({ theme }) => theme.spacing(3)};
  width: ${({ theme }) => theme.spacing(3)};
  border: 1px solid ${({ theme }) => theme.palette.grey1};
  text-align: center;
  padding-top: ${({ theme }) => theme.spacing(0.3)};
`

const ContainerHiddenCarousel = styled.View`
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-right: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const StepText = styled.Text`
  color: ${({ theme }) => theme.palette.grey1};
  border-radius: ${({ theme }) => theme.spacing(1.5)};
  height: ${({ theme }) => theme.spacing(3)};
  width: ${({ theme }) => theme.spacing(3)};
  border: 1px solid ${({ theme }) => theme.palette.grey1};
  text-align: center;
  padding-top: ${({ theme }) => theme.spacing(0.3)};
`

const Flex = styled.View`
  flex: 1;
`

const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const StepContainer = styled.View`
  width: ${({ theme }) => theme.spacing(4)};
`

const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

const TitleText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
`

const NameText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  line-height: 18;
  letter-spacing: 0.4;
  margin-left: ${({ theme }) => theme.spacing(1)};
`
const EditButton = styled.Text`
  color: ${({ theme }) => theme.palette.linkGreen};
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
  ${({ theme }) => theme.typography.button.small};
  margin-right: ${({ theme }) => theme.spacing(3)};
`

const RowContainer = styled.View`
  align-items: center;
  height: ${({ theme }) => theme.spacing(4)};
  flex-direction: row;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  margin-left: ${({ theme }) => theme.spacing(6)};
`
const PaymentCardIcon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
  align-self: center;
`

const PaymentDetailsDescriptionText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-left: ${({ theme }) => theme.spacing(1)};
  letter-spacing: 0.4;
`
const ContinueButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing(2)}px;
`

const AddNewCCButton = styled(Button)`
  height: 48;
  margin-vertical: ${({ theme }) => theme.spacing(2)};
`
