import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'
import { Platform } from 'react-native'

import { formErrorsSelector } from 'src/redux/selectors/formSelector'
import { isEmpty } from 'src/helpers/objectHelpers'
import Button from 'src/controls/Button'
import { DISCOUNTS_FORM } from 'src/constants/formErrors'
import _TextField from 'src/controls/form/TextField'
import _Select from 'src/controls/form/Select'
import { FormErrors } from 'src/models/FormModel'

import {
  myAtgAccountSelector,
  myAtgErrorSelector,
} from 'src/redux/selectors/userSelector'
import { addMembershipAction } from 'src/redux/actions/cart/discountsAction'
import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'

import { atgAccountApiRequestStatusSelector } from 'src/redux/selectors/apiStatus/user'
import { pop } from 'src/helpers/navigationService'
import { RequestStatus } from 'src/models/ApiStatus'
import { cards } from 'assets/images'

const Container = styled.View`
  border-radius: ${({ theme }) => theme.spacing(2)};
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
  flex: 1;
  background-color: ${({ theme }) => theme.palette.white};
`

const Select = styled(_Select)`
  margin-top: ${({ theme }) => theme.spacing(7)};
`

const TextField = styled(_TextField)`
  margin-top: ${({ theme }) => theme.spacing(2)};
  max-height: 60;
`

const MemberCardIcon = styled.View`
  margin-top: ${({ theme }) => theme.spacing(6)};
  align-items: center;
  justify-content: flex-end;
`

const FooterContainer = styled.View`
  justify-content: flex-end;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  ${Platform.OS === 'ios'
    ? `
  margin-top: auto
  `
    : ''}
`

const ImgCard = styled.Image``

const LinkMembershipButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing(2)}px;
  text-transform: uppercase;
`

const TextInfo = styled.Text`
  font-family: Lato-Regular;
  ${({ theme }) => theme.typography.subtitle3}
  color: ${({ theme }) => theme.palette.grey3};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const cardTypeData: TypeData[] = [
  {
    value: 'B&N Membership',
  },
  {
    value: 'Other',
  },
]

interface TypeData {
  value: string
}

interface StateProps {
  atgAccount: AtgAccountModel | undefined
  atgAccountApiStatus: Nullable<RequestStatus>
  formError: FormErrors
}

interface DispatchProps {
  addMembership: (number: string, type: string, id?: string) => void
}

const dispatcher = (dispatch) => ({
  addMembership: (number: string, type: string, id?: string) =>
    dispatch(addMembershipAction(number, type, id)),
})

const selector = createStructuredSelector({
  atgAccount: myAtgAccountSelector,
  error: myAtgErrorSelector,
  atgAccountApiStatus: atgAccountApiRequestStatusSelector,
  formError: formErrorsSelector,
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps

const AddMembershipCard = ({
  atgAccount,
  atgAccountApiStatus,
  addMembership,
  formError,
}: Props) => {
  const [cardNumber, setCardNumber] = useState('')
  const [cardType, setCardType] = useState('')

  useEffect(() => {
    if (isEmpty(formError[DISCOUNTS_FORM])) {
      return pop
    }
  }, [atgAccount?.membership])

  const showSpinner = atgAccountApiStatus === RequestStatus.FETCHING
  const disabled = cardNumber === '' || cardType === '' || showSpinner

  const onMembershipApplyHandler = () => {
    let type: string
    if (cardType === 'B&N Membership') {
      type = 'BNMembership'
    } else {
      type = cardType
    }
    addMembership(cardNumber, type, atgAccount?.atgUserId)
  }

  return (
    <>
      <Container>
        <Select
          overlayStyle={{ width: '80%' }}
          label={cardType ? 'Membership Type' : 'Select Membership Type'}
          data={cardTypeData}
          dropdownMargins={{ min: 17, max: 17 }}
          dropdownPosition={-4.3}
          onChange={setCardType}
          onSubmitEditing={onMembershipApplyHandler}
          useNativeDriver={false}
        />
        <TextField
          placeholder="Membership Number"
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={onMembershipApplyHandler}
          onChange={setCardNumber}
          value={cardNumber}
          formId="CartDiscountForm"
          formFieldId="MembershipCode"
        />
        <MemberCardIcon>
          <ImgCard source={cards.membercard} />
        </MemberCardIcon>
        <FooterContainer>
          <TextInfo>
            By continuing, I agree to the membership terms & conditions.
            Furthermore, I acknowledge that the card number entered above is
            mine and that I am the owner of this Member, B&N Kids' Club™, or
            Educator account.
          </TextInfo>
          <LinkMembershipButton
            variant="contained"
            disabled={disabled}
            showSpinner={showSpinner}
            onPress={onMembershipApplyHandler}
            center
            maxWidth
          >
            Link Membership
          </LinkMembershipButton>
        </FooterContainer>
      </Container>
    </>
  )
}

AddMembershipCard.navigationOptions = () => ({
  headerTitle: 'Add Membership',
})

export default connector(AddMembershipCard)
