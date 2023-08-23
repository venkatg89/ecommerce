import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import _Button from 'src/controls/Button'
import _TextField from 'src/controls/form/TextField'
import Container from 'src/controls/layout/ScreenContainer'
import ScrollContainer from 'src/controls/layout/ScrollContainer'

import { RequestStatus } from 'src/models/ApiStatus'
import { paymentCardIconParser } from 'src/helpers/paymentCard'
import { CARD_TYPES_LIST } from 'src/constants/cafe'
import { popN } from 'src/helpers/navigationService'
import RButton from 'src/controls/Button/RadioButton'

import {
  addPaymentCardAction,
  addTempPaymentCardAction,
  AddPaymentCardActionParams,
} from 'src/redux/actions/cafe/paymentsAction'
import { addNewPaymentCardApiRequestStatusSelector } from 'src/redux/selectors/apiStatus/cafe'
import {
  addEventAction,
  LL_CAFE_PAYMENT_ADDED,
} from 'src/redux/actions/localytics'
const CardList = styled.View`
  flex-direction: row;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const CardIcon = styled.Image`
  height: ${({ theme }) => theme.spacing(2.4)};
  width: ${({ theme }) => theme.spacing(3.6)};
  margin-right: ${({ theme }) => theme.spacing(1)};
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

interface State {
  nickname?: string
  name: string
  cardNumber: string
  cardCvc: string
  cardExpiry: string
  saveCard: boolean
}

interface StateProps {
  addCardRequestStatus: Nullable<RequestStatus>
}

const selector = createStructuredSelector({
  addCardRequestStatus: addNewPaymentCardApiRequestStatusSelector,
})

interface DispatchProps {
  addNewPaymentCard: (params: AddPaymentCardActionParams) => boolean
  addTempPaymentCard: (params: AddPaymentCardActionParams) => boolean
  addEvent: (name, attributes) => void
}

const dispatcher = (dispatch) => ({
  addNewPaymentCard: (params) => dispatch(addPaymentCardAction(params)),
  addTempPaymentCard: (params) => dispatch(addTempPaymentCardAction(params)),
  addEvent: (name, attributes) => dispatch(addEventAction(name, attributes)),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps

class AddNewPaymentCardScreen extends React.Component<Props, State> {
  state = {
    nickname: '',
    name: '',
    cardNumber: '',
    cardCvc: '',
    cardExpiry: '',
    saveCard: true,
  }

  onExpiryChange = (value: string) => {
    const cardExpiry = value.replace(/\D/g, '').replace(/\/$/, '') // keep only numbers

    if (cardExpiry.length <= 4) {
      if (cardExpiry.length === 1 && cardExpiry !== '0' && cardExpiry !== '1') {
        this.setState({ cardExpiry: `0${cardExpiry}` })
        return
      }
      if (cardExpiry === this.state.cardExpiry) {
        this.setState({ cardExpiry: cardExpiry.charAt(0) })
        return
      }
      this.setState({ cardExpiry })
    }
  }

  formatExpiryValue = () => {
    const { cardExpiry } = this.state
    if (cardExpiry.length < 2) {
      return cardExpiry
    }
    return `${cardExpiry.substr(0, 2)} / ${cardExpiry.substr(2)}`
  }

  addNewPaymentCard = async () => {
    const {
      nickname,
      name,
      cardNumber,
      cardCvc,
      cardExpiry,
      saveCard,
    } = this.state

    const params = {
      nickname: nickname || name,
      name,
      cardNumber,
      cardCvc,
      month: cardExpiry.substr(0, 2),
      year: `20${cardExpiry.substr(2)}`,
    }
    let addSuccess
    if (saveCard) {
      addSuccess = await this.props.addNewPaymentCard(params)
    } else {
      addSuccess = await this.props.addTempPaymentCard(params)
    }
    if (addSuccess) {
      const { addEvent } = this.props
      const paymentCafe = {
        source: 'Cafe',
      }
      addEvent(LL_CAFE_PAYMENT_ADDED, paymentCafe)
      popN(2)
    }
  }

  render() {
    const { name, cardNumber, cardCvc } = this.state
    const { addCardRequestStatus } = this.props

    const isAmexCard = cardNumber.toString().substring(0, 1) === '3' // amex first digits start with 3

    return (
      <Container>
        <ScrollContainer>
          <CardList>
            {CARD_TYPES_LIST.map((type) => (
              <CardIcon source={paymentCardIconParser(type)} />
            ))}
          </CardList>
          <TextField
            label="Cardholder Name"
            value={name}
            onChange={(value) => this.setState({ name: value })}
            formId="CafeAddPaymentCard"
            formFieldId="last_name"
          />
          <TextField
            label="Card Number"
            value={cardNumber}
            onChange={(value) => this.setState({ cardNumber: value })}
            keyboardType="numeric"
            maxLength={19}
            formId="CafeAddPaymentCard"
            formFieldId="number"
          />
          <FlexRow>
            <FlexTextField
              label="EXP (MM / YY)"
              value={this.formatExpiryValue()}
              onChange={this.onExpiryChange}
              keyboardType="numeric"
              maxLength={7}
              formId="CafeAddPaymentCard"
              formFieldId="month"
            />
            <Spacing />
            <FlexTextField
              label="CVV"
              value={cardCvc}
              onChange={(value) => this.setState({ cardCvc: value })}
              keyboardType="numeric"
              maxLength={isAmexCard ? 4 : 3} // if amex card
              formId="CafeAddPaymentCard"
              formFieldId="verification_value"
            />
          </FlexRow>
          <Spacing />
          <Spacing />

          <RadioButton
            disabled={false}
            selected={this.state.saveCard}
            onPress={(value) =>
              this.setState({ saveCard: !this.state.saveCard })
            }
            text="Ship this item"
            checkboxStyle={true}
          >
            <Text>Save for later</Text>
          </RadioButton>
        </ScrollContainer>
        <Button
          onPress={this.addNewPaymentCard}
          disabled={addCardRequestStatus === RequestStatus.FETCHING}
          variant="contained"
          maxWidth
          center
          isAnchor
          showSpinner={addCardRequestStatus === RequestStatus.FETCHING}
        >
          Apply in checkout
        </Button>
      </Container>
    )
  }
}

export default connector(AddNewPaymentCardScreen)
