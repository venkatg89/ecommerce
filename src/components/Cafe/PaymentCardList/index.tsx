import React from 'react'
import { FlatList, StyleProp, ViewStyle } from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import PaymentCardItem from './Item'

import { PaymentCard } from 'src/models/PaymentModel'

import { setPreferedPaymentCardAction, deletePaymentCardsAction } from 'src/redux/actions/cafe/paymentsAction'
import { getSelectedPaymentCardSelector, paymentCardListSelector } from 'src/redux/selectors/cafeSelector'

const Spacing = styled.View`
  width: 100%;
  height: 1;
  margin-vertical: ${({ theme }) => theme.spacing(2)};
  background-color: ${({ theme }) => theme.palette.grey1};
`

const EmptyText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey2};
  margin-top: ${({ theme }) => theme.spacing(8)};
  text-align: center;
`

interface OwnProps {
  contentContainerStyle?: StyleProp<ViewStyle>;
}

interface StateProps {
  selectedPaymentCard?: PaymentCard;
  cards: PaymentCard[];
}

const selector = createStructuredSelector({
  selectedPaymentCard: getSelectedPaymentCardSelector,
  cards: paymentCardListSelector,
})

interface DispatchProps {
  choosePaymentCard: (cardId: string) => void;
  deletePaymentCard: (cardId: string) => void;
}

const dispatcher = dispatch => ({
  choosePaymentCard: cardId => dispatch(setPreferedPaymentCardAction({ cardId })),
  deletePaymentCard: cardId => dispatch(deletePaymentCardsAction({ cardId })),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(selector, dispatcher)

type Props = StateProps & DispatchProps & OwnProps

const PaymentCardList = ({ contentContainerStyle, cards, selectedPaymentCard, choosePaymentCard, deletePaymentCard }: Props) => (
  <FlatList
    contentContainerStyle={ contentContainerStyle }
    data={ cards }
    keyExtractor={ item => item.id }
    renderItem={ ({ item }) => (
      <PaymentCardItem
        card={ item }
        selected={ selectedPaymentCard && (selectedPaymentCard.id === item.id) }
        choosePaymentCard={ choosePaymentCard }
        deletePaymentCard={ deletePaymentCard }
      />
    ) }
    ItemSeparatorComponent={ Spacing }
    ListEmptyComponent={ <EmptyText>No payment methods added.</EmptyText> }
  />
)

export default connector(PaymentCardList)
