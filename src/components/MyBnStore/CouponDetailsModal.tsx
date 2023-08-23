import React, { useCallback } from 'react'
import { Clipboard } from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'
import moment from 'moment'
import Barcode from 'react-native-barcode-builder'

import Button from 'src/controls/Button'
import DraggableModal from 'src/controls/Modal/BottomDraggable'

import { CouponModel } from 'src/models/StoreModel/CouponModel'

import { couponSelector } from 'src/redux/selectors/myBn/couponSelector'

export const BARCODE_HEIGHT = 60
export const LINE_HEIGHT = 16

const Content = styled.View`
  min-height: 100%;
  flex-direction: column;
  margin-top: ${({ theme }) => theme.spacing(5)};
`

const Column = styled.View`
  align-items: center;
  padding-bottom: ${({ theme }) => theme.spacing(8)};
`

const BarcodeContainer = styled.View`
  margin-horizontal: ${({ theme }) => theme.spacing(4)};
  min-height: ${BARCODE_HEIGHT + 20/* the library explicity sets padding */};
  justify-content: flex-end;
`

const TitleText = styled.Text`
  ${({ theme }) => theme.typography.heading2}
  color: ${({ theme }) => theme.palette.grey1};
  text-align: center;
`

const ExpiryText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey1};
  margin-top: ${({ theme }) => theme.spacing(1)};
  text-align: center;
`

const UseText = styled.Text`
  ${({ theme }) => theme.typography.subTitle2}
  color: ${({ theme }) => theme.palette.grey2};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const BarcodeText = styled.Text`
  ${({ theme }) => theme.typography.subTitle2}
  color: ${({ theme }) => theme.palette.grey1};
  letter-spacing: 11.4;
`

const CopyButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing(3)};
`

const AvailabilityText = styled.Text`
  ${({ theme }) => theme.typography.subTitle2}
  color: ${({ theme }) => theme.palette.grey2};
  align-self: flex-start;
`

const DescriptionContainer = styled.View`
`

const DescriptionText = styled.Text`
  margin-top: ${({ theme }) => theme.spacing(2)};
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey3};
  line-height: ${LINE_HEIGHT};
`

const MoreButton = styled(Button)`
`

interface OwnProps {
  // eslint-disable-next-line react/no-unused-prop-types
  couponId: string;
  isOpen: boolean;
  onDismiss: () => void;
}

interface StateProps {
  coupon: CouponModel;
}

const selector = createStructuredSelector({
  coupon: (state, ownProps) => {
    const { couponId } = ownProps
    return couponSelector(state, { id: couponId })
  },
})

// TODO will need to fetch when we deep link coupons
// interface DispatchProps {
//   fetchCoupon: (couponId: string) => void;
// }
//
// const dispatcher = dispatch => ({
//   fetchCoupon: fetchCoupon
// })

const connector = connect<StateProps, {}, OwnProps>(selector)

type Props = StateProps & OwnProps

const CouponDetailsModal = ({ coupon, isOpen, onDismiss }: Props) => {
  if (!coupon) { return null }

  const getExpiryText = useCallback(() => (
    moment(coupon.endDate).calendar(undefined, {
      sameDay: '[Expiring Today]',
      nextDay: '[Expires Tomorrow]',
      nextWeek: `[Expires ${moment(coupon.endDate).format('dddd')}]`,
      sameElse: moment().isBefore(coupon.endDate) ? '[Expires] MMMM D' : '[Expired]',
    })
  ), [coupon.endDate])

  const getAvailabilityText = useCallback(() => {
    if (coupon.inStore && coupon.online) {
      return 'Valid in store & online.'
    } else if (coupon.inStore) { // eslint-disable-line
      return 'Valid in store only.'
    } else {
      return 'Valid online only.'
    }
  }, [])

  const setClipboard = useCallback(() => {
    Clipboard.setString(coupon.code)
  }, [coupon.code])

  const handleSeeMore = useCallback(() => {}, [])

  return (
    <DraggableModal
      isOpen={ isOpen }
      onDismiss={ onDismiss }
      fullContent
    >
      <Content>
        <Column>
          <TitleText>{ coupon.description }</TitleText>
          <ExpiryText>{ getExpiryText() }</ExpiryText>
          <BarcodeContainer>
            { coupon.inStore
              ? <Barcode value={ coupon.code } height={ BARCODE_HEIGHT } format="CODE128" />
              : <UseText>Use Code:</UseText>
            }
          </BarcodeContainer>
          <BarcodeText>{ coupon.code }</BarcodeText>
          { coupon.online && (
            <CopyButton
              size="small"
              variant="outlined"
              onPress={ setClipboard }
              linkGreen
            >
              COPY CODE
            </CopyButton>
          ) || undefined }
        </Column>
        <Column>
          <AvailabilityText>{ getAvailabilityText() }</AvailabilityText>
          <DescriptionContainer>
            <DescriptionText numberOfLines={ 7 }>
              Lorem ipsum sollicitudin condimentum arcu Vestibulum arcu. In id vehicula. Faucibus euismod. Mauris arcu pellentesque.
              Sapien tortor auctor Cras iaculis elit a felis faucibus consequat In at porttitor ligula. Ut litora vitae Cras imperdiet id imperdiet accumsan erat.
              Lacus lobortis massa velit ornare. Sed rutrum, at mi Praesent id Mauris a …
            </DescriptionText>
            <MoreButton onPress={ handleSeeMore } linkGreen>
              SEE MORE
            </MoreButton>
          </DescriptionContainer>
        </Column>
      </Content>
    </DraggableModal>
  )
}

export default connector(CouponDetailsModal)
