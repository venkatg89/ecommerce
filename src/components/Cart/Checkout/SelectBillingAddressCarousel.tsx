import { icons } from 'assets/images'
import React, { useState, useRef } from 'react'
import { connect } from 'react-redux'
import { addressDetailsSelector } from 'src/redux/selectors/shopSelector'
import { ScrollView, Dimensions } from 'react-native'
import DeviceInfo from 'react-native-device-info'

import { ShippingAddress } from 'src/models/ShopModel/CartModel'
import VerifyShippingAddress, {
  ADD_ADDRESS,
} from 'src/screens/cart/VerifyShippingAddress'
import styled from 'styled-components/native'
import { isUserLoggedInSelector } from 'src/redux/selectors/userSelector'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const BOX_WIDTH = DeviceInfo.isTablet() ? SCREEN_WIDTH / 3 : SCREEN_WIDTH / 1.35

interface StateProps {
  addressList?: ShippingAddress[]
  isUserSignedIn: Boolean
}

interface OwnProps {
  handleEditBtn: (index: number) => void
  handleCarouselSelection: (address: ShippingAddress) => void
  handleAddBtn: () => void
}

interface DispatchProps {}

const selector = (state) => ({
  addressList: addressDetailsSelector(state),
  isUserSignedIn: isUserLoggedInSelector(state),
})

const dispatcher = (dispatch) => ({})

type Props = OwnProps & StateProps & DispatchProps

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

const SelectBillingAddressCarousel = ({
  addressList = [],
  handleCarouselSelection,
  isUserSignedIn,
}: Props) => {
  const scrollViewRef = useRef<ScrollView>(null)
  const [selectedIndex, setSelectedIndex] = useState(300) //do no preselect any address yet
  const [addAddress, setAddAddress] = useState(false)
  const [guestAddress, setGuestAddress] = useState<ShippingAddress | undefined>(
    undefined,
  )
  const handleSelection = (address: ShippingAddress, index: number) => {
    handleCarouselSelection(address)
    setSelectedIndex(index)
  }

  const handleAddAddressBtn = () => {
    scrollToBeginning()
    setAddAddress(true)
  }

  const handleVerifyModalClose = (address) => {
    if (!isUserSignedIn) {
      setGuestAddress(address)
    }
    setAddAddress(false)
  }

  const scrollToBeginning = () => {
    if (scrollViewRef) {
      /* eslint-disable no-unused-expressions */
      scrollViewRef.current?.scrollTo?.({ x: 0, y: 0, animated: true })
    }
  }
  return (
    <Container>
      <ShippingContainer>
        <StoreContainer>
          <React.Fragment>
            <AddNewShippingAddressButtonContainer>
              <AddNewShippingAddressButton onPress={handleAddAddressBtn}>
                Add new billing address
              </AddNewShippingAddressButton>
            </AddNewShippingAddressButtonContainer>
            {addAddress && (
              <VerifyShippingAddress
                add={addAddress}
                edit={false}
                open={true}
                isGuest={!isUserSignedIn}
                returnAddress={!isUserSignedIn}
                viewToDisplay={ADD_ADDRESS}
                reload={() => setAddAddress(false)}
                handleVerifyDoneBtn={handleVerifyModalClose}
                handleModalClose={() => setAddAddress(false)}
                onAccount={true}
              />
            )}
              <Scroll
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                ref={scrollViewRef}
              >
                {(!isUserSignedIn && guestAddress
                  ? [guestAddress]
                  : addressList
                )
                  .sort((first: any, second: any) => {
                    return (
                      new Date(second?.lastModified).getTime() -
                      new Date(first?.lastModified).getTime()
                    )
                  })
                  .map((address, index) => (
                    <BoxContainer
                      onPress={() => handleSelection(address, index)}
                    >
                      <DescriptionContainer>
                        <SelectTextContainer>
                          <CheckboxCircleIcon
                            source={
                              selectedIndex === index
                                ? icons.radioSelected
                                : icons.radioDeselected
                            }
                          />
                          <SelectText>
                            {selectedIndex === index ? 'SELECTED' : 'SELECT'}
                          </SelectText>
                        </SelectTextContainer>
                        <DescriptionText>
                          {address?.firstName} {address?.lastName}
                        </DescriptionText>
                        <DescriptionText>
                          {address?.address1} {address?.address2}
                        </DescriptionText>
                        <DescriptionText>
                          {address?.city}, {address?.state},{' '}
                          {address?.postalCode}
                        </DescriptionText>
                      </DescriptionContainer>
                    </BoxContainer>
                  ))}
              </Scroll>
          </React.Fragment>
        </StoreContainer>
      </ShippingContainer>
    </Container>
  )
}

export default connector(SelectBillingAddressCarousel)

const Container = styled.View``

const ShippingContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing(2.5)};
  margin-right: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const CheckboxCircleIcon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`

const StoreContainer = styled.View`
  flex: 1;
  margin-top: ${({ theme }) => theme.spacing(0.5)};
`

export const AddNewShippingAddressButton = styled.Text`
  ${({ theme }) => theme.typography.button.small};
  color: ${({ theme }) => theme.palette.linkGreen};
  text-transform: uppercase;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

export const AddNewShippingAddressButtonContainer = styled.TouchableOpacity``

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

export const BoxContainer = styled.TouchableOpacity`
  box-shadow: 2px 2px 3px ${({ theme }) => theme.palette.grey4};
  background-color: white;
  border: 1px solid #c3c3c3;
  width: ${BOX_WIDTH};
  margin-right: ${({ theme }) => theme.spacing(2)};
`

export const Scroll = styled.ScrollView``
