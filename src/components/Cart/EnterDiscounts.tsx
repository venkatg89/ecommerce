import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import _Modal from 'react-native-modal'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'
import { Platform } from 'react-native'

import Button from 'src/controls/Button'
import _TextField from 'src/controls/form/TextField'
import CartAddMembershipCard from './CartAddMembershipCard'
import { ShopCartModel } from 'src/models/ShopModel/CartModel'
import { shopCartSelector } from 'src/redux/selectors/shopSelector'
import { FormErrors } from 'src/models/FormModel'
import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'
import { formErrorsSelector } from 'src/redux/selectors/formSelector'
import { myAtgAccountSelector } from 'src/redux/selectors/userSelector'
import { isEmpty } from 'src/helpers/objectHelpers'
import { DISCOUNTS_FORM } from 'src/constants/formErrors'
import { icons } from 'assets/images'
import {
  addPromoCodeAction,
  removePromoCodeAction,
  addGiftCardAction,
  redeemCardFromAccountAction,
  removeGiftCardAction,
  addBookfairIdAction,
  removeBookfairIdAction,
  TaxExemptAction,
} from 'src/redux/actions/cart/discountsAction'
import SliderMembership from './SliderMembership'
import { checkIsUserLoggedOutToBreakAction } from 'src/redux/actions/modals/guestUser'

const Container = styled.View`
  padding-top: ${({ theme }) => theme.spacing(1)};
  border-top-width: 0.5;
  border-top-color: ${({ theme }) => theme.palette.grey3};
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-right: ${({ theme }) => theme.spacing(2)};
`

const HorizontalLine = styled.View`
  padding-top: ${({ theme }) => theme.spacing(1)};
  border-top-width: 0.5;
  border-top-color: ${({ theme }) => theme.palette.grey3};
  margin-top: ${({ theme }) => theme.spacing(3)};
`

const Modal = styled(_Modal)`
  background-color: white;
  margin-horizontal: 0;
  margin-bottom: 0;
  ${Platform.OS === 'android'
    ? `
      margin-top: 15%
    `
    : 'margin-top: 25%'}

  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  padding-bottom: ${({ theme }) => theme.spacing(4)};
`

const LinkMembershipButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(2)}px;
  text-transform: uppercase;
`

const TextField = styled(_TextField)`
  background-color: white;
  max-height: 62;
`

const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.button.small};
  color: ${({ theme }) => theme.palette.linkGreen};
  text-transform: uppercase;
  font-size: 14;
`

const HeaderContainer = styled.TouchableOpacity`
  padding-top: ${({ theme }) => theme.spacing(2)};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
`

const Spacer = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const FlexRow = styled.View`
  flex-direction: row;
`
const FlexRowGiftCard = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing(3)};
`

const FlexRowTaxExempt = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const TextFieldWrapper = styled.View`
  flex: 1;
`

const TextFieldPin = styled.View`
  margin-left: ${({ theme }) => theme.spacing(1)};
  min-width: 64px;
`

const ButtonWrapper = styled.View``

const ApplyButton = styled(Button)`
  min-width: ${({ theme }) => theme.spacing(12)};
  margin-left: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => `${theme.spacing(1)}px ${theme.spacing(2)}px`};
  height: 56px;
`
const Icon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`
const GiftCardIcon = styled.Image`
  width: ${({ theme }) => theme.spacing(4)};
  height: ${({ theme }) => theme.spacing(3)};
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-right: ${({ theme }) => theme.spacing(1)};
`

const AppliedGiftCardText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1}
  color: ${({ theme }) => theme.palette.grey1};
  text-align: center;
`

const TaxExemptText = styled.Text`
  color: ${({ theme }) => theme.palette.grey1};
  text-align: center;
  ${({ theme }) => theme.typography.body1};
  margin-horizontal: ${({ theme }) => theme.spacing(1)};
`

const AppliedGiftCardAmountText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1}
  color: ${({ theme }) => theme.palette.grey1};
  font-family: Lato-Bold;
  text-align: center;
  margin-left: auto;
`

