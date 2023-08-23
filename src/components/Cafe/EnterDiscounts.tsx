import React, { useState, useEffect, useContext } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import { icons } from 'assets/images'

import Button from 'src/controls/Button'
import TextField from 'src/controls/form/TextField'
import { CafeCheckoutVerifyPhoneContext } from 'src/screens/cafe/Checkout'

import { push, Routes } from 'src/helpers/navigationService'
import { CartSummary } from 'src/models/CafeModel/CartModel'
import { BnMembershipModelRecord } from 'src/models/UserModel/MembershipModel'
import { CafeProfileModel } from 'src/models/CafeModel/ProfileModel'

import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'
import { myAtgAccountSelector } from 'src/redux/selectors/userSelector'
import { setMembershipNumberAction } from 'src/redux/actions/cafe/profile'
import {
  addPromoCodeAction,
  removePromoCodeAction,
} from 'src/redux/actions/cafe/discountsAction'
import { bnMembershipSelector } from 'src/redux/selectors/myBn/membershipSelector'
import { cafeCartSelector } from 'src/redux/selectors/cafeSelector'
import SliderMembership from '../Cart/SliderMembership'

const Container = styled.View``

const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.button.small}
  color: ${({ theme }) => theme.palette.linkGreen};
  text-transform: uppercase;
`

const HeaderContainer = styled.TouchableOpacity`
  padding-top: ${({ theme }) => theme.spacing(1)};
  padding-bottom: ${({ theme }) => theme.spacing(4)};
`

const LinkMembershipButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing(2)}px;
  text-transform: uppercase;
`

const Spacer = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const FlexRow = styled.View`
  flex-direction: row;
`

const TextFieldWrapper = styled.View`
  flex: 1;
`

const ButtonWrapper = styled.View`
  align-self: flex-start;
`

const ApplyButton = styled(Button)`
  min-width: ${({ theme }) => theme.spacing(12)};
  margin-left: ${({ theme }) => theme.spacing(2)};
  height: ${({ theme }) => theme.spacing(7)};
`

const AppliedPromoCodeButton = styled.TouchableOpacity`
  margin-top: ${({ theme }) => theme.spacing(2)}px;
  padding: ${({ theme }) => theme.spacing(1)}px;
  background-color: ${({ theme }) => theme.palette.tan};
  ${({ theme }) => theme.typography.body1};
  border-radius: ${({ theme }) => theme.spacing(0.5)};
  justify-content: center;
  align-items: center;
  align-self: flex-start;
  flex-direction: row;
`

const AppliedPromoCodeText = styled.Text`
  padding-left: 5px;
  color: ${({ theme }) => theme.palette.grey2};
`

const DeleteIcon = styled.Image`
  height: ${({ theme }) => theme.spacing(3)};
  width: ${({ theme }) => theme.spacing(3)};
  align-items: center;
  align-self: flex-start;
`

interface OwnProps {
  style?: any
  cafeProfile: CafeProfileModel | undefined
}

interface StateProps {
  cart: CartSummary
  bnMembership: Nullable<BnMembershipModelRecord>
  atgAccount: AtgAccountModel | undefined
}

const selector = createStructuredSelector({
  cart: cafeCartSelector,
  bnMembership: bnMembershipSelector,
  atgAccount: myAtgAccountSelector,
})

interface DispatchProps {
  addPromoCode: (promoCode: string) => void
  removePromoCode: () => void
  setMembershipNumber: (params) => boolean
}

const dispatcher = (dispatch) => ({
  addPromoCode: (promoCode) => dispatch(addPromoCodeAction(promoCode)),
  removePromoCode: () => dispatch(removePromoCodeAction()),
  setMembershipNumber: (params) => dispatch(setMembershipNumberAction(params)),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(
  selector,
  dispatcher,
)

type Props = StateProps & DispatchProps & OwnProps

const EnterDiscounts = ({
  style,
  cart,
  bnMembership,
  addPromoCode,
  atgAccount,
  removePromoCode,
  cafeProfile,
  setMembershipNumber,
}: Props) => {
  const [promoCode, editPromoCode] = useState<string>('')
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>('')
  const [showPromoCode, editShowPromoCode] = useState<boolean>(false)
  const membershipDiscount = cafeProfile?.isBnMembershipVerified && cafeProfile?.phoneNumber
  const { getCafeProfile } = useContext(CafeCheckoutVerifyPhoneContext)
  const [isMembershipLoading, setIsMembershipLoading] = useState<boolean>(false)

  useEffect(() => {
    const _promoCode = (cart.promoCode && cart.promoCode.code) || ''
    if (_promoCode) {
      setAppliedPromoCode(_promoCode)
      editShowPromoCode(true)
      editPromoCode('')
    } else {
      setAppliedPromoCode('')
    }
  }, [cart.promoCode])

  const usingPromoCode = cart.promoCode && !!cart.promoCode.code

  const addBnMembership = async () => {
    if (bnMembership) {
      setIsMembershipLoading(true)
      const success = await setMembershipNumber({ bnMembershipNumber: bnMembership.memberId, phoneNumber: cafeProfile?.phoneNumber || 0 })
      if (success) {
        await getCafeProfile()
      }
      setIsMembershipLoading(false)
    } else {
      push(Routes.MY_BN__ADD_MEMBERSHIP)
    }
  }

  return (
    <Container style={style}>
      <HeaderContainer
        onPress={() => {
          editShowPromoCode(!showPromoCode)
        }}
      >
        <HeaderText>{`${
          showPromoCode ? '-' : '+'
        } Add coupon code`}</HeaderText>
      </HeaderContainer>
      {showPromoCode && (
        <>
          <FlexRow>
            <TextFieldWrapper>
              <TextField
                onChange={editPromoCode}
                onSubmitEditing={() => {
                  addPromoCode(promoCode)
                }}
                label="Promo Code"
                disabled={usingPromoCode}
                value={promoCode}
                formId="CafeDiscountForm"
                formFieldId="PromotionCode"
              />
            </TextFieldWrapper>
            <ButtonWrapper>
              <ApplyButton
                onPress={() => {
                  addPromoCode(promoCode)
                }}
                variant={usingPromoCode ? 'contained' : 'outlined'}
                disabled={usingPromoCode}
                textStyle={{ textTransform: 'uppercase' }}
                linkGreen={!usingPromoCode}
                center
              >
                {usingPromoCode ? 'Applied' : 'Apply'}
              </ApplyButton>
            </ButtonWrapper>
            <Spacer />
          </FlexRow>
          {!!appliedPromoCode && (
            <AppliedPromoCodeButton
              onPress={() => {
                removePromoCode()
              }}
            >
              <AppliedPromoCodeText>{appliedPromoCode}</AppliedPromoCodeText>
              <DeleteIcon source={icons.delete} />
            </AppliedPromoCodeButton>
          )}
        </>
      )}
      {showPromoCode && <Spacer />}
      { membershipDiscount ? (
        <SliderMembership showAll={ false } cafeMembershipId={ cafeProfile?.bnMembershipNumber } />
      ) : (
        <LinkMembershipButton
          variant="outlined"
          center
          maxWidth
          linkGreen
          onPress={ addBnMembership }
          showSpinner={ isMembershipLoading }
        >
          { `+ Link Membership${bnMembership ? ` (*${bnMembership.memberId.slice(-4)})` : ''}` }
        </LinkMembershipButton>
      ) }
    </Container>
  )
}

export default connector(EnterDiscounts)
