import { icons, nav } from 'assets/images'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Button from 'src/controls/Button'
import styled from 'styled-components/native'
import _Container from 'src/controls/layout/ScreenContainer'
import BottomDraggable from 'src/controls/Modal/BottomDraggable'
import { ShippingAddress } from 'src/models/ShopModel/CartModel'
import { createStructuredSelector } from 'reselect'
import {
  enteredShippingAddressSelector,
  suggestedShippingAddressListSelector,
  getAddressErrorSelector,
  getVerifyAddressErrorSelector,
  verifyListFetchingSelector,
} from 'src/redux/selectors/shopSelector'
import { addressDetailsAction } from 'src/redux/actions/shop/cartAction'
import {
  addAddressAction,
  editShippingAddressAction,
  addAddressToProfileAction,
} from 'src/redux/actions/shop/cartAction'
import ScrollContainer from 'src/controls/layout/ScrollContainer'
import { ActivityIndicator } from 'react-native'
import AddShippingAddressForm from 'src/components/Cart/Checkout/ShippingAddress/AddShippingAddressForm'
import { myAtgAccountSelector } from 'src/redux/selectors/userSelector'
import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'
import {
  editAddressOnProfileAction,
  deleteAddressFromProfileAction,
} from 'src/redux/actions/user/atgAccountAction'
import Alert from 'src/controls/Modal/Alert'

const ShippingContainer = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing(2.5)};
`

const Container = styled(_Container)`
  background-color: #fafafa;
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

const ErrorText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.supportingError};
  margin-bottom: ${({ theme }) => theme.spacing(0.5)};
  margin-top: ${({ theme }) => theme.spacing(5)};
`

const SubHeader = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: 4px;
  margin-top: ${({ theme }) => theme.spacing(5)};
`

const NameText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
`

const EditButton = styled.Text`
  ${({ theme }) => theme.typography.button.small}
  color: ${({ theme }) => theme.palette.linkGreen};
`

const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  align-self: center;
`

const DescriptionContainer = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const DescriptionText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey2};
`

const BackButton = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
`

const BackButtonText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1}
  flex: 1;
`

const BackIcon = styled.Image`
  height: ${(props) => props.theme.spacing(5)};
  width: ${(props) => props.theme.spacing(5)};
`

const SelectText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(0.5)};
  margin-top: ${({ theme }) => theme.spacing(4)};
`

const BackButtonContainer = styled.View`
  bottom: ${({ theme }) => theme.spacing(1)};
`
const HeaderContainer = styled.View`
  flex-direction: row;
  width: 60%;
  justify-content: space-between;
`

const DeleteBtnText = styled.Text`
  color: ${({ theme }) => theme.palette.supportingError};
  font-weight: bold;
  padding-left: ${({ theme }) => theme.spacing(2)};
  ${({ theme }) => theme.typography.button.small};
`

const DoneButton = styled(Button)``

interface OwnProps {
  open: boolean
  add?: boolean
  edit?: boolean
  viewToDisplay: string
  addressToEdit?: ShippingAddress
  isGuest: boolean
  reload: () => void
  handleModalClose: (editAddress?: boolean) => void
  handleVerifyDoneBtn: (addressRequest?: object) => void
  returnAddress?: boolean
  onAccount?: boolean
}

interface StateProps {
  enteredShippingAddress?: ShippingAddress
  suggestedShippingAddressList?: ShippingAddress[]
  verifyListFetching?: boolean
  atgAccount?: AtgAccountModel
  addressError?: Error
  verifyAddressError?: Error
}

interface DispatchProps {
  addShippingAddress: (
    addressRequest: ShippingAddress,
    profileId: string,
  ) => void
  editShippingAddress: (
    addressRequest: ShippingAddress,
    profileId: string,
  ) => void
  addAddressToProfile: (
    addressRequest: ShippingAddress,
    profileId: string,
  ) => void
  editAddressOnProfile: (
    addressRequest: ShippingAddress,
    profileId: string,
  ) => void
  deleteAddressFromProfile: (addressNickName: string, profileId: string) => void
  getAddressDetails: (profileId: string) => void
}

