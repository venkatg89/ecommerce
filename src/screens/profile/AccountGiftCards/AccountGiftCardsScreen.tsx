import React, { useState, useEffect } from 'react'
import styled from 'styled-components/native'

import ScrollContainer from 'src/controls/layout/ScrollContainer'
import Header from 'src/controls/navigation/Header'
import Button from 'src/controls/Button'
import _TextField from 'src/controls/form/TextField'
import Alert from 'src/controls/Modal/Alert'

import { icons } from 'assets/images'
import { Routes, Params, WebRoutes, push } from 'src/helpers/navigationService'

import {
  AtgAccountModel,
  GiftCardModel,
} from 'src/models/UserModel/AtgAccountModel'
import { FormErrors } from 'src/models/FormModel'
import { formErrorsSelector } from 'src/redux/selectors/formSelector'
import { createStructuredSelector } from 'reselect'
import {
  myAtgAccountSelector,
  myAtgApiStatusSelector,
} from 'src/redux/selectors/userSelector'
import { connect } from 'react-redux'
import {
  removeGiftCardFromAccountAction,
  addGiftCardToAccountAction,
} from 'src/redux/actions/user/atgAccountAction'
import { RequestStatus } from 'src/models/ApiStatus'
import { isEmpty } from 'src/helpers/objectHelpers'
import { DISCOUNTS_FORM } from 'src/constants/formErrors'
import Images from 'assets/images'

const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.heading2}
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  margin-top: ${({ theme }) => theme.spacing(2)};
`
const SubtitleText = styled.Text`
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  color: ${({ theme }) => theme.palette.grey1};
  ${({ theme }) => theme.typography.subTitle1}
`

const TitleText = styled.Text`
  ${({ theme }) => theme.typography.title}
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`

const GiftCardBalanceButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing(2)}px;
  text-transform: uppercase;
`

const ShopButton = styled.Text`
  color: ${({ theme }) => theme.palette.linkGreen};
  ${({ theme }) => theme.typography.button.small};
  margin-top: ${({ theme }) => theme.spacing(5)};
  text-transform: uppercase;
`

const TextFieldWrapper = styled.View`
  flex: 1;
  padding-top: 0;
`

const TextField = styled(_TextField)`
  max-height: 56;
`

const Spacer = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
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

const FlexRow = styled.View`
  flex-direction: row;
  margin-top: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const FlexRowGiftCard = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const DeleteIcon = styled.Image`
  height: ${({ theme }) => theme.spacing(3)};
  width: ${({ theme }) => theme.spacing(3)};
  tint-color: ${({ theme }) => theme.palette.supportingError};
`

const GiftCardIcon = styled.Image`
  width: ${({ theme }) => theme.spacing(4)};
  height: ${({ theme }) => theme.spacing(3)};
  margin-right: ${({ theme }) => theme.spacing(1)};
`

const AppliedGiftCardText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1}
  color: ${({ theme }) => theme.palette.grey1};
  text-align: center;
`

const AppliedGiftCardAmountText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1}
  color: ${({ theme }) => theme.palette.grey1};
  margin-right: ${({ theme }) => theme.spacing(2)};
  text-align: center;
  margin-left: auto;
`

const ErrorMessage = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey2};
  text-align: center;
`

const Content = styled.View`
  flex: 1;
  align-items: center;
`

const DescriptionText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  padding-top: ${({ theme }) => theme.spacing(2)};
  padding-bottom: ${({ theme }) => theme.spacing(1)};
`

const DetailsText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  margin-left: ${({ theme }) => theme.spacing(4)};
  margin-right: ${({ theme }) => theme.spacing(4)};
  text-align: center;
`

const EmptyImage = styled.Image`
  width: 200;
  height: 200;
`

interface StateProps {
  atgAccount?: AtgAccountModel
  atgApiStatus: Nullable<RequestStatus>
  formError: FormErrors
}

const selector = createStructuredSelector({
  atgAccount: myAtgAccountSelector,
  atgApiStatus: myAtgApiStatusSelector,
  formError: formErrorsSelector,
})

interface DispatchProps {
  removeGiftCard: (accountId: string, cardId: string) => void
  addGiftCard: (
    accountId: string | undefined,
    mercuryId: string | undefined,
    number: string,
    pin: string,
  ) => void
}

