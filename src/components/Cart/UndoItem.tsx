import React from 'react'
import { ShopCartItemModel } from 'src/models/ShopModel/CartModel'
import styled from 'styled-components/native'
import BookImage from '../BookImage'
import Button from 'src/controls/Button'

const UndoContainer = styled.View`
  flex-direction: row;
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const UndoRightContainer = styled.View`
  margin-right: ${({ theme }) => theme.spacing(2)};
  justify-content: space-around;
  flex: 1;
`

const UndoButtonContainer = styled.View`
  align-items: flex-end;
`

const UndoMainLabel = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-right: ${({ theme }) => theme.spacing(4)};
  margin-left: ${({ theme }) => theme.spacing(2)};
`
const ButtonText = styled.Text`
  ${({ theme }) => theme.typography.button.regular};
  color: ${({ theme }) => theme.palette.linkGreen};
  text-transform: uppercase;
`
interface Props {
  item: ShopCartItemModel
  onUndo: () => void
}

const UndoItem = ({ item, onUndo }: Props) => {
  return (
    <UndoContainer>
      <BookImage size="small" bookOrEan={item.ean} />
      <UndoRightContainer>
        <UndoMainLabel>{item.displayName} removed from cart.</UndoMainLabel>
        <UndoButtonContainer>
          <Button onPress={onUndo} size={'regular'}>
            <ButtonText>Undo</ButtonText>
          </Button>
        </UndoButtonContainer>
      </UndoRightContainer>
    </UndoContainer>
  )
}

export default UndoItem
