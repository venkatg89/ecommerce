import React, { useContext } from 'react'
import { connect } from 'react-redux'
import styled, { ThemeContext } from 'styled-components/native'
import { createStructuredSelector } from 'reselect'

import UserIcon from 'src/components/UserIconList/UserIcon'

import _Button from 'src/controls/Button'

import { getMyProfileUidSelector } from 'src/redux/selectors/userSelector'

const Container = styled.View`
  border: ${props => props.theme.palette.disabledGrey};
  border-radius: 4;
  /* background-color: ${props => props.theme.palette.white}; */
  ${({ theme }) => theme.boxShadow.container}
`

const HeaderWrapper = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-left: ${({ theme }) => theme.spacing(2)};
  /* background-color: rgb(233,227,215); */
  height: ${({ theme }) => theme.spacing(8)};
`

const BodyWrapper = styled.View`
  padding:0px ${({ theme }) => theme.spacing(2)}px ${({ theme }) => theme.spacing(3)}px ${({ theme }) => theme.spacing(2)}px;
`

const EventTitle = styled.Text`
  text-align: center;
  color: ${({ theme }) => theme.palette.grey1};
  padding-top: ${({ theme }) => theme.spacing(4)}px;
  ${({ theme }) => theme.typography.heading2};
`

const EventHost = styled.Text`
  text-align: center;
  color: ${({ theme }) => theme.palette.grey2};
  padding-top: ${({ theme }) => theme.spacing(2)}px;
  ${({ theme }) => theme.typography.body1};
`

const EventDate = styled.Text`
  text-align: center;
  color: ${({ theme }) => theme.palette.grey1};
  padding-top: ${({ theme }) => theme.spacing(3)}px;
  ${({ theme }) => theme.typography.subTitle1};
`

const ButtonContainer = styled.View`
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing(3)};
`

const Button = styled(_Button)`
  padding: ${({ theme }) => theme.spacing(1)}px;
`

const Row = styled.View`
flex-direction:row;
`
const Column = styled.View`
  flex:1;
  flex-direction:column;
  padding-left: ${({ theme }) => theme.spacing(2)};
`
const Username = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color:${({ theme }) => theme.palette.grey1};
`
const EventType = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color:${({ theme }) => theme.palette.grey2};
`
const Date = styled.Text`
  ${({ theme }) => theme.typography.caption};
  color:${({ theme }) => theme.palette.grey2};`

interface OwnProps {
}

interface StateProps {
  userProfileId: string | undefined
}

const selector = createStructuredSelector({
  userProfileId: getMyProfileUidSelector,
})

const connector = connect<StateProps, {}, OwnProps>(selector)

type Props = OwnProps & StateProps

const HostingEventNotificationItem = ({ userProfileId }: Props) => {
  const { palette } = useContext(ThemeContext)
  return (
    <Container>
      <HeaderWrapper>
        <UserIcon userId={ userProfileId || '' } />
        <Column>
          <Row>
            <Username>
              B&N Union Square
              {' '}
            </Username>
            <EventType>is hosting an event.</EventType>
          </Row>
          <Date>Thursday, May 9 at 11:07am</Date>
        </Column>
      </HeaderWrapper>
      <BodyWrapper>
        <EventTitle>B&N NY Teen Author Festival</EventTitle>
        <EventHost>David Leviathan</EventHost>
        <EventDate>May 15, 2019 | B&N Union Square</EventDate>
        <ButtonContainer>
          <Button onPress={ () => {} } textStyle={ { color: palette.linkGreen } }>
          Get all the details
          </Button>
        </ButtonContainer>
      </BodyWrapper>
    </Container>
  )
}

export default connector(HostingEventNotificationItem)
