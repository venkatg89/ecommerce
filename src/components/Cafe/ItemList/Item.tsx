import React, { useCallback, memo } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import { icons } from 'assets/images'

import Routes, { Params } from 'src/constants/routes'
import { navigate } from 'src/helpers/navigationService'
import { CafeItem } from 'src/models/CafeModel/ItemsModel'

import { cafeItemSelector } from 'src/redux/selectors/cafeSelector'

const ButtonContainer = styled.TouchableOpacity`
  justify-content: flex-start;
  padding-vertical: ${({ theme }) => theme.spacing(1)};
  flex-direction: row;
`

const DescriptionContainer = styled.View`
  justify-content: flex-start;
  padding-vertical: ${({ theme }) => theme.spacing(2)};
  margin-left: ${({ theme }) => theme.spacing(2)};
  flex-direction: column;
  align-self: center;
`

interface DisabledProps {
  disabled: boolean
}

const Image = styled.Image`
  height: ${({ theme }) => theme.spacing(12)};
  width: ${({ theme }) => theme.spacing(10)};
  background-color: ${({ theme }) => theme.palette.disabledGrey};
`

const View = styled.View`
  height: ${({ theme }) => theme.spacing(10)};
  width: ${({ theme }) => theme.spacing(10)};
  overflow: hidden;
  align-items: center;
  justify-content: flex-start;
  background-color: 'rgba(0, 0, 0, 0.5)';
`

const FadeLayer = styled.View`
  position: absolute;
  height: ${({ theme }) => theme.spacing(10)};
  width: ${({ theme }) => theme.spacing(10)};
  background-color: ${({ theme }) => theme.palette.disabledGrey};
  opacity: 0.5;
`

const ItemText = styled.Text<DisabledProps>`
  color: ${({ theme, disabled }) =>
    disabled ? theme.palette.grey3 : theme.palette.grey1};
  ${({ theme }) => theme.typography.subTitle1};
`

const OutOfStockContainer = styled.View`
  flex-direction: row;
`

const ErrorIcon = styled.Image`
  width: ${({ theme }) => theme.spacing(2)};
  height: ${({ theme }) => theme.spacing(2)};
  tint-color: ${({ theme }) => theme.palette.supportingError};
`

const ErrorText = styled.Text`
  margin-left: ${({ theme }) => theme.spacing(0.5)};
  color: ${({ theme }) => theme.palette.supportingError};
  ${({ theme }) => theme.typography.caption};
`

interface OwnProps {
  // eslint-disable-next-line react/no-unused-prop-types
  itemId: string
  itemType: string
}

interface StateProps {
  item: CafeItem
}

const selector = createStructuredSelector({
  item: (state, ownProps) => {
    const { itemId } = ownProps
    return cafeItemSelector(state, { itemId })
  },
})

const connector = connect<StateProps, {}, OwnProps>(selector)

type Props = StateProps & OwnProps

const _CafeItem = ({ item, itemType }: Props) => {
  const selectItem = useCallback(() => {
    navigate(Routes.CAFE__ITEM_OPTIONS, {
      [Params.CAFE_ITEM_ID]: item.id,
      [Params.CAFE_TYPE]: itemType,
    })
  }, [item])
  return (
    <ButtonContainer disabled={item.outOfStock} onPress={selectItem}>
      <View>
        <Image source={{ uri: item.imageUrl }} />
        {item.outOfStock && <FadeLayer />}
      </View>
      <DescriptionContainer>
        <ItemText disabled={item.outOfStock}>{item.name}</ItemText>
        {(item.outOfStock && (
          <OutOfStockContainer>
            <ErrorIcon source={icons.error} />
            <ErrorText>This item is out of stock.</ErrorText>
          </OutOfStockContainer>
        )) ||
          undefined}
      </DescriptionContainer>
    </ButtonContainer>
  )
}

export default memo(connector(_CafeItem))
