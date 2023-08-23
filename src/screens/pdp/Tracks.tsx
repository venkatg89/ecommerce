import React from 'react'
import Header from 'src/controls/navigation/Header'
import styled from 'styled-components/native'
import { NavigationInjectedProps } from 'react-navigation'

const Container = styled.ScrollView`
  padding-top: ${({ theme }) => theme.spacing(3)};
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
  background-color: ${({ theme }) => theme.palette.white};
`

const TitleText = styled.Text`
  font-size: 24;
  ${({ theme }) => theme.typography.heading3};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const ListItemText = styled.Text`
  font-size: 16;
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

type Props = NavigationInjectedProps

const TracksScreen = ({ navigation }: Props) => {
    const tracks = navigation.getParam('data')


    return (
        <Container>
            <TitleText>Tracks</TitleText>
            {tracks.map((item, index) => {
                return <ListItemText key={index + item}>{(index + 1) + '. ' + item}</ListItemText>
            })}
        </Container>
    )
}
TracksScreen.navigationOptions = ({ navigation }) => ({
    header: (headerProps) => <Header headerProps={headerProps} />,
})

export default TracksScreen
