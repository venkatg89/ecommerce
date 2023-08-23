import React from 'react'
import { NavigationInjectedProps } from 'react-navigation'
import styled from 'styled-components/native'

import _Container from 'src/controls/layout/ScreenContainer'
import Header from 'src/controls/navigation/Header'
import { Params } from 'src/helpers/navigationService'

import BrowseResultsWithFilter from 'src/components/BrowseCategoryList/BrowseResultsWithFilter'
import { urlBrowseHelper } from 'src/endpoints/atgGateway/browse'

const Container = styled(_Container)`
  background-color: ${({ theme }) => theme.palette.white};
`
type Props = NavigationInjectedProps

const Browse = ({ navigation }: Props) => {
  const browseUrl = navigation.getParam(Params.BROWSE_URL)

  return (
    <Container>
      <BrowseResultsWithFilter
        browseUrl={urlBrowseHelper(browseUrl)}
        withTitle={true}
      />
    </Container>
  )
}

Browse.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('_browseTitle', ''),
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default Browse
