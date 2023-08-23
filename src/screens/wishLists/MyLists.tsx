import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import Container from 'src/controls/layout/ScreenContainer'
import WishLists from 'src/components/WishLists'
import Button from 'src/controls/Button'
import Header from 'src/controls/navigation/Header'
import ScrollContainer from 'src/controls/layout/ScrollContainer'
import CreateNewListModal from 'src/components/Modals/CreateNewList'

import { getWishListsAction } from 'src/redux/actions/wishList/wishListAction'
import { wishListIdsSelector } from 'src/redux/selectors/wishListSelector'
import countLabelText from 'src/helpers/countLabelText'

const HeaderContainer = styled.View`
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-horizontal: ${({ theme }) => theme.spacing(2)};
`

const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.heading2}
`

const CountText = styled.Text`
  margin-top: ${({ theme }) => theme.spacing(1)};
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey2};
`

interface StateProps {
  wishListIds: string[]
}

const selector = createStructuredSelector({
  wishListIds: wishListIdsSelector,
})

interface DispatchProps {
  getWishLists: () => void
}
const dispatcher = dispatch => ({
  getWishLists: () => dispatch(getWishListsAction()),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps

const MyLists = ({ getWishLists, wishListIds }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  useEffect(() => {
    getWishLists()
  }, [])

  return (
    <Container>
      <HeaderContainer>
        <HeaderText>My Lists</HeaderText>
        <CountText>{ countLabelText(wishListIds.length, 'list', 'lists') }</CountText>
      </HeaderContainer>
      <ScrollContainer withAnchor>
        <WishLists listIds={ wishListIds } />
      </ScrollContainer>
      <Button
        onPress={ () => { setIsModalOpen(true) } }
        variant="contained"
        isAnchor
      >
        Create a new list
      </Button>
      <CreateNewListModal
        isOpen={ isModalOpen }
        onDismiss={ () => { setIsModalOpen(false) } }
      />
    </Container>
  )
}

MyLists.navigationOptions = ({ navigation }) => ({
  title: 'My Lists',
  header: headerProps => (
    <Header headerProps={ headerProps } />
  ),
})

export default connector(MyLists)
