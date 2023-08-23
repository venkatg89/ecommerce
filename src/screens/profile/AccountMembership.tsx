import React, { useState } from 'react'
import styled from 'styled-components/native'
import { connect } from 'react-redux'

import { Platform } from 'react-native'
import Header from 'src/controls/navigation/Header'
import Button from 'src/controls/Button'
import _Modal from 'react-native-modal'
import { createStructuredSelector } from 'reselect'

import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'
import {
  myAtgAccountSelector,
  myAtgApiStatusSelector,
} from 'src/redux/selectors/userSelector'
import { RequestStatus } from 'src/models/ApiStatus'
import CartAddMembershipCard from 'src/components/Cart/CartAddMembershipCard'
import MembershipItem from '../../components/Profile/AccountMembership/MembershipItem'
import Images from 'assets/images'

const Container = styled.ScrollView`
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
`

const TitleText = styled.Text`
  ${({ theme }) => theme.typography.heading2}
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-left: ${({ theme }) => theme.spacing(1)};
`

const LinkMembershipButton = styled(Button)`
  text-transform: uppercase;
`

const Modal = styled(_Modal)`
  background-color: white;
  margin-horizontal: 0;
  margin-bottom: 0;
  ${Platform.OS === 'android'
    ? `
      margin-top: 15%
    `
    : 'margin-top: 25%'}

  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  padding-bottom: ${({ theme }) => theme.spacing(4)};
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
interface StateProps {
  atgAccount?: AtgAccountModel
  atgApiStatus: Nullable<RequestStatus>
}

const selector = createStructuredSelector({
  atgAccount: myAtgAccountSelector,
  atgApiStatus: myAtgApiStatusSelector,
})

interface DispatchProps {}

const dispatcher = (dispatch) => ({})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps

const AccountMembership = ({ atgAccount, atgApiStatus }: Props) => {
  const [modalIsVisible, setModalIsVisible] = useState(false)

  const modalCloseHandler = () => {
    setModalIsVisible(!modalIsVisible)
  }

  const usingMemberships =
    atgAccount?.membership?.bnMembership ||
    atgAccount?.membership?.educator ||
    atgAccount?.membership?.employee ||
    atgAccount?.membership?.kidsClub

  return (
    <>
      <Container>
        <Modal
          animationType="fade"
          isVisible={modalIsVisible}
          backdropOpacity={0.4}
          useNativeDriver={false}
          swipeDirection={['down']}
          onSwipeComplete={modalCloseHandler}
          onBackdropPress={modalCloseHandler}
        >
          <CartAddMembershipCard modalClose={modalCloseHandler} />
        </Modal>
        <TitleText>Memberships</TitleText>
        {atgAccount?.membership && <MembershipItem showAll={true} />}
        {!usingMemberships && (
          <Content>
            <EmptyImage source={Images.emptyInfo} />
            <DescriptionText>No Linked Memberships</DescriptionText>
            <DetailsText>
              Visit the B&N website or a store to enroll in Membership.
            </DetailsText>
          </Content>
        )}
      </Container>
      <LinkMembershipButton
        variant="contained"
        onPress={() => {
          setModalIsVisible(!modalIsVisible)
        }}
        center
        maxWidth
        isAnchor
      >
        + Link Membership
      </LinkMembershipButton>
    </>
  )
}

AccountMembership.navigationOptions = ({ navigation }) => ({
  title: 'Gift Cards',
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default connector(AccountMembership)
