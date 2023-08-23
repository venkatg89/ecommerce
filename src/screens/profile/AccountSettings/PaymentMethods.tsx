import React, { useState, useEffect, useContext } from 'react'
import styled, { ThemeContext } from 'styled-components/native'

import Header from 'src/controls/navigation/Header'
import { connect } from 'react-redux'
import Button from 'src/controls/Button'
import { CreditCardModel } from 'src/models/ShopModel/CreditCardModel'
import { atgUserIdSelector } from 'src/redux/selectors/userSelector'
import { creditCardsSelector } from 'src/redux/selectors/shopSelector'

import { FlatList } from 'react-native'
import CreditCardBox from 'src/components/Cart/Checkout/CreditCardBox'
import Alert from 'src/controls/Modal/Alert'
import { setCCAsDefault } from 'src/endpoints/atgGateway/cart'
import {
  getCreditCardsAction,
  removeCCAction,
} from 'src/redux/actions/shop/creditCardsAction'
import { refreshCartAction } from 'src/redux/actions/shop/cartAction'
import AddMyCardModal from 'src/components/Profile/Settings/PaymentMethods/AddMyCardModal'
import EditMyCardModal from 'src/components/Profile/Settings/PaymentMethods/EditMyCardModal'
import Images from 'assets/images'

interface StateProps {
  creditCards: CreditCardModel[]
  atgUserId: string
}

const selector = (state) => ({
  creditCards: creditCardsSelector(state),
  atgUserId: atgUserIdSelector(state),
})

interface DispatchProps {
  getCreditCards: (params: { atgUserId: string }) => void
  removeCC: (params: { atgUserId: string; creditCardNickName: string }) => void
  refreshCart: () => void
}

const dispatcher = (dispatch) => ({
  getCreditCards: (params: { atgUserId: string }) =>
    dispatch(getCreditCardsAction(params)),
  removeCC: (params: { atgUserId: string; creditCardNickName: string }) =>
    dispatch(removeCCAction(params)),
  refreshCart: () => dispatch(refreshCartAction()),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps

const PaymentMethodsScreen = ({
  atgUserId,
  creditCards,
  getCreditCards,
  refreshCart,
}: Props) => {
  const [paymentError, setPaymentError] = useState('')
  const [loadingIndex, setLoadingIndex] = useState(-1)
  const [addModal, setAddModal] = useState<boolean>(false)
  const [editModal, setEditModal] = useState<boolean>(false)
  const [editCard, setEditCard] = useState<CreditCardModel>()
  const { spacing } = useContext(ThemeContext)

  useEffect(() => {
    getCreditCards({ atgUserId })
  }, [])

  const toggleAddModal = () => {
    setAddModal(!addModal)
  }
  const toggleEditModal = () => {
    setEditModal(!editModal)
  }

  const setDefaultCC = async (creditCardNickName: string, index: number) => {
    setPaymentError('')
    setLoadingIndex(index)

    const defaultPayment = await setCCAsDefault({
      creditCardNickName,
      atgUserId: atgUserId as string,
    })

    setLoadingIndex(-1)
    if (defaultPayment.ok) {
      getCreditCards({ atgUserId })
    } else {
      if (defaultPayment?.data?.response?.message) {
        setPaymentError(defaultPayment?.data?.response?.message)
      } else {
        setPaymentError('Something went wrong, please try again later.')
      }
    }
  }

  return (
    <Container>
      <PageHeaderText>Payment Methods</PageHeaderText>
      {creditCards?.length > 0 && (
        <FlatList
          data={creditCards}
          contentContainerStyle={{ marginBottom: spacing(3) }}
          style={{ marginBottom: spacing(9) }}
          renderItem={({ item, index }) => (
            <ListItemContainer key={index}>
              <CreditCardBox
                guestMode={false}
                card={item}
                index={index}
                fullWidth
                selectedIndex={item.defaultPayment ? index : -1}
                loadingIndex={loadingIndex}
                editAction={(card) => {
                  setEditCard(card)
                  toggleEditModal()
                }}
                selectAction={(creditCardNickName, index) => {
                  setDefaultCC(creditCardNickName, index)
                }}
                radioText={item.defaultPayment ? 'default' : 'set as default'}
              />
            </ListItemContainer>
          )}
        />
      )}
      {!creditCards ||
        (creditCards?.length === 0 && (
          <Content>
            <EmptyImage source={Images.emptyInfo} />
            <DescriptionText>No Saved Payment Methods</DescriptionText>
            <DetailsText>
              Add a credit or debit cart to speed up your checkout.
            </DetailsText>
          </Content>
        ))}
      <NewPayment
        variant="contained"
        maxWidth
        isAnchor
        center
        onPress={toggleAddModal}
      >
        + Add New Payment
      </NewPayment>
      <Alert
        isOpen={paymentError.length > 0}
        title="Something went wrong with the order"
        description={paymentError}
        onDismiss={() => {
          setPaymentError('')
        }}
        cancelText="OK"
      />
      <AddMyCardModal addModal={addModal} toggleAddModal={toggleAddModal} />
      {editModal && editCard && (
        <EditMyCardModal
          editModal={editModal}
          editCard={editCard}
          toggleEditModal={toggleEditModal}
        />
      )}
    </Container>
  )
}

PaymentMethodsScreen.navigationOptions = ({ navigation }) => ({
  title: 'Payment Methods',
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default connector(PaymentMethodsScreen)

const Container = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
  flex: 1;
`

const PageHeaderText = styled.Text`
  ${({ theme }) => theme.typography.heading2}
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  margin-top: ${({ theme }) => theme.spacing(2)};
`

const NewPayment = styled(Button)`
  padding-vertical: ${({ theme }) => theme.spacing(1.5)};
  align-self: flex-end;
`
const ListItemContainer = styled.View`
  align-self: center;
  margin-top: ${({ theme }) => theme.spacing(3)};
  width: 100%;
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
