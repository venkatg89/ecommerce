import React, { useState, useEffect } from 'react'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'
import { connect } from 'react-redux'
import { ErrorMessage, FormErrors } from 'src/models/FormModel'

import {
  clearFormFieldErrorMessagesAction,
  setformErrorMessagesAction,
} from 'src/redux/actions/form/errorsAction'
import { formErrorsSelector } from 'src/redux/selectors/formSelector'
import { getOrderDetailsAction } from 'src/redux/actions/user/orderHistory'
import _TextField from 'src/controls/form/TextField'
import _Button from 'src/controls/Button'
import { navigate, Params } from 'src/helpers/navigationService'
import Routes from 'src/constants/routes'
import checkEmailFormat from 'src/helpers/ui/checkEmailFormat'
import { orderDetailsSelector } from 'src/redux/selectors/profile/orderHistory'
import { OrderDetailsModel } from 'src/models/UserModel/AtgAccountModel'
import { icons } from 'assets/images'

const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.heading2}
  color: ${({ theme }) => theme.palette.grey1};
`
const Button = styled(_Button)`
  margin-top: ${({ theme }) => theme.spacing(2)};
`

const TextField = styled(_TextField)`
  margin-top: ${({ theme }) => theme.spacing(2)};
`

const SignInContainer = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`

const OrderHistoryText = styled.Text`
  ${({ theme }) => theme.typography.heading3}
  color: ${({ theme }) => theme.palette.grey1};
`

const WishlistsText = styled.Text`
  ${({ theme }) => theme.typography.heading3}
  color: ${({ theme }) => theme.palette.grey1};
  margin-vertical: ${({ theme }) => theme.spacing(1)};
`
const WishlistsSubText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey2};
`

const AppDetailsContainer = styled.TouchableOpacity`
  flex: 1;
`

const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const AppDetailsTitle = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
`

const Details = styled.Text`
  margin-top: ${({ theme }) => theme.spacing(1)};
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
`

const Icon = styled.Image`
  height: ${({ theme }) => theme.spacing(3)};
  width: ${({ theme }) => theme.spacing(3)};
`

const Divider = styled.View`
  height: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.palette.grey5};
  margin-vertical: ${({ theme }) => theme.spacing(3)};
`

const ErrorText = styled.Text`
  font-family: ${({ theme }) => theme.typography.body1.fontFamily};
  color: ${({ theme }) => theme.palette.supportingError};
  margin-top: ${({ theme }) => theme.spacing(1)};
`

const FORM_ID = 'AccountGuestOrderHistory'
const EMAIL_ID = 'orderHistoryEmail'
const ORDER_NUMBER = 'orderHistoryNumber'

interface StateProps {
  formError: FormErrors
  orderDetails: Record<string, OrderDetailsModel>
}

const selector = createStructuredSelector({
  formError: formErrorsSelector,
  orderDetails: orderDetailsSelector,
})
interface DispatchProps {
  setError: (error: ErrorMessage) => void
  clearError: (fieldId: string) => void
  getOrderDetails: (order, email, MAX_NUMBER, errorFormId) => void
}

const dispatcher = (dispatch) => ({
  setError: (error) => dispatch(setformErrorMessagesAction(FORM_ID, [error])),
  clearError: (fieldId) =>
    dispatch(
      clearFormFieldErrorMessagesAction({
        formId: FORM_ID,
        formFieldId: fieldId,
      }),
    ),
  getOrderDetails: (order, email, MAX_NUMBER, errorFormId) =>
    dispatch(getOrderDetailsAction(order, email, MAX_NUMBER, errorFormId)),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = DispatchProps & StateProps

const AccountGuestMode = ({
  setError,
  clearError,
  getOrderDetails,
  formError,
  orderDetails,
}: Props) => {
  const [email, setEmailId] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [isEdited, setIsEdited] = useState(false)

  useEffect(() => {
    if (!isEdited) {
      return
    }

    if (!email) {
      setError({
        formFieldId: EMAIL_ID,
        error: 'Field cannot be empty',
      })
    } else if (!checkEmailFormat(email)) {
      setError({
        formFieldId: EMAIL_ID,
        error: 'Please insert a valid email address',
      })
    } else {
      clearError(EMAIL_ID)
    }
  }, [email])

  useEffect(() => {
    if (!isEdited) {
      return
    }

    if (!orderNumber) {
      setError({
        formFieldId: ORDER_NUMBER,
        error: 'Field cannot be empty',
      })
    } else {
      clearError(ORDER_NUMBER)
    }
  }, [orderNumber])

  useEffect(() => {
    if (orderDetails[orderNumber]) {
      clearError(FORM_ID)
      navigate(Routes.ACCOUNT_ORDER_DETAILS, {
        [Params.ORDER_ID]: orderNumber,
      })
    }
  }, [orderDetails])

  return (
    <>
      <HeaderText>Account</HeaderText>
      <SignInContainer>
        <Button
          variant="contained"
          center
          maxWidth
          onPress={() => {
            navigate(Routes.MODAL__LOGIN)
          }}
          large
        >
          Sign in
        </Button>
        <Button
          variant="outlined"
          center
          maxWidth
          onPress={() => {
            navigate(Routes.MODAL__SIGNUP)
          }}
          large
          linkGreen
        >
          Create Account
        </Button>
      </SignInContainer>
      <OrderHistoryText>Order History</OrderHistoryText>
      <TextField
        value={email}
        label="Email Address*"
        onChange={(value) => {
          clearError(EMAIL_ID)
          if (!isEdited) {
            setIsEdited(true)
          }
          setEmailId(value)
        }}
        autoCapitalize="none"
        formFieldId={EMAIL_ID}
        formId={FORM_ID}
      />
      <TextField
        value={orderNumber}
        label="Order Number*"
        autoCapitalize="none"
        onChange={(value) => {
          clearError(ORDER_NUMBER)
          if (!isEdited) {
            setIsEdited(true)
          }
          setOrderNumber(value)
        }}
        formFieldId={ORDER_NUMBER}
        formId={FORM_ID}
      />
      {formError[FORM_ID] && (
        <ErrorText>{formError[FORM_ID].AccountGuestOrderHistory}</ErrorText>
      )}
      <Button
        variant="contained"
        center
        maxWidth
        onPress={async () => {
          const order = [{ orderNumber }]
          let isError = !(email && checkEmailFormat(email) && orderNumber)
          if (!isError) {
            await getOrderDetails(order, email, order.length, FORM_ID)
          }
        }}
        large
      >
        Find Order
      </Button>
      <Divider />
      <WishlistsText>Wishlists</WishlistsText>
      <WishlistsSubText>
        Sign in or create an account to start saving and sharing favorites.
      </WishlistsSubText>
      <Divider />
      <AppDetailsContainer onPress={() => navigate(Routes.PROFILE__MY_PROFILE)}>
        <TitleContainer>
          <AppDetailsTitle>App Details</AppDetailsTitle>
          <Icon source={icons.arrowRight} />
        </TitleContainer>
        <Details>Gift Cards, Memberships, Notifications, Etc.</Details>
      </AppDetailsContainer>
    </>
  )
}

export default connector(AccountGuestMode)