const AppliedPromoCodeButton = styled.TouchableOpacity`
  padding: ${({ theme }) => theme.spacing(1)}px;
  background-color: ${({ theme }) => theme.palette.tan};
  ${({ theme }) => theme.typography.body1};
  border-radius: ${({ theme }) => theme.spacing(0.5)};
  justify-content: center;
  align-items: center;
  align-self: flex-start;
  flex-direction: row;
`

const AppliedPromoCodeText = styled.Text`
  padding-left: 5px;
  color: ${({ theme }) => theme.palette.grey2};
`

const DeleteIcon = styled.Image`
  height: ${({ theme }) => theme.spacing(3)};
  width: ${({ theme }) => theme.spacing(3)};
  align-items: center;
  align-self: flex-start;
`

const RemainingBalanceContainer = styled.View`
  flex-direction: row;
`

const RemainingBalanceText = styled.Text`
  color: ${({ theme }) => theme.palette.grey2};
  ${({ theme }) => theme.typography.body2}
  margin-left:  ${({ theme }) => theme.spacing(10)};
`
const RemainingBalanceAmount = styled.Text`
  color: ${({ theme }) => theme.palette.grey2};
  ${({ theme }) => theme.typography.body2}
  margin-left: auto;
`

interface OwnProps {
  style?: any
  otherDiscountsVisible: boolean
}

interface StateProps {
  cart: ShopCartModel
  formError: FormErrors
  atgAccount: AtgAccountModel | undefined
}

const selector = createStructuredSelector<any, StateProps>({
  cart: shopCartSelector,
  formError: formErrorsSelector,
  atgAccount: myAtgAccountSelector,
})

interface DispatchProps {
  addPromoCode: (promoCode: string) => void
  removePromoCode: (promoCode: string) => void
  addGiftCard: (giftCard: string, pin: string) => void
  accountRedeemCard: (index: string) => void
  removeGiftCard: (paymentId: string) => void
  addBookfairId: (bookfairId: string) => void
  removeBookfairId: () => void
  addTaxExempt: (taxExempt: boolean) => void
  checkIsUserLoggedOutToBreak: () => boolean
}

