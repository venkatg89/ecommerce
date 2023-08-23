import React, { useState } from 'react'
import styled from 'styled-components/native'

import _Button from 'src/controls/Button'
import RadioButton from 'src/controls/Button/RadioButton'
import Alert from 'src/controls/Modal/Alert'

import { PaymentCard } from 'src/models/PaymentModel'
import { paymentCardIconParser, paymentCardType } from 'src/helpers/paymentCard'

import { icons } from 'assets/images'


const Container = styled.View`
  flex-direction: row;
  align-items: center;
`

const Button = styled(RadioButton)`
  flex: 1;
`

const Wrapper = styled.View`
  flex-direction: row;
`

const DeleteButton = styled(_Button)`
`

const CardIcon = styled.Image`
  height: ${({ theme }) => theme.spacing(2.4)};
  width: ${({ theme }) => theme.spacing(3.6)};
  margin-right: ${({ theme }) => theme.spacing(1)};
`

const DeleteIcon = styled.Image`
  height: ${({ theme }) => theme.spacing(3)};
  width: ${({ theme }) => theme.spacing(3)};
  tint-color: ${({ theme }) => theme.palette.supportingError};
`

const CardText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1}
  color: ${({ theme }) => theme.palette.grey1};
`

interface Props {
  selected?: boolean;
  card: PaymentCard;
  choosePaymentCard: (cardId: string) => void;
  deletePaymentCard: (cardId: string) => void;
}

const PaymentCardItem = ({ card, choosePaymentCard, deletePaymentCard, selected }: Props) => {
  const [isOpenState, setIsOpenState] = useState<boolean>(false)

  return (
    <Container>
      <Button
        selected={ !!selected }
        onPress={ () => {
          choosePaymentCard(card.id)
        } }
      >
        <Wrapper>
          <CardIcon source={ paymentCardIconParser(card.type) } />
          <CardText>{ paymentCardType(card.type)} *{card.lastFourDigits }</CardText>
        </Wrapper>
      </Button>
      <DeleteButton onPress={ () => { setIsOpenState(true) } }>
        <DeleteIcon source={ icons.delete } />
      </DeleteButton>
      <Alert
        isOpen={ isOpenState }
        title="Delete payment method"
        description="Are you sure you want to delete this payment method?"
        buttons={ [{ title: 'Delete Card', onPress: () => { deletePaymentCard(card.id) }, warning: true }] }
        onDismiss={ () => { setIsOpenState(false) } }
        cancelText="Not now"
      />
    </Container>
  )
}

export default PaymentCardItem
