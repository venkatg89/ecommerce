import React from 'react'
import Header from 'src/controls/navigation/Header'
import BooksellerComponent from 'src/components/Pdp/BooksellerComponent'
import styled from 'styled-components/native'
import { NavigationStackProp } from 'react-navigation-stack'
import { VIEW_OVERVIEW } from 'src/components/Pdp/OverviewComponent'

const Container = styled.ScrollView`
  background-color: ${({ theme }) => theme.palette.white};
  flex: 1;
  padding-horizontal: 16;
`

const TitleText = styled.Text`
  ${({ theme }) => theme.typography.heading3};
  font-size: 24;
  color: ${({ theme }) => theme.palette.grey1};
  margin-vertical: ${({ theme }) => theme.spacing(2)};
`
const Separator = styled.View`
  background-color: ${({ theme }) => theme.palette.grey3};
  height: 0.5;
  margin-vertical: ${({ theme }) => theme.spacing(3)};
`

const ContentText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  font-size: 16;
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: 88;
`

type Props = { navigation: NavigationStackProp }

const OverviewScreen = ({ navigation }: Props) => {
  const booksellerContent = navigation.getParam('booksellerContent')
  const overviewText = navigation.getParam('overviewText')
  const contentType = navigation.getParam('contentType')

  return (
    <Container>
      <TitleText>
        {contentType === VIEW_OVERVIEW ? 'Overview' : 'Editorial Reviews'}
      </TitleText>
      {booksellerContent && (
        <>
          <BooksellerComponent
            contentType={contentType}
            booksellerContent={booksellerContent}
          />
          <Separator />
        </>
      )}

      <ContentText>{overviewText}</ContentText>
    </Container>
  )
}

OverviewScreen.navigationOptions = ({ navigation }) => ({
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default OverviewScreen