const selector = createStructuredSelector<any, StateProps>({
  enteredShippingAddress: enteredShippingAddressSelector,
  suggestedShippingAddressList: suggestedShippingAddressListSelector,
  verifyListFetching: verifyListFetchingSelector,
  atgAccount: myAtgAccountSelector,
  addressError: getAddressErrorSelector,
  verifyAddressError: getVerifyAddressErrorSelector
})

const dispatcher = (dispatch) => ({
  addShippingAddress: (addressRequest: ShippingAddress, profileId: string) =>
    dispatch(addAddressAction(addressRequest, profileId)),
  editShippingAddress: (addressRequest: ShippingAddress, profileId: string) =>
    dispatch(editShippingAddressAction(addressRequest, profileId)),
  addAddressToProfile: (addressRequest: ShippingAddress, profileId: string) =>
    dispatch(addAddressToProfileAction(addressRequest, profileId)),
  editAddressOnProfile: (addressRequest: ShippingAddress, profileId: string) =>
    dispatch(editAddressOnProfileAction(addressRequest, profileId)),
  deleteAddressFromProfile: (addressNickName: string, profileId: string) =>
    dispatch(deleteAddressFromProfileAction(addressNickName, profileId)),
  getAddressDetails: (profileId: string) =>
    dispatch(addressDetailsAction(profileId)),
})

type Props = OwnProps & StateProps & DispatchProps

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

export const ADD_ADDRESS = 'AddAddress'
export const VERIFY_ADDRESS = 'VerifyAddress'
export const DISPLAY_ALL_ADDRESS = 'DisplayAllAddress'

