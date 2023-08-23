import { icons } from 'assets/images'
import React from 'react'
import { ShippingAddress } from 'src/models/ShopModel/CartModel'
import styled from 'styled-components/native'

const CheckboxCircleIcon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`

const EditButton = styled.Text`
  ${({ theme }) => theme.typography.button.small};
  color: ${({ theme }) => theme.palette.linkGreen};
  padding-horizontal: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  margin-right: ${({ theme }) => theme.spacing(1)};
  text-transform: uppercase;
  align-self: flex-end;
`

export const AddNewShippingAddressButton = styled.Text`
  ${({ theme }) => theme.typography.button.small};
  color: ${({ theme }) => theme.palette.linkGreen};
  text-transform: uppercase;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

export const DescriptionText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  margin-left: ${({ theme }) => theme.spacing(2)};
`

export const SelectText = styled.Text`
  ${({ theme }) => theme.typography.button.small};
  color: ${({ theme }) => theme.palette.grey1};
  text-transform: uppercase;
  margin-top: ${({ theme }) => theme.spacing(0.5)};
  margin-left: ${({ theme }) => theme.spacing(1)};
`

export const DescriptionContainer = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

export const SelectTextContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(2)};
`

export const ReviewNumberText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey1};
  border-radius: 12;
  height: 24;
  width: 24;
  border: ${({ theme }) => theme.palette.grey1};
  padding-top: ${({ theme }) => theme.spacing(0.2)};
  text-align: center;
`

export const BoxContainer = styled.TouchableOpacity`
  box-shadow: 2px 2px 3px ${({ theme }) => theme.palette.grey4};
  background-color: white;
  border: 1px solid #c3c3c3;
`

interface Props {
  address: ShippingAddress
  handleEditBtn: () => void
  isSelected: boolean
  onPress: () => void
  style?: any
  selectText: string
}

const AddressBox = ({
  address,
  handleEditBtn,
  isSelected,
  onPress,
  style,
  selectText,
}: Props) => {
  return (
    <BoxContainer style={style} onPress={onPress}>
      <DescriptionContainer>
        <SelectTextContainer>
          <CheckboxCircleIcon
            source={isSelected ? icons.radioSelected : icons.radioDeselected}
          />
          <SelectText>{selectText}</SelectText>
        </SelectTextContainer>
        <DescriptionText>
          {address?.firstName} {address?.lastName}
        </DescriptionText>
        <DescriptionText>
          {address?.address1} {address?.address2}
        </DescriptionText>
        <DescriptionText>
          {address?.city}, {address?.state}, {address?.postalCode}
        </DescriptionText>
      </DescriptionContainer>
      <EditButton onPress={handleEditBtn}>EDIT</EditButton>
    </BoxContainer>
  )
}

export default AddressBox
