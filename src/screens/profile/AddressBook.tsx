import React, { useState, useEffect, useContext } from 'react'
import { FlatList } from 'react-native'
import Header from 'src/controls/navigation/Header'
import styled from 'styled-components/native'
import AddressBox from 'src/components/Cart/Checkout/AddressBox'
import Button from 'src/controls/Button'
import VerifyShippingAddress, {
  ADD_ADDRESS,
  VERIFY_ADDRESS,
} from 'src/screens/cart/VerifyShippingAddress'
import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'
import { myAtgAccountSelector } from 'src/redux/selectors/userSelector'
import { createStructuredSelector } from 'reselect'
import { addressDetailsSelector } from 'src/redux/selectors/shopSelector'
import { ShippingAddress } from 'src/models/ShopModel/CartModel'
import { addressDetailsAction } from 'src/redux/actions/shop/cartAction'
import { setDefaultAddressAction } from 'src/redux/actions/user/atgAccountAction'
import { connect } from 'react-redux'

import { ThemeContext } from 'styled-components/native'
import Images from 'assets/images'

const Container = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
  flex: 1;
`

const PageHeaderText = styled.Text`
  ${({ theme }) => theme.typography.heading2}
  color: ${({ theme }) => theme.palette.grey1};
  margin-top: ${({ theme }) => theme.spacing(3)};
`

const ListItemContainer = styled.View`
  align-self: center;
  margin-top: ${({ theme }) => theme.spacing(3)};
  width: 100%;
`
const SaveChangesButton = styled(Button)`
  padding-vertical: ${({ theme }) => theme.spacing(1.5)};
  align-self: flex-end;
`
const Content = styled.View`
  flex: 1;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing(5)};
`

const DescriptionText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  padding-bottom: ${({ theme }) => theme.spacing(1)};
`

const DetailsText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  margin-left: ${({ theme }) => theme.spacing(4)};
  margin-right: ${({ theme }) => theme.spacing(4)};
  text-align: center;
`

const EmptyImage = styled.Image`
  width: 200;
  height: 200;
`
interface StateProps {
  atgAccount?: AtgAccountModel
  addressList?: ShippingAddress[]
}

const selector = createStructuredSelector<any, StateProps>({
  atgAccount: myAtgAccountSelector,
  addressList: addressDetailsSelector,
})

interface DispatchProps {
  getAddressDetails: (profileId: string) => void
  setDefaultAddress: (profileId: string, addressNickname: string) => void
}

const dispatcher = (dispatch) => ({
  getAddressDetails: (profileId: string) =>
    dispatch(addressDetailsAction(profileId)),
  setDefaultAddress: (profileId: string, addressNickname: string) =>
    dispatch(setDefaultAddressAction(profileId, addressNickname)),
})

type Props = StateProps & DispatchProps
const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

const AddressBook = ({
  atgAccount,
  addressList = [],
  getAddressDetails,
  setDefaultAddress,
}: Props) => {
  const [add, setAdd] = useState(false)
  const [edit, setEdit] = useState(false)
  const [addressToEdit, setAddressToEdit] = useState(addressList[0])
  const [verifyModalOpen, setVerifyModalOpen] = useState(false)
  const { spacing } = useContext(ThemeContext)

  const addressCallback = async () => {
    if (atgAccount) {
      await getAddressDetails(atgAccount.atgUserId)
    }
  }

  useEffect(() => {
    if (!verifyModalOpen) {
      addressCallback()
    }
  }, [verifyModalOpen])

  const modalCloseHandler = () => {
    setAdd(false)
    setEdit(false)
    setVerifyModalOpen(false)
  }

  const handleCarouselSelection = (index: number) => {
    setAdd(false)
    setEdit(false)
    setDefaultAddress(
      atgAccount?.atgUserId || '',
      addressList[index].addressNickname || '',
    )
  }

  const handleVerifyDoneBtn = () => {
    setVerifyModalOpen(false)
  }

  const reload = () => {
    setEdit(false)
    setAdd(false)
  }

  return (
    <Container>
      <PageHeaderText>Address Book</PageHeaderText>
      {addressList?.length > 0 && (
        <FlatList
          data={addressList}
          contentContainerStyle={{ marginBottom: spacing(3) }}
          style={{ marginBottom: spacing(9) }}
          renderItem={({ item, index }) => (
            <ListItemContainer key={index}>
              <AddressBox
                style={{ flex: 1 }}
                address={item}
                isSelected={item.defaultAddress ? item.defaultAddress : false}
                onPress={() => {
                  handleCarouselSelection(index)
                }}
                handleEditBtn={() => {
                  setEdit(true)
                  setAddressToEdit(item)
                  setVerifyModalOpen(true)
                }}
                selectText={item.defaultAddress ? 'DEFAULT' : 'SET AS DEFAULT'}
              />
            </ListItemContainer>
          )}
        />
      )}
      {!addressList ||
        (addressList?.length === 0 && (
          <Content>
            <EmptyImage source={Images.emptyInfo} />
            <DescriptionText>No Saved Addresses</DescriptionText>
            <DetailsText>Add an address to speed up your checkout.</DetailsText>
          </Content>
        ))}
      <SaveChangesButton
        variant="contained"
        maxWidth
        isAnchor
        center
        onPress={() => {
          setAdd(true)
          setVerifyModalOpen(true)
        }}
      >
        + Add new address
      </SaveChangesButton>

      {verifyModalOpen && (
        <VerifyShippingAddress
          add={add}
          edit={edit}
          open={true}
          viewToDisplay={true ? ADD_ADDRESS : VERIFY_ADDRESS}
          isGuest={false}
          reload={reload}
          addressToEdit={addressToEdit}
          handleVerifyDoneBtn={handleVerifyDoneBtn}
          handleModalClose={modalCloseHandler}
          onAccount={true}
        />
      )}
    </Container>
  )
}

AddressBook.navigationOptions = ({ navigation }) => ({
  title: 'Account Settings',
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default connector(AddressBook)
