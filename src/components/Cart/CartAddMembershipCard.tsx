import React, { useState, useContext, useEffect } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled, { ThemeContext } from 'styled-components/native'
import { Platform } from 'react-native'

import Button from 'src/controls/Button'
import _TextField from 'src/controls/form/TextField'
import _Select from 'src/controls/form/Select'
import { isEmpty } from 'src/helpers/objectHelpers'

import {
  myAtgAccountSelector,
  myAtgErrorSelector,
} from 'src/redux/selectors/userSelector'
import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'
import { FormErrors } from 'src/models/FormModel'
import { formErrorsSelector } from 'src/redux/selectors/formSelector'
import { DISCOUNTS_FORM } from 'src/constants/formErrors'
import { addMembershipAction } from 'src/redux/actions/cart/discountsAction'
import { atgAccountApiRequestStatusSelector } from 'src/redux/selectors/apiStatus/user'
import { RequestStatus } from 'src/models/ApiStatus'
import { ThemeModel } from 'src/models/ThemeModel'
import DeviceInfo from 'react-native-device-info'
import { Dimensions } from 'react-native'
import { cards } from 'assets/images'
import { icons } from 'assets/images'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const ITEM_WIDTH = DeviceInfo.isTablet() ? SCREEN_WIDTH / 3 : SCREEN_WIDTH / 1.4

const Container = styled.View`
  border-radius: ${({ theme }) => theme.spacing(2)};
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
  flex: 1;
`

const TopLineContainer = styled.View`
  align-items: center;
  justify-content: center;
`

const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const Select = styled(_Select)`
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
  ${Platform.OS === 'ios'
    ? `
  margin-top: auto
  `
    : ''}
`

const ImgCard = styled.Image`
  width: ${ITEM_WIDTH};
`

const TopHeader = styled.Text`
  flex: 1;
  text-align: center;
  padding-left: ${({ theme }) => theme.spacing(3)};
  color: ${({ theme }) => theme.palette.grey1};
`

const LinkMembershipButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing(2)}px;
  text-transform: uppercase;
`

const TopLine = styled.View`
  background-color: ${({ theme }) => theme.palette.grey5};
  width: 29;
  height: 4;
  margin-top: ${({ theme }) => theme.spacing(1)};
`

const IconClose = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
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
    value: 'B&N Kids Club™',
  },
  {
    value: 'Educator',
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

interface OwnProps {
  modalClose: () => void
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

type Props = StateProps & DispatchProps & OwnProps

const CartAddMembershipCard = ({
  atgAccount,
  atgAccountApiStatus,
  addMembership,
  modalClose,
  formError,
}: Props) => {
  const theme = useContext(ThemeContext) as ThemeModel
  const [cardNumber, setCardNumber] = useState('')
  const [cardType, setCardType] = useState('')

  useEffect(() => {
    if (isEmpty(formError[DISCOUNTS_FORM])) {
      return modalClose
    }
  }, [atgAccount?.membership])

  const showSpinner = atgAccountApiStatus === RequestStatus.FETCHING
  const disabled = cardNumber === '' || cardType === '' || showSpinner

  const onMembershipApplyHandler = () => {
    let type: string
    if (cardType === 'B&N Kids Club™') {
      type = 'KidsClub'
    } else if (cardType === 'B&N Membership') {
      type = 'BNMembership'
    } else if (cardType === 'Other') {
      type = 'Employee'
    } else {
      type = cardType
    }
    addMembership(cardNumber, type, atgAccount?.atgUserId)
  }

  const getImage = (type) => {
    switch (type) {
      case 'B&N Membership': {
        return cards.membercard
      }
      case 'B&N Kids Club™': {
        return cards.kidsCard
      }
      case 'Educator': {
        return cards.educatorCard
      }
      case 'Other': {
        return cards.employeeCard
      }
      default: {
        return cards.membercard
      }
    }
  }

  return (
    <>
      <Container>
        <TopLineContainer>
          <TopLine />
        </TopLineContainer>
        <Wrapper>
          <TopHeader style={theme.typography.body1}>Link Membership</TopHeader>
          <Button icon onPress={modalClose}>
            <IconClose source={icons.actionClose} />
          </Button>
        </Wrapper>
        <Select
          overlayStyle={{ width: '80%' }}
          label={cardType ? 'Membership Type' : 'Select Membership Type'}
          data={cardTypeData}
          dropdownMargins={{ min: 17, max: 17 }}
          dropdownPosition={-4.9}
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
          <ImgCard resizeMode="contain" source={getImage(cardType)} />
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

export default connector(CartAddMembershipCard)
