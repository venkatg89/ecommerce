import { icons } from 'assets/images'
import React from 'react'
import styled from 'styled-components/native'

import { CreditCardModel } from 'src/models/ShopModel/CreditCardModel'
import { paymentCardIconParser, paymentCardType } from 'src/helpers/paymentCard'

import {
  DescriptionText,
  DescriptionContainer,
} from 'src/components/Cart/Checkout/ShippingAddress/SelectShippingAddressCarousel'
import Button from 'src/controls/Button'

interface OwnProps {
  card: CreditCardModel
  index: number
  selectedIndex: number
  loadingIndex: number
  selectAction: (creditCardNickName: string, index: number) => void
  editAction: (card: CreditCardModel) => void
  fullWidth?: boolean
  radioText?: string
  guestMode: boolean
  applyToCheckout?: boolean
}

const CreditCardBox = ({
  card,
  guestMode,
  index,
  selectedIndex,
  loadingIndex,
  selectAction,
  editAction,
  radioText = 'Selected',
  fullWidth = false,
  applyToCheckout,
}: OwnProps) => {
  const selected = selectedIndex === index

  return (
    <BoxContainer
      onPress={() =>
        selected ? {} : selectAction(card.creditCardNickName, index)
      }
      fullWidth={fullWidth}
      index={index}
      applyToCheckout={applyToCheckout}
    >
      <DescriptionContainer>
        <SelectTextContainer>
          <CheckboxCircleIcon
            source={
              selected || guestMode
                ? icons.radioSelected
                : icons.radioDeselected
            }
          />
          <SelectedButton
            size="small"
            onPress={() =>
              selected ? {} : selectAction(card.creditCardNickName, index)
            }
            showSpinner={loadingIndex === index}
            linkGreen={!selected}
          >
            {radioText}
          </SelectedButton>
        </SelectTextContainer>
        <CardTypeContainer>
          <RowContainer>
            <PaymentCardIcon
              source={paymentCardIconParser(card.creditCardType)}
            />
            <PaymentDetailsDescriptionText>
              {`${paymentCardType(card.creditCardType)} *${card.displayNumber}`}
            </PaymentDetailsDescriptionText>
          </RowContainer>
        </CardTypeContainer>
        <DescriptionText>{card.nameOnCard}</DescriptionText>
        <DescriptionText>{card.billingAddress?.address1}</DescriptionText>
        <DescriptionText>
          {`${card.billingAddress?.city}, ${card.billingAddress?.state} ${card.billingAddress?.postalCode}`}
        </DescriptionText>
      </DescriptionContainer>
      {!guestMode && (
        <EditCardButton
          onPress={() => {
            editAction(card)
          }}
        >
          EDIT
        </EditCardButton>
      )}
    </BoxContainer>
  )
}

export default CreditCardBox

const CheckboxCircleIcon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`

const EditCardButton = styled.Text`
  ${({ theme }) => theme.typography.button.small};
  color: ${({ theme }) => theme.palette.linkGreen};
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
  letter-spacing: 1.4;
  align-self: flex-end;
  padding-bottom: ${({ theme }) => theme.spacing(2)};
`

const RowContainer = styled.View`
  height: ${({ theme }) => theme.spacing(4)};
  flex-direction: row;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
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
  margin-top: ${({ theme }) => theme.spacing(1)};
  letter-spacing: 0.4;
`

export const SelectTextContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(2)};
`

const SelectedButton = styled(Button)`
  padding-left: ${({ theme }) => theme.spacing(1)}px;
`
const CardTypeContainer = styled.View`
  margin-left: ${({ theme }) => theme.spacing(2)};
`
export const BoxContainer = styled.TouchableOpacity`
  box-shadow: 2px 2px 3px ${({ theme }) => theme.palette.grey4};
  background-color: white;
  border: 1px solid #c3c3c3;
  width: ${(props) => (props.fullWidth ? '100%' : '330')};
  margin-right: ${({ theme }) => theme.spacing(2)};
  ${({ theme, index, applyToCheckout }) =>
    index === 0 && applyToCheckout && `margin-left: ${theme.spacing(5)}`};
`