const dispatcher = (dispatch) => ({
  removeGiftCard: (accountId, cardId) => {
    dispatch(removeGiftCardFromAccountAction(accountId, cardId))
  },
  addGiftCard: (accountId, mercuryId, number, pin) => {
    dispatch(addGiftCardToAccountAction(accountId, mercuryId, number, pin))
  },
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps

const AccountGiftCardsScreen = ({
  atgAccount,
  removeGiftCard,
  addGiftCard,
  atgApiStatus,
  formError,
}: Props) => {
  const [giftCard, setGiftCard] = useState('')
  const [pin, setPin] = useState('')
  const [giftCardsAvailable, setGiftCardsAvailable] = useState<
    GiftCardModel[] | undefined
  >([])
  const [alertModal, setAlertModal] = useState<boolean>(false)
  const [giftCardCredentials, setGiftCardCredentials] = useState<any>({})

  useEffect(() => {
    setGiftCardsAvailable(atgAccount?.giftCards)
    if (isEmpty(formError[DISCOUNTS_FORM])) {
      setGiftCard('')
      setPin('')
    }
  }, [atgAccount?.giftCards])

  const onGiftCardApplyHandler = () => {
    addGiftCard(atgAccount?.atgUserId, atgAccount?.mercuryUserId, giftCard, pin)
  }

  const onGiftCardRemoveHandler = (accountId, cardId) => {
    removeGiftCard(accountId, cardId)
  }

  const giftCardLastNumbers = (giftCardNumber) => {
    return giftCardNumber.slice(-4)
  }

  const totalCreditAmount = giftCardsAvailable
    ?.map((cartItem) => cartItem.giftCardBalance)
    .reduce((a, b) => a + b, 0)

  const closeModal = () => {
    setAlertModal(false)
  }

  const removeGiftCardHandler = async () => {
    await onGiftCardRemoveHandler(
      giftCardCredentials.atgId,
      giftCardCredentials.cardId,
    )
    setAlertModal(false)
  }

  const openAlert = (atgId, cardId) => {
    setAlertModal(true)
    setGiftCardCredentials({ atgId: atgId, cardId: cardId })
  }

  return (
    <>
      <ScrollContainer withAnchor>
        <HeaderText>Gift Cards</HeaderText>
        <SubtitleText>Total Credit</SubtitleText>
        <TitleText>${totalCreditAmount}</TitleText>
        <SubtitleText>Manage Gift Cards</SubtitleText>
        <FlexRow>
          <TextFieldWrapper>
            <TextField
              onChange={setGiftCard}
              onSubmitEditing={onGiftCardApplyHandler}
              label="Gift Card Number"
              value={giftCard}
              helperText="PIN is optional for some cards"
              formId="GiftCartForm"
              formFieldId="GiftCardActionAccount"
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
            />
          </TextFieldPin>
          <ButtonWrapper>
            <ApplyButton
              onPress={onGiftCardApplyHandler}
              variant={'contained'}
              disabled={giftCard.length < 15}
              textStyle={{ textTransform: 'uppercase' }}
              center
              showSpinner={atgApiStatus === RequestStatus.FETCHING}
            >
              Redeem
            </ApplyButton>
          </ButtonWrapper>
          <Spacer />
        </FlexRow>
        {giftCardsAvailable?.map((card, index) => {
          return (
            <FlexRowGiftCard key={index}>
              <GiftCardIcon source={icons.giftCard} />
              <AppliedGiftCardText>
                BN Gift Card *{giftCardLastNumbers(card.giftCardNumber)}
              </AppliedGiftCardText>
              <AppliedGiftCardAmountText>
                ${card.giftCardBalance}
              </AppliedGiftCardAmountText>
              <Button
                icon
                onPress={() => openAlert(card.atgGiftCardId, card.giftCardId)}
              >
                <DeleteIcon source={icons.delete} />
              </Button>
            </FlexRowGiftCard>
          )
        })}
        {!giftCardsAvailable ||
          (giftCardsAvailable?.length === 0 && (
            <Content>
              <EmptyImage source={Images.emptyInfo} />
              <DescriptionText>No Saved Gift Cards</DescriptionText>
              <DetailsText>
                Add your gift cards here for easy access in checkout.
              </DetailsText>
              <ShopButton
                onPress={() => {
                  push(Routes.WEBVIEW__WITH_SESSION, {
                    [Params.WEB_ROUTE]: WebRoutes.SHOP_GIFT_CARDS,
                  })
                }}
              >
                Shop gift cards
              </ShopButton>
            </Content>
          ))}
      </ScrollContainer>
      <GiftCardBalanceButton
        variant="outlined"
        onPress={() => {
          push(Routes.ACCOUNT__GIFT_CARDS_BALANCE)
        }}
        center
        maxWidth
        linkGreen
        isAnchor
      >
        Check gift card balance
      </GiftCardBalanceButton>
      <Alert
        isOpen={Boolean(alertModal)}
        title="Remove Card from Account"
        onDismiss={closeModal}
        customBody={
          <ErrorMessage>
            Are you sure you want to remove this gift card from your account?
            The value will not be affected.
          </ErrorMessage>
        }
        buttons={[
          {
            title: 'REMOVE GIFT CARD',
            onPress: () => {
              removeGiftCardHandler()
            },
            warning: true,
          },
        ]}
        cancelText="Not now"
      />
    </>
  )
}

AccountGiftCardsScreen.navigationOptions = ({ navigation }) => ({
  title: 'Gift Cards',
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default connector(AccountGiftCardsScreen)
