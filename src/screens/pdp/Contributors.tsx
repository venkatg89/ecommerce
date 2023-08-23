import React from 'react'
import Header from 'src/controls/navigation/Header'
import styled from 'styled-components/native'
import { NavigationInjectedProps } from 'react-navigation'
import { ScrollView, SectionList } from 'react-native'
import { navigate, push, Routes, Params } from 'src/helpers/navigationService'

const ScreenContainer = styled.View`
  padding-top: ${({ theme }) => theme.spacing(3)};
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
  background-color: ${({ theme }) => theme.palette.white};
  flex: 1;
`
const Container = styled.ScrollView`
  padding-top: ${({ theme }) => theme.spacing(3)};
`

const TitleText = styled.Text`
  font-size: 24;
  ${({ theme }) => theme.typography.heading3};
  color: ${({ theme }) => theme.palette.grey1};
`

const SectionTitle = styled.Text`
  font-size: 18;
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(3)};
`

const ItemRow = styled.View`
  flex-direction: row;
`

//person names should lead to an author page(if they have one) or just to a search page filtered by the name
//to do: add functionality after author part is implemented
const TouchableItem = styled.TouchableOpacity`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const ListItemText = styled.Text`
  font-size: 16;
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme, green }) =>
    green ? theme.palette.linkGreen : theme.palette.grey1};
`

type Props = NavigationInjectedProps

const ContributorsScreen = ({ navigation }: Props) => {
  const contributors = navigation.getParam('data')
  const title = navigation.getParam('title')

  return (
    <ScreenContainer>
      {title === 'Album Credits' ? (
        <ScrollView>
          <TitleText>{title}</TitleText>
          <Container>
            {contributors.map((item) => {
              // person names should lead to an author page(if they have one) or just to a search page  filtered by the name
              // to do: add functionality after author part is implemented
              return (
                <ItemRow key={item}>
                  <TouchableItem>
                    <ListItemText green>{item.name + '  '}</ListItemText>
                  </TouchableItem>
                  <ListItemText>{item.role}</ListItemText>
                </ItemRow>
              )
            })}
          </Container>
        </ScrollView>
      ) : (
        <>
          <TitleText>{title}</TitleText>
          <SectionList
            sections={contributors}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => (
              <TouchableItem
                key={item}
                onPress={() => {
                  if (item.url?.substring(0, 2) === '/b') {
                    navigate(Routes.PDP__AUTHOR_DETAILS, {
                      [Params.AUTHOR_DETAILS]: item,
                    })
                  } else {
                    navigation.setParams({ _authorName: item.name })
                    push(Routes.PDP__AUTHOR_SEARCH_RESULTS, {
                      [Params.AUTHOR_NAME]: item.name,
                    })
                  }
                }}
              >
                <ListItemText green>{item.name}</ListItemText>
              </TouchableItem>
            )}
            renderSectionHeader={({ section: { title } }) => (
              <SectionTitle key={title}>{title + ':'}</SectionTitle>
            )}
          />
        </>
      )}
    </ScreenContainer>
  )
}
ContributorsScreen.navigationOptions = ({ navigation }) => ({
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default ContributorsScreen