const VerifyShippingAddressScreen = ({
  add,
  edit,
  addressToEdit,
  isGuest,
  reload,
  open,
  atgAccount,
  viewToDisplay,
  enteredShippingAddress,
  suggestedShippingAddressList = [],
  verifyListFetching,
  addressError,
  verifyAddressError,
  addShippingAddress,
  editShippingAddress,
  handleModalClose,
  handleVerifyDoneBtn,
  returnAddress,
  addAddressToProfile,
  onAccount,
  editAddressOnProfile,
  deleteAddressFromProfile,
  getAddressDetails,
}: Props) => {
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0)
  const [enteredAddressSelected, setEnteredAddressSelected] = useState(false)
  const [isOpen, setIsOpen] = useState(open)
  const [addAddress, setAddAddress] = useState(add)
  const [view, setView] = useState(viewToDisplay)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [updateAddressApiCalled, setUpdateAddressApiCalled] = useState(false)

  useEffect(() => {
    if (updateAddressApiCalled && (!addressError || !addressError.message)) {
      setIsOpen(false)
      handleVerifyDoneBtn()
    }
  }, [addressError])

  const suggestedAddress =
    suggestedShippingAddressList && suggestedShippingAddressList.length > 0
      ? suggestedShippingAddressList[selectedAddressIndex]
      : null

  const handleAddressDoneBtn = () => {
    setUpdateAddressApiCalled(false)
    const address = enteredAddressSelected
      ? enteredShippingAddress
      : suggestedShippingAddressList[selectedAddressIndex]
    const addressRequest = {
      country: address?.country || '',
      address1: address?.address1 || '',
      address2: address?.address2 || '',
      postalCode: address?.postalCode || '',
      city: address?.city || '',
      state: address?.state || '',
      firstName: enteredShippingAddress?.firstName || '',
      lastName: enteredShippingAddress?.lastName || '',
      phoneNumber: enteredShippingAddress?.phoneNumber || '',
      companyName: enteredShippingAddress?.companyName || '',
      shippingNNameId: enteredShippingAddress?.addressNickname,
      isPostOrder: false,
      addressId: addressToEdit?.atgAddressId,
      excludeUPS: enteredShippingAddress?.excludeUPS,
      defaultAddress: enteredShippingAddress?.defaultAddress,
      makeDefault: enteredShippingAddress?.makeDefault,
      profileId: atgAccount?.atgUserId,
    }
    if (returnAddress) {
      // do not save as shipping, return the address to caller
      setIsOpen(false)
      handleVerifyDoneBtn(addressRequest)
    } else {
      setUpdateAddressApiCalled(true)
      if (add || isGuest) {
        if (onAccount) {
          addAddressToProfile(addressRequest, atgAccount?.atgUserId || '')
        } else {
          addShippingAddress(addressRequest, atgAccount?.atgUserId || '')
        }
      } else {
        if (onAccount) {
          editAddressOnProfile(addressRequest, atgAccount?.atgUserId || '')
        } else {
          editShippingAddress(addressRequest, atgAccount?.atgUserId || '')
        }
      }
    }
  }

  const handleDelete = async () => {
    await deleteAddressFromProfile(
      addressToEdit?.addressNickname || '',
      atgAccount?.atgUserId || '',
    )
  }

  const handleAddAddressContinueBtn = () => {
    setView(VERIFY_ADDRESS)
  }

  const handleClose = (editAddress) => {
    setUpdateAddressApiCalled(false)
    setIsOpen(false)
    handleModalClose(editAddress)
  }

  const handleEnteredAddressEditBtn = () => {
    setUpdateAddressApiCalled(false)
    if (isGuest) {
      handleClose(true)
    } else {
      setView(ADD_ADDRESS)
      setAddAddress(false)
      setEnteredAddressSelected(true)
    }
  }

  const handleSeeAllBtn = () => {
    setView(DISPLAY_ALL_ADDRESS)
  }

  const getTitle = () => {
    if (edit) {
      return 'Edit Address'
    }
    if (add) {
      return 'Add Address'
    }
    return 'Add Address'
  }

  return (
    <Container>
      <BottomDraggable
        header={
          view === ADD_ADDRESS ? (
            edit && !add ? (
              !isGuest ? (
                <HeaderContainer>
                  <DeleteBtnText onPress={() => setDeleteModalOpen(true)}>
                    DELETE
                  </DeleteBtnText>

                  <HeaderText>{getTitle()}</HeaderText>
                </HeaderContainer>
              ) : (
                <HeaderText>{getTitle()}</HeaderText>
              )
            ) : (
              <HeaderText>{getTitle()}</HeaderText>
            )
          ) : isGuest && view === VERIFY_ADDRESS ? (
            <HeaderText>Verify Your Address</HeaderText>
          ) : null
        }
        footer={
          view === ADD_ADDRESS ? null : (
            <DoneButton
              onPress={handleAddressDoneBtn}
              variant="contained"
              isAnchor
              maxWidth
              center
            >
              Select Address
            </DoneButton>
          )
        }
        isOpen={isOpen}
        fullContent
        onDismiss={() => handleClose(false)}
      >
        <Alert
          isOpen={deleteModalOpen}
          onDismiss={() => {
            setDeleteModalOpen(false)
          }}
          title="Delete Address"
          description="Are you sure you want to delete this address?"
          buttons={[
            {
              title: 'DELETE ADDRESS',
              onPress: () => {
                handleDelete()
                handleClose(false)
              },
              warning: true,
            },
          ]}
          cancelText="Not now"
        />
        {verifyListFetching && <ActivityIndicator size="large" color="grey" />}
        {view === ADD_ADDRESS && (
          <AddShippingAddressForm
            edit={!addAddress && edit}
            isGuest={isGuest}
            returnAddress={returnAddress}
            addressToEdit={
              enteredAddressSelected ? enteredShippingAddress : addressToEdit
            }
            reload={reload}
            handleAddAddressContinueBtn={handleAddAddressContinueBtn}
            onAccount={onAccount}
          />
        )}
        {!verifyListFetching && view === DISPLAY_ALL_ADDRESS && (
          <React.Fragment>
            <BackButtonContainer>
              <BackButton onPress={() => setView(VERIFY_ADDRESS)}>
                <BackIcon source={nav.topBar.back} />
                <BackButtonText numberOfLines={1}>
                  Verify Your Address
                </BackButtonText>
              </BackButton>
            </BackButtonContainer>
            <SelectText>Please select your address below</SelectText>
            <ScrollContainer withAnchor>
              {suggestedShippingAddressList.map((address, index) => (
                <ShippingContainer
                  key={'address' + index}
                  onPress={() => {
                    setSelectedAddressIndex(index)
                    setEnteredAddressSelected(false)
                  }}
                >
                  <CheckboxCircleIcon
                    source={
                      selectedAddressIndex === index
                        ? icons.radioSelected
                        : icons.radioDeselected
                    }
                  />
                  <StoreContainer>
                    <DescriptionText>{address.address1}</DescriptionText>
                    {address.address2 !== '' && (
                      <DescriptionText>{address.address2}</DescriptionText>
                    )}
                    <DescriptionText>
                      {address.city}, {address.state}
                    </DescriptionText>
                    <DescriptionText>{address.postalCode}</DescriptionText>
                  </StoreContainer>
                </ShippingContainer>
              ))}
            </ScrollContainer>
          </React.Fragment>
        )}
        {!verifyListFetching && view === VERIFY_ADDRESS && (
          <React.Fragment>
            {!isGuest && (
              <BackButtonContainer>
                <BackButton
                  onPress={() => {
                    setView(ADD_ADDRESS)
                    handleEnteredAddressEditBtn()
                  }}
                >
                  <BackIcon source={nav.topBar.back} />
                  <BackButtonText numberOfLines={1}>Address</BackButtonText>
                </BackButton>
              </BackButtonContainer>
            )}
            {updateAddressApiCalled && addressError && (
              <ErrorText>{addressError.message}</ErrorText>
            )}
            {!suggestedAddress && verifyAddressError && (
              <ErrorText>{verifyAddressError.message}</ErrorText>
            )}
            {suggestedAddress && (
              <React.Fragment>
                <ShippingContainer
                  onPress={() => {
                    setSelectedAddressIndex(0)
                    setEnteredAddressSelected(false)
                  }}
                >
                  <CheckboxCircleIcon
                    source={
                      enteredAddressSelected
                        ? icons.radioDeselected
                        : icons.radioSelected
                    }
                  />
                  <StoreContainer>
                    <TitleContainer>
                      <NameText>Use suggested address</NameText>
                      {suggestedShippingAddressList.length > 0 && (
                        <EditButton onPress={handleSeeAllBtn}>
                          SEE ALL
                        </EditButton>
                      )}
                    </TitleContainer>
                    <DescriptionContainer>
                      <DescriptionText>
                        {suggestedAddress && suggestedAddress.address1}
                      </DescriptionText>
                      {suggestedAddress.address2 !== '' && (
                        <DescriptionText>
                          {suggestedAddress.address2}
                        </DescriptionText>
                      )}
                      <DescriptionText>
                        {suggestedAddress && suggestedAddress.city},
                        {suggestedAddress && suggestedAddress.state}
                      </DescriptionText>
                      <DescriptionText>
                        {suggestedAddress && suggestedAddress.postalCode}
                      </DescriptionText>
                    </DescriptionContainer>
                  </StoreContainer>
                </ShippingContainer>
                <ShippingContainer
                  onPress={() => setEnteredAddressSelected(true)}
                >
                  <CheckboxCircleIcon
                    source={
                      enteredAddressSelected
                        ? icons.radioSelected
                        : icons.radioDeselected
                    }
                  />
                  <StoreContainer>
                    <TitleContainer>
                      <NameText>Use as entered</NameText>
                      <EditButton onPress={handleEnteredAddressEditBtn}>
                        EDIT
                      </EditButton>
                    </TitleContainer>
                    <DescriptionContainer>
                      <DescriptionText>
                        {enteredShippingAddress &&
                          enteredShippingAddress.address1}
                        {'\n'}
                        {enteredShippingAddress &&
                          enteredShippingAddress.address2}
                      </DescriptionText>
                      <DescriptionText>
                        {enteredShippingAddress && enteredShippingAddress.city},{' '}
                        {enteredShippingAddress && enteredShippingAddress.state}
                      </DescriptionText>
                      <DescriptionText>
                        {enteredShippingAddress &&
                          enteredShippingAddress.postalCode}
                      </DescriptionText>
                    </DescriptionContainer>
                  </StoreContainer>
                </ShippingContainer>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </BottomDraggable>
    </Container>
  )
}

export default connector(VerifyShippingAddressScreen)