const dispatcher = (dispatch) => ({
  addPromoCode: (promoCode) => dispatch(addPromoCodeAction(promoCode)),
  removePromoCode: (promoCode) => dispatch(removePromoCodeAction(promoCode)),
  addGiftCard: (giftCard, pin) => dispatch(addGiftCardAction(giftCard, pin)),
  accountRedeemCard: (index) => dispatch(redeemCardFromAccountAction(index)),
  removeGiftCard: (paymentId) => dispatch(removeGiftCardAction(paymentId)),
  addBookfairId: (bookfairId) => dispatch(addBookfairIdAction(bookfairId)),
  removeBookfairId: () => dispatch(removeBookfairIdAction()),
  addTaxExempt: (taxExempt) => dispatch(TaxExemptAction(taxExempt)),
  checkIsUserLoggedOutToBreak: () =>
    dispatch(checkIsUserLoggedOutToBreakAction()),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(
  selector,
  dispatcher,
)

type Props = StateProps & DispatchProps & OwnProps

const EnterDiscounts = ({
  style,
  otherDiscountsVisible,
  cart,
  addPromoCode,
  formError,
  removePromoCode,
  addGiftCard,
  accountRedeemCard,
  removeGiftCard,
  addBookfairId,
  removeBookfairId,
  addTaxExempt,
  atgAccount,
  checkIsUserLoggedOutToBreak,
}: Props) => {
  const [promoCode, setPromoCode] = useState('')
  const [giftCard, setGiftCard] = useState('')
  const [pin, setPin] = useState('')
  const [bookfairId, setBookfairId] = useState('')
  const [showPromoCode, setShowPromoCode] = useState(false)
  const [showGiftCard, setShowGiftCard] = useState(false)
  const [showOtherDiscounts, setShowOtherDiscounts] = useState(false)
  const [modalIsVisible, setModalIsVisible] = useState(false)
  const [taxExempt, setTaxExempt] = useState(false)
  const [giftCardsAvailable, setGiftCardsAvailable] = useState(
    cart.discounts?.giftCards,
  )
  const [giftCardsAccount, setGiftCardsAccount] = useState(
    atgAccount?.giftCards,
  )

  useEffect(() => {
    setGiftCardsAccount(atgAccount?.giftCards)
    const _promoCode =
      (cart.discounts &&
        cart.discounts.promoCode &&
        cart.discounts.promoCode.code) ||
      ''
    const _bookfairId =
      (cart.discounts && cart.discounts.bookfairId?.code) || ''
    const _taxExempt =
      (cart.discounts && cart.discounts.taxExempt?.value) || false
    if (isEmpty(formError[DISCOUNTS_FORM])) {
      setGiftCard('')
      setPin('')
    }
    setGiftCardsAvailable(cart.discounts?.giftCards)
    setPromoCode(_promoCode)
    setBookfairId(_bookfairId)
    setTaxExempt(_taxExempt)
  }, [
    cart.discounts?.promoCode?.code,
    cart.discounts?.giftCards,
    cart.discounts?.bookfairId,
    cart.discounts?.taxExempt,
    atgAccount?.giftCards,
  ])

  const onGiftCardRemoveHandler = (Id) => {
    removeGiftCard(Id)
    setPin('')
  }

  const onBookfairRemoveHandler = () => {
    removeBookfairId()
    setBookfairId('')
  }

  const onPromoCodeRemoveHandler = () => {
    removePromoCode(promoCode)
  }
  const onGiftCardApplyHandler = () => {
    addGiftCard(giftCard, pin)
  }

  const onGiftCardAccountApplyHandler = (index) => {
    accountRedeemCard(index.toString())
  }

  const modalCloseHandler = () => {
    setModalIsVisible(!modalIsVisible)
  }

  const usingPromoCode = cart.discounts && !!cart.discounts.promoCode?.code
  const usingBookfairId = cart.discounts && !!cart.discounts.bookfairId?.code
  const usingMemberships =
    atgAccount?.membership?.bnMembership?.memberId ||
    atgAccount?.membership?.educator?.memberId ||
    atgAccount?.membership?.employee?.memberId ||
    atgAccount?.membership?.kidsClub?.kidsClubID

  const giftCardLastNumbers = (giftCardNumber) => {
    return giftCardNumber.slice(-4)
  }
  const bookfairIdNumber = cart.discounts && cart.discounts.bookfairId?.code

  const cardsFilter = giftCardsAvailable?.map((card) => card.giftCardNumber)

  const remainingBalance = (cardNumber) => {
    const initialAmount = giftCardsAccount?.find(
      (el) => el.giftCardNumber === cardNumber,
    )
    const orderAmount = giftCardsAvailable?.find(
      (el) => el.giftCardNumber === cardNumber,
    )
    return (
      initialAmount &&
      orderAmount &&
      orderAmount.discountAmount !== 0 &&
      (initialAmount.giftCardBalance - orderAmount.discountAmount).toFixed(2)
    )
  }

  const showRemainingBalance = (cardNumber) => {
    return (
      remainingBalance(cardNumber) !== '0.00' &&
      remainingBalance(cardNumber) !== undefined
    )
  }

  return (
    <>
      <Container style={style}>
        <Modal
          animationType="fade"
          isVisible={modalIsVisible}
          backdropOpacity={0.4}
          useNativeDriver={false}
          swipeDirection={['down']}
          onSwipeComplete={modalCloseHandler}
          onBackdropPress={modalCloseHandler}
        >
          <CartAddMembershipCard modalClose={modalCloseHandler} />
        </Modal>
        <Spacer />
        <HeaderContainer
          onPress={() => {
            setShowGiftCard(!showGiftCard)
          }}
        >
          <HeaderText>{`${showGiftCard ? '-' : '+'} Add gift card`}</HeaderText>
        </HeaderContainer>
        <FlexRow>
          {showGiftCard && (
            <>
              <TextFieldWrapper>
                <TextField
                  onChange={setGiftCard}
                  onSubmitEditing={onGiftCardApplyHandler}
                  label="Gift Card Number"
                  value={giftCard}
                  helperText="PIN is optional for some cards"
                  formId="CartDiscountForm"
                  formFieldId="GiftCardCode"
                />
                <Spacer />
                <Spacer />
              </TextFieldWrapper>
              <TextFieldPin>
                <TextField
                  onChange={setPin}
                  onSubmitEditing={onGiftCardApplyHandler}
                  label="PIN"
                  value={pin}
                  formId="CartDiscountForm"
                  formFieldId="PinCode"
                />
              </TextFieldPin>
              <ButtonWrapper>
                <ApplyButton
                  onPress={onGiftCardApplyHandler}
                  variant={'contained'}
                  disabled={cart.discounts?.giftCards?.length >= 3}
                  textStyle={{ textTransform: 'uppercase' }}
                  center
                >
                  Redeem
                </ApplyButton>
              </ButtonWrapper>
              <Spacer />
            </>
          )}
        </FlexRow>
        {giftCardsAvailable?.map((item, index) => {
          return (
            <>
              <FlexRowGiftCard key={index}>
                <Button
                  icon
                  onPress={() => onGiftCardRemoveHandler(item.paymentId)}
                >
                  <Icon source={icons.checkboxChecked} />
                </Button>
                <GiftCardIcon source={icons.giftCard} />
                <AppliedGiftCardText>
                  BN Gift Card *{giftCardLastNumbers(item.giftCardNumber)}
                </AppliedGiftCardText>
                <AppliedGiftCardAmountText>
                  -${item.discountAmount}
                </AppliedGiftCardAmountText>
              </FlexRowGiftCard>
              {showRemainingBalance(item.giftCardNumber) && (
                <RemainingBalanceContainer>
                  <RemainingBalanceText>
                    Remaining new balance
                  </RemainingBalanceText>
                  <RemainingBalanceAmount>
                    ${remainingBalance(item.giftCardNumber)}
                  </RemainingBalanceAmount>
                </RemainingBalanceContainer>
              )}
            </>
          )
        })}
        {giftCardsAccount
          ?.filter(
            (card) => !cardsFilter.includes(card.giftCardNumber),
          ) /* in case of cards was applied to the order, we want to hide it */
          ?.map((item, index) => {
            return (
              <FlexRowGiftCard key={index}>
                <Button
                  icon
                  onPress={() =>
                    onGiftCardAccountApplyHandler(item.giftCardIndex)
                  }
                >
                  <Icon source={icons.checkboxUnchecked} />
                </Button>
                <GiftCardIcon source={icons.giftCard} />
                <AppliedGiftCardText>
                  BN Gift Card *{giftCardLastNumbers(item.giftCardNumber)}
                </AppliedGiftCardText>
                <AppliedGiftCardAmountText>
                  ${item.giftCardBalance}
                </AppliedGiftCardAmountText>
              </FlexRowGiftCard>
            )
          })}
        <HeaderContainer
          onPress={() => {
            setShowPromoCode(!showPromoCode)
          }}
        >
          <HeaderText>{`${
            showPromoCode ? '-' : '+'
          } Add coupon code`}</HeaderText>
        </HeaderContainer>
        {showPromoCode && (
          <>
            <FlexRow>
              <TextFieldWrapper>
                <TextField
                  onChange={setPromoCode}
                  onSubmitEditing={() => {
                    addPromoCode(promoCode)
                  }}
                  label="Coupon Code"
                  disabled={usingPromoCode}
                  value={usingPromoCode ? '' : promoCode}
                  formId="CartDiscountForm"
                  formFieldId="PromotionCode"
                />
                <Spacer />
                <Spacer />
              </TextFieldWrapper>
              <ButtonWrapper>
                <ApplyButton
                  onPress={() => {
                    addPromoCode(promoCode)
                  }}
                  variant={usingPromoCode ? 'contained' : 'outlined'}
                  disabled={usingPromoCode}
                  textStyle={{ textTransform: 'uppercase' }}
                  linkGreen={!usingPromoCode}
                  center
                >
                  Apply
                </ApplyButton>
              </ButtonWrapper>
              <Spacer />
            </FlexRow>
          </>
        )}
        {usingPromoCode && (
          <>
            <AppliedPromoCodeButton onPress={onPromoCodeRemoveHandler}>
              <AppliedPromoCodeText>{promoCode}</AppliedPromoCodeText>
              <DeleteIcon source={icons.delete} />
            </AppliedPromoCodeButton>
            <Spacer />
            <Spacer />
          </>
        )}

        {otherDiscountsVisible && (
          <>
            <HeaderContainer
              onPress={() => {
                if (!checkIsUserLoggedOutToBreak()) {
                  setShowOtherDiscounts(!showOtherDiscounts)
                }
              }}
            >
              <HeaderText>{`${
                showOtherDiscounts ? '-' : '+'
              } Add other discount`}</HeaderText>
            </HeaderContainer>

            {showOtherDiscounts && (
              <>
                {!taxExempt ? (
                  <FlexRowTaxExempt>
                    <Button
                      icon
                      onPress={() => {
                        addTaxExempt(!taxExempt)
                      }}
                    >
                      <Icon
                        source={
                          taxExempt
                            ? icons.checkboxChecked
                            : icons.checkboxUnchecked
                        }
                      />
                    </Button>
                    <TaxExemptText>Tax exempt</TaxExemptText>
                    <Icon source={icons.actionInfo} />
                  </FlexRowTaxExempt>
                ) : undefined}
                <FlexRow>
                  <TextFieldWrapper>
                    <TextField
                      onChange={setBookfairId}
                      onSubmitEditing={() => {
                        addBookfairId(bookfairId)
                      }}
                      label="Bookfair ID"
                      disabled={usingBookfairId}
                      value={usingBookfairId ? '' : bookfairId}
                      formId="CartDiscountForm"
                      formFieldId="BookfairId"
                    />
                    <Spacer />
                    <Spacer />
                  </TextFieldWrapper>
                  <ButtonWrapper>
                    <ApplyButton
                      onPress={() => {
                        addBookfairId(bookfairId)
                      }}
                      variant={usingBookfairId ? 'contained' : 'outlined'}
                      disabled={usingBookfairId}
                      textStyle={{ textTransform: 'uppercase' }}
                      linkGreen={!usingBookfairId}
                      center
                    >
                      Apply
                    </ApplyButton>
                  </ButtonWrapper>
                </FlexRow>
              </>
            )}
            {taxExempt ? (
              <FlexRowTaxExempt>
                <Button
                  icon
                  onPress={() => {
                    addTaxExempt(!taxExempt)
                  }}
                >
                  <Icon
                    source={
                      taxExempt
                        ? icons.checkboxChecked
                        : icons.checkboxUnchecked
                    }
                  />
                </Button>
                <TaxExemptText>Tax exempt</TaxExemptText>
                <Icon source={icons.actionInfo} />
              </FlexRowTaxExempt>
            ) : undefined}
            {usingBookfairId && (
              <>
                <AppliedPromoCodeButton onPress={onBookfairRemoveHandler}>
                  <AppliedPromoCodeText>
                    Bookfair ID {bookfairIdNumber}
                  </AppliedPromoCodeText>
                  <DeleteIcon source={icons.delete} />
                </AppliedPromoCodeButton>
                <Spacer />
                <Spacer />
              </>
            )}
          </>
        )}
        <HorizontalLine />
        {usingMemberships ? (
          <>
            <HeaderContainer
              onPress={() => {
                setModalIsVisible(!modalIsVisible)
              }}
            >
              <HeaderText>Link New Membership</HeaderText>
            </HeaderContainer>
          </>
        ) : (
          <LinkMembershipButton
            variant="outlined"
            onPress={() => {
              if (!checkIsUserLoggedOutToBreak()) {
                setModalIsVisible(!modalIsVisible)
              }
            }}
            center
            maxWidth
            linkGreen
          >
            + Link Membership
          </LinkMembershipButton>
        )}
        {atgAccount?.membership && <SliderMembership showAll={true} />}
      </Container>
    </>
  )
}

export default connector(EnterDiscounts)
