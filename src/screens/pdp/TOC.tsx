import React from 'react'
import styled from 'styled-components/native'
import { NavigationStackProp } from 'react-navigation-stack'
import Header from 'src/controls/navigation/Header'

const Container = styled.ScrollView`
  background-color: ${({ theme }) => theme.palette.white};
  flex: 1;
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
`

const TitleText = styled.Text`
  ${({ theme }) => theme.typography.heading3};
  font-size: 24;
  color: ${({ theme }) => theme.palette.grey1};
  margin-vertical: ${({ theme }) => theme.spacing(2)};
`

const ContentText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  font-size: 16;
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: 88;
`

type Props = { navigation: NavigationStackProp }

const TOCScreen = ({ navigation }: Props) => {
  const tableOfContents = navigation.getParam('data')

  return (
    <Container>
      <TitleText>Table of Contents</TitleText>
      <ContentText>{tableOfContents}</ContentText>
    </Container>
  )
}

TOCScreen.navigationOptions = ({ navigation }) => ({
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default TOCScreen
