import { icons } from 'assets/images'
import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { ShippingAddress as ShippingAddressModel } from 'src/models/ShopModel/CartModel'
import styled from 'styled-components/native'

const Container = styled.View`
  background-color: #fafafa;
`
const ShippingContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-right: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const CheckboxCircleIcon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`

const StoreContainer = styled.View`
  flex: 1;
  margin-horizontal: ${({ theme }) => theme.spacing(1)};
  margin-top: ${({ theme }) => theme.spacing(0.5)};
`

const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const NameText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  line-height: 18;
  letter-spacing: 0.4;
  margin-bottom: ${({ theme }) => theme.spacing(0.5)};
`
const EditButton = styled.Text`
  font-family: Lato-Bold;
  color: ${({ theme }) => theme.palette.linkGreen};
  padding-horizontal: ${({ theme }) => theme.spacing(1)};
  letter-spacing: 1.4;
  font-size: 12;
`
const DescriptionText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey2};
  line-height: 18;
  letter-spacing: 0.4;
`

const DescriptionContainer = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

interface OwnProps {
  address: ShippingAddressModel
  handleAddressSelectionEditBtn: () => void
}

interface StateProps {}

const selector = createStructuredSelector<any, StateProps>({})

type Props = OwnProps & StateProps

const connector = connect<StateProps, {}, {}>(selector)

const ShippingAddressDetails = ({
  address,
  handleAddressSelectionEditBtn,
}: Props) => {
  return (
    <Container>
      <ShippingContainer>
        <CheckboxCircleIcon source={icons.checkboxCheckedCircle} />
        <StoreContainer>
          <TitleContainer>
            <NameText>Shipping Address</NameText>
            <EditButton onPress={handleAddressSelectionEditBtn}>
              EDIT
            </EditButton>
          </TitleContainer>
          <DescriptionContainer>
            <DescriptionText>
              {address.firstName} {address.lastName}
            </DescriptionText>
            <DescriptionText>
              {address.address1}
              {address.address2}
            </DescriptionText>
            <DescriptionText>
              {address.city}, {address.state}
            </DescriptionText>
            <DescriptionText>{address.postalCode}</DescriptionText>
          </DescriptionContainer>
        </StoreContainer>
      </ShippingContainer>
    </Container>
  )
}

export default connector(ShippingAddressDetails)
