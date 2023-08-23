import React from 'react'
import styled from 'styled-components/native'

import { BrowseTopNavDetailsModel } from 'src/models/BrowseModel'
import { icons } from 'assets/images'
import { push, Routes, Params } from 'src/helpers/navigationService'

const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-vertical: ${({ theme }) => theme.spacing(1)};
  padding-vertical: ${({ theme }) => theme.spacing(1)};
`

const Text = styled.Text`
  flex: 1;
  ${({ theme }) => theme.typography.heading3}
  color: ${({ theme }) => theme.palette.grey1};
`

const Icon = styled.Image`
  height: ${({ theme }) => theme.spacing(3)};
  width: ${({ theme }) => theme.spacing(3)};
`

interface OwnProps {
  category: BrowseTopNavDetailsModel
}

type Props = OwnProps

const BrowseCategoryList = ({ category }: Props) => {
  return (
    <Container onPress={ () => { push(Routes.HOME__BROWSE, { [Params.BROWSE_URL]: category.url }) }}>
      <Text>{ category.name }</Text>
      <Icon source={ icons.arrowRight } />
    </Container>
  )
}

export default BrowseCategoryList
