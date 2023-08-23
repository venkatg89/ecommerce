import React, { useState } from 'react'
import styled from 'styled-components/native'
import { connect } from 'react-redux'

import ScrollContainer from 'src/controls/layout/ScrollContainer'
import Header from 'src/controls/navigation/Header'
import Button from 'src/controls/Button'
import _TextField from 'src/controls/form/TextField'
import Alert from 'src/controls/Modal/Alert'
import { icons } from 'assets/images'

import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'
import { createStructuredSelector } from 'reselect'
import { myAtgAccountSelector } from 'src/redux/selectors/userSelector'
import { checkGiftCardBalance } from 'src/endpoints/atgGateway/accountDetails'
import {
  addEventAction,
  LL_GIFT_CARD_BALANCE_CHECKED,
} from 'src/redux/actions/localytics'

const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.heading2}
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  margin-top: ${({ theme }) => theme.spacing(2)};
`
const BodyText = styled.Text`
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  ${({ theme }) => theme.typography.body1}
  color: ${({ theme }) => theme.palette.grey1};
  letter-spacing: 0.4;
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
  margin-left: ${({ theme }) => theme.spacing(1)}
  min-width:64px
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
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const FlexRowGiftCard = styled.View`
  flex-direction: row;
  align-items: center
  margin-bottom:${({ theme }) => theme.spacing(3)};
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
  font-family: Lato-Bold;
  text-align: center;
  margin-left: auto;
`

const ErrorMessage = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey2};
  text-align: center;
`

interface StateProps {
  atgAccount?: AtgAccountModel
}

const selector = createStructuredSelector({
  atgAccount: myAtgAccountSelector,
})
interface DispatchProps {
  addEvent: (name) => void
}

const dispatcher = (dispatch) => ({
  addEvent: (name) => dispatch(addEventAction(name)),
})
const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps

const AccountGiftCardsBalance = ({ atgAccount, addEvent }: Props) => {
  const [giftCard, setGiftCard] = useState('')
  const [pin, setPin] = useState('')
  const [giftCardsAvailable, setGiftCardsAvailable] = useState<any[]>([])
  const [fetchingData, setFetchingData] = useState<boolean>(false)
  const [dataError, setDataError] = useState<string>('')
  const [alertModal, setAlertModal] = useState<boolean>(false)

  const onGiftCardApplyHandler = async () => {
    setFetchingData(true)
    const response = await checkGiftCardBalance(
      atgAccount?.atgUserId,
      atgAccount?.mercuryUserId,
      giftCard,
      pin,
    )
    if (response.data.response.success) {
      const giftCardDetails = response.data.response.giftCardInfo
      const updatedCards: string[] | undefined = giftCardsAvailable
      updatedCards.push(giftCardDetails)
      setGiftCardsAvailable(updatedCards)
      setGiftCard('')
      setPin('')
      addEvent(LL_GIFT_CARD_BALANCE_CHECKED)
    } else {
      const error = response.data.response
      setDataError(error.message)
      setAlertModal(true)
    }
    setFetchingData(false)
  }

  const giftCardLastNumbers = (giftCardNumber) => {
    return giftCardNumber.slice(-4)
  }

  const closeModal = () => {
    setDataError('')
    setAlertModal(false)
  }

  return (
    <>
      <ScrollContainer>
        <HeaderText>Check Gift Card Balance</HeaderText>
        <BodyText>
          To check the balance of your gift card, please enter the 15- or
          19-digit number from your gift card and the 4-digit PIN number.
        </BodyText>
        <FlexRow>
          <TextFieldWrapper>
            <TextField
              onChange={setGiftCard}
              onSubmitEditing={onGiftCardApplyHandler}
              label="Gift Card Number"
              value={giftCard}
              helperText="PIN is optional for some cards"
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
              showSpinner={fetchingData}
            >
              Check
            </ApplyButton>
          </ButtonWrapper>
          <Spacer />
        </FlexRow>

        {giftCardsAvailable?.map((item, index) => {
          return (
            <FlexRowGiftCard key={index}>
              <GiftCardIcon source={icons.giftCard} />
              <AppliedGiftCardText>
                BN Gift Card *{giftCardLastNumbers(item.giftCardNumber)}
              </AppliedGiftCardText>
              <AppliedGiftCardAmountText>
                ${item.remainingBalance}
              </AppliedGiftCardAmountText>
            </FlexRowGiftCard>
          )
        })}
      </ScrollContainer>
      <Alert
        isOpen={Boolean(alertModal)}
        onDismiss={closeModal}
        title="Error"
        customBody={<ErrorMessage>{dataError}</ErrorMessage>}
        cancelText="Cancel"
      />
    </>
  )
}

AccountGiftCardsBalance.navigationOptions = ({ navigation }) => ({
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default connector(AccountGiftCardsBalance)
