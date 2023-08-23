import React, { useState, useEffect } from 'react'
import { Keyboard } from 'react-native'
import { ShopCartItemModel } from 'src/models/ShopModel/CartModel'
import styled from 'styled-components/native'
import BookImage from '../BookImage'
import RadioButton from 'src/controls/Button/RadioButton'
import TextField from 'src/controls/form/TextField'

interface DisabledProps {
  disabled?: boolean
}

const Container = styled.View`
  margin-vertical: ${({ theme }) => theme.spacing(3)};
  margin-horizontal: ${({ theme }) => theme.spacing(2)};
`

const BookContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const TextsContainer = styled.View`
  padding-left: ${({ theme }) => theme.spacing(1)};
  padding-right: ${({ theme }) => theme.spacing(2)};
  flex: 1;
`

const Title = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  font-weight: bold;
  text-align: left;
  padding-left: ${({ theme }) => theme.spacing(1)};
`

const Subtitle = styled.Text<DisabledProps>`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme, disabled }) =>
    disabled ? theme.palette.grey2 : theme.palette.grey1};
  padding-left: ${({ theme }) => theme.spacing(1)};
  padding-bottom: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  text-align: left;
`

const Checkbox = styled(RadioButton)``

const Options = styled.Text<DisabledProps>`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme, disabled }) =>
    disabled ? theme.palette.grey2 : theme.palette.grey1};
  padding-left: ${({ theme }) => theme.spacing(1)};
`
const OptionsWithInfo = styled.Text<DisabledProps>`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme, disabled }) =>
    disabled ? theme.palette.grey2 : theme.palette.grey1};
  padding-left: ${({ theme }) => theme.spacing(1)};
  padding-top: ${({ theme }) => theme.spacing(1)};
`

const FreeText = styled.Text<DisabledProps>`
  ${({ theme }) => theme.typography.subTitle2};
  color: ${({ theme, disabled }) =>
    disabled ? theme.palette.grey2 : theme.palette.grey1};
  text-transform: uppercase;
`

const PickUpText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey2};
  padding-left: ${({ theme }) => theme.spacing(1)};
  padding-top: ${({ theme }) => theme.spacing(1)};
`

const CharLength = styled.Text`
  ${({ theme }) => theme.typography.caption};
  color: ${({ theme }) => theme.palette.grey2};
  padding-right: ${({ theme }) => theme.spacing(2)};
  padding-top: ${({ theme }) => theme.spacing(1) / 2};
  align-self: flex-end;
`
interface Props {
  item: ShopCartItemModel
  handleOptions: (
    itemId: string,
    isGift: boolean,
    hasWrap: boolean,
    message: string,
  ) => void
}

const CartGiftOptionsItem = ({ item, handleOptions }: Props) => {
  const [isGift, setIsGift] = useState(!!item.giftItem)
  const [hasMessage, setHasMessage] = useState(!!item.giftMessage)
  const [message, setMessage] = useState(item.giftMessage)
  const [hasWrap, setHasWrap] = useState(item.hasGiftWrap)

  const onChangeMessage = (value: string) => {
    setMessage(value)
  }

  useEffect(() => {
    if (hasMessage === false && message) {
      setMessage('')
    }
    if (!isGift) {
      setMessage('')
      setHasWrap(false)
      setHasMessage(false)
    }
    handleOptions(item.id, isGift, hasWrap, message)
  }, [isGift, hasMessage, message, hasWrap])

  return (
    <Container>
      <BookContainer>
        <BookImage size="medium" bookOrEan={item.ean} />
        <TextsContainer>
          <Title>{item.displayName}</Title>
          <Subtitle>{item.displayAuthor}</Subtitle>
          {!item.shipItem && (
            <PickUpText>Sorry, pickup items are not gift eligible</PickUpText>
          )}
        </TextsContainer>
      </BookContainer>
      {item.shipItem && (
        <>
          <Checkbox
            selected={isGift}
            onPress={() => setIsGift(!isGift)}
            checkboxStyle
          >
            <OptionsWithInfo>
              Gift Receipt - <FreeText>FREE</FreeText>
            </OptionsWithInfo>
            <Subtitle>Price will not appear on the gift receipt</Subtitle>
          </Checkbox>

          <Checkbox
            selected={hasMessage}
            onPress={() => setHasMessage(!hasMessage)}
            disabled={!item.giftMessageEligible}
            checkboxStyle
          >
            <OptionsWithInfo disabled={!item.giftMessageEligible}>
              Gift Message -
              <FreeText disabled={!item.giftMessageEligible}> FREE</FreeText>
            </OptionsWithInfo>
            <Subtitle disable={!item.giftMessageEligible}>
              Your gift message will appear on the gift receipt
            </Subtitle>
          </Checkbox>
          {hasMessage && (
            <>
              <TextField
                value={message}
                onChange={onChangeMessage}
                placeholder="Enjoy your gift!"
                label="Gift Message"
                maxLength={175}
                numberOfLines={4}
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              <CharLength>{`${message.length} / 175`}</CharLength>
            </>
          )}

          <Checkbox
            selected={hasWrap}
            onPress={() => setHasWrap(!hasWrap)}
            disabled={!item.giftWrapEligible}
            checkboxStyle
          >
            <Options disabled={!item.giftWrapEligible}>
              Gift Wrap - ${item.giftWrapPrice}
            </Options>
          </Checkbox>
        </>
      )}
    </Container>
  )
}

export default CartGiftOptionsItem
