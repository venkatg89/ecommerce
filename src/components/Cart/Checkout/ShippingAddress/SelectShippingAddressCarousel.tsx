import React, { useState } from 'react'
import { connect } from 'react-redux'
import Button from 'src/controls/Button'
import { isUserLoggedInSelector } from 'src/redux/selectors/userSelector'
import { ShippingAddress } from 'src/models/ShopModel/CartModel'
import AddressBox from 'src/components/Cart/Checkout/AddressBox'
import { getSelectedIndex } from 'src/screens/cart/Checkout'
import styled from 'styled-components/native'

const Container = styled.View`
  background-color: #fafafa;
`

const ShippingContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing(2.5)};
  margin-left: ${({ theme }) => theme.spacing(1)};
  margin-right: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const StoreContainer = styled.View`
  flex: 1;
  margin-horizontal: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(0.5)};
`

const NameText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-left: ${({ theme }) => theme.spacing(1)};
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

const RowContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

export const SelectTextContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(2)};
`

const ContinueButton = styled(Button)`
  padding-vertical: ${({ theme }) => theme.spacing(1.5)};
  margin-left: ${({ theme }) => theme.spacing(4)};
  margin-right: ${({ theme }) => theme.spacing(4)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
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
  width: 330;
  margin-right: ${({ theme }) => theme.spacing(2)};
`

export const Scroll = styled.ScrollView``

interface StateProps {
  isUserSignedIn: Boolean
}

interface OwnProps {
  addressList?: ShippingAddress[]
  handleEditBtn: (index: number) => void
  handleCarouselSelection: (index: number) => void
  handleAddBtn: () => void
  isRefreshing: boolean
}

interface DispatchProps {}

const selector = (state) => ({
  isUserSignedIn: isUserLoggedInSelector(state),
})

const dispatcher = (dispatch) => ({})

type Props = OwnProps & StateProps & DispatchProps

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

const SelectShippingAddressCarousel = ({
  addressList = [],
  handleEditBtn,
  handleCarouselSelection,
  handleAddBtn,
  isRefreshing,
  isUserSignedIn,
}: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(
    getSelectedIndex(addressList),
  )

  const handleContinueBtn = () => {
    handleCarouselSelection(selectedIndex)
  }

  return (
    <Container>
      <ShippingContainer>
        <StoreContainer>
          <RowContainer>
            <ReviewNumberText>1</ReviewNumberText>
            <NameText>Shipping Address</NameText>
          </RowContainer>
          <React.Fragment>
            {isUserSignedIn && (
              <AddNewShippingAddressButton onPress={handleAddBtn}>
                Add new shipping address
              </AddNewShippingAddressButton>
            )}

            <Scroll
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              {addressList.map((address, index) => (
                <AddressBox
                  style={{ marginRight: 16, width: 330 }}
                  key={index}
                  address={address}
                  isSelected={selectedIndex === index}
                  onPress={() => setSelectedIndex(index)}
                  handleEditBtn={() => handleEditBtn(index)}
                  selectText="SELECT"
                />
              ))}
            </Scroll>
          </React.Fragment>
        </StoreContainer>
      </ShippingContainer>
      <ContinueButton
        variant="contained"
        maxWidth
        center
        disabled={isRefreshing}
        style={{ width: '90%' }}
        onPress={handleContinueBtn}
        showSpinner={isRefreshing}
      >
        Continue
      </ContinueButton>
    </Container>
  )
}

export default connector(SelectShippingAddressCarousel)
