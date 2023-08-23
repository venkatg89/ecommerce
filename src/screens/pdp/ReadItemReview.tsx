import React from 'react'
import Header from 'src/controls/navigation/Header'
import styled from 'styled-components/native'
import TimeAgo from 'react-native-timeago'
import { NavigationStackProp } from 'react-navigation-stack'
import RatingStars from 'src/components/Pdp/RatingStars'

const Container = styled.ScrollView`
  background-color: ${({ theme }) => theme.palette.white};
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
`

const HeaderContainer = styled.View`
  margin-top: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const TitleText = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  font-size: 24;
  color: ${({ theme }) => theme.palette.grey1};
  margin-vertical: ${({ theme }) => theme.spacing(2)};
`

const FlexRowContainer = styled.View`
  margin-top: ${({ theme }) => theme.spacing(2)};
  ${({ theme }) => theme.typography.body2};
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const ReviewerText = styled.Text`
  color: ${({ theme }) => theme.palette.grey1};
  flex: 1;
  text-align: left;
`

const TimeText = styled.Text`
  color: ${({ theme }) => theme.palette.grey3};
  align-self: flex-end;
`

const BodyText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  font-size: 14;
  letter-spacing: 0.4;
`

type Props = { navigation: NavigationStackProp }

const ReadItemReview = ({ navigation }: Props) => {
  const title = navigation.getParam('title')
  const rating = navigation.getParam('rating')
  const nickName = navigation.getParam('nickName')
  const text = navigation.getParam('text')
  const time = navigation.getParam('time')

  return (
    <Container>
      <HeaderContainer>
        <TitleText>{title}</TitleText>
        <RatingStars ratingLevel={rating} size={30} isLeft={true} />
        <FlexRowContainer>
          <ReviewerText>{nickName}</ReviewerText>
          <TimeText>
            <TimeAgo time={time} />
          </TimeText>
        </FlexRowContainer>
      </HeaderContainer>
      <BodyText>{text}</BodyText>
    </Container>
  )
}

ReadItemReview.navigationOptions = ({ navigation }) => ({
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default ReadItemReview
