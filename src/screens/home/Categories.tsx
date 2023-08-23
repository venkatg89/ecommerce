import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { NavigationInjectedProps } from 'react-navigation'
import styled from 'styled-components/native'

import ScrollContainer from 'src/controls/layout/ScrollContainer'
import Header from 'src/controls/navigation/Header'
import CategoryList from 'src/components/BrowseCategoryList'

import { BrowseTopNavDetailsModel } from 'src/models/BrowseModel'
import { topNavDetailsSelector } from 'src/redux/selectors/browseSelector'

const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.heading2}
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

interface StateProps {
  topNavDetails: BrowseTopNavDetailsModel[]
}

const selector = createStructuredSelector({
  topNavDetails: topNavDetailsSelector,
})

const connector = connect<StateProps, {}, {}>(selector)

type Props = StateProps & NavigationInjectedProps

const Categories = ({ topNavDetails }: Props) => {
  return (
    <ScrollContainer>
      <HeaderText>Categories</HeaderText>
      <CategoryList categoryList={topNavDetails} />
    </ScrollContainer>
  )
}

Categories.navigationOptions = () => ({
  title: 'Categories',
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default connector(Categories)
