import React from 'react'
import styled from 'styled-components/native'
import { NavigationStackProp } from 'react-navigation-stack'

import Header from 'src/controls/navigation/Header'
import Container from 'src/controls/layout/ScreenContainer'
import SearchResultsWithFilter from 'src/components/Search/ResultsWithFilter'
import { Params } from 'src/helpers/navigationService'

const TitleText = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
  padding-vertical: ${({ theme }) => theme.spacing(3)};
`

interface StateProps {}

type Props = StateProps & {
  navigation: NavigationStackProp
}

const AuthorSearchResults = ({ navigation }: Props) => {
  const authorName = navigation.getParam(Params.AUTHOR_NAME)

  return (
    <Container>
      <TitleText>{authorName}</TitleText>
      <SearchResultsWithFilter
        searchTerm={`"${authorName}"`}
        sortTerm="Best Sellers"
        searchMode="mode matchall"
      />
    </Container>
  )
}
AuthorSearchResults.navigationOptions = () => ({
  title: 'Search',
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default AuthorSearchResults
