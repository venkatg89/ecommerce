import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import BookImage from 'src/components/BookImage'

import { wishListSelector } from 'src/redux/selectors/wishListSelector'
import countLabelText from 'src/helpers/countLabelText'
import { icons } from 'assets/images'
import { WishListModel } from 'src/models/WishListModel'
import { push, Routes, Params } from 'src/helpers/navigationService'

const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-vertical: ${({ theme }) => theme.spacing(1)};
`

const TextContainer = styled.View`
  flex: 1;
  margin-left: ${({ theme }) => theme.spacing(1)};
`

const NameText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1}
`

const CountText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey2};
`

const Icon = styled.Image`
  height: ${({ theme }) => theme.spacing(2)};
  width: ${({ theme }) => theme.spacing(2)};
  margin-right: ${({ theme }) => theme.spacing(0.5)};
`

interface OwnProps {
  id: string
}

interface StateProps {
  wishList: WishListModel
}

const selector = createStructuredSelector({
  wishList: wishListSelector,
})

const connector = connect<StateProps, {}, OwnProps>(selector)

type Props = OwnProps & StateProps

const WishListItem = ({ id, wishList }: Props) => {
  if (!wishList) { return null }

  return (
    <Container onPress={ () => { push(Routes.WISHLIST__DETAILS, { [Params.WISHLIST_ID]: wishList.id }) } }>
      <BookImage bookOrEan={ wishList.items[0] && wishList.items[0].ean } />
      <TextContainer>
        <NameText>{ wishList.name }</NameText>
        <CountText>{ countLabelText(wishList.items.length, 'item', 'items') }</CountText>
      </TextContainer>
      { !wishList.isPublic && (
        <Icon source={ icons.lockClosed } />
      ) }
    </Container>
  )
}

export default connector(WishListItem)
