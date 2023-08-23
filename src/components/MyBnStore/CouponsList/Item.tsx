import React, { useCallback, useContext } from 'react'
import styled from 'styled-components/native'
import moment from 'moment'
import Barcode from 'react-native-barcode-builder'

import Button from 'src/controls/Button'
import { CouponDetailsContext } from 'src/screens/myBN/Coupons'
import { BARCODE_HEIGHT } from 'src/components/MyBnStore/CouponDetailsModal'

import { CouponModel } from 'src/models/StoreModel/CouponModel'

const Container = styled.TouchableOpacity`
  width: 100%;
  align-items: center;
  background-color: ${({ theme }) => theme.palette.white};
  ${({ theme }) => theme.boxShadow.container}
  border-radius: 3;
`

const Overlay = styled.View`
  width: 100%;
  background-color: ${({ theme }) => theme.palette.couponGreen};
  align-items: center;
`

const TitleText = styled.Text`
  margin-top: ${({ theme }) => theme.spacing(3)};
  padding-horizontal: ${({ theme }) => theme.spacing(4)};
  ${({ theme }) => theme.typography.heading2}
  color: ${({ theme }) => theme.palette.grey1};
  text-align: center;
`

const ExpiryText = styled.Text`
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  ${({ theme }) => theme.typography.subTitle2};
  color: ${({ theme }) => theme.palette.grey1};
  text-align: center;
`

const ViewDetailsButton = styled(Button)`
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  padding-vertical: 6;
  background-color: ${({ theme }) => theme.palette.couponGreen};
`

const BottomContainer = styled.View`
  margin: ${({ theme }) => `${theme.spacing(1)}px ${theme.spacing(2)}px`};
  justify-content: center;
`

const AvailabilityText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.palette.grey1};
  text-align: center;
`
const UseText = styled.Text`
  ${({ theme }) => theme.typography.subTitle2};
  color: ${({ theme }) => theme.palette.grey2};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  text-align: center;
`

const CodeText = styled.Text`
  ${({ theme }) => theme.typography.subTitle2};
  color: ${({ theme }) => theme.palette.grey1};
  text-align: center;
  letter-spacing: 11.4;
`

interface Props {
  style?: any;
  coupon: CouponModel;
}

const CouponListItem = ({ style, coupon }: Props) => {
  const { openCouponDetailsModalCallback } = useContext(CouponDetailsContext)

  const getAvailabilityText = useCallback(() => {
    if (coupon.inStore && coupon.online) {
      return 'In store & online'
    } else if (coupon.inStore) { // eslint-disable-line
      return 'In store only'
    } else {
      return 'Online only'
    }
  }, [])

  const openModal = useCallback(() => {
    openCouponDetailsModalCallback(coupon.id)
  }, [])

  const getExpiryText = useCallback(() => (
    moment(coupon.endDate).calendar(undefined, {
      sameDay: '[Expiring Today]',
      nextDay: '[Expires Tomorrow]',
      nextWeek: `[Expires ${moment(coupon.endDate).format('dddd')}]`,
      sameElse: moment().isBefore(coupon.endDate) ? '[Expires] MMMM D' : '[Expired]',
    })
  ), [coupon.endDate])

  return (
    <Container
      style={ style }
      onPress={ openModal }
    >
      <Overlay>
        <TitleText>{ coupon.description }</TitleText>
        <ExpiryText>{ getExpiryText() }</ExpiryText>
        <AvailabilityText>{ getAvailabilityText() }</AvailabilityText>
        <ViewDetailsButton
          onPress={ openModal }
          size="small"
          variant="outlined"
        >
          VIEW DETAILS
        </ViewDetailsButton>
      </Overlay>
      <BottomContainer>
        {coupon.inStore ?
          <Barcode value={ coupon.code } height={ BARCODE_HEIGHT } format="CODE128" />
          : <UseText>Use Code:</UseText>
      }
        <CodeText>{ coupon.code }</CodeText>
      </BottomContainer>
    </Container>
  )
}

export default CouponListItem
