import React from 'react'
import styled from 'styled-components/native'

import Category from './Item'

import { BrowseTopNavDetailsModel } from 'src/models/BrowseModel'

const ScrollView = styled.ScrollView``

const Divider = styled.View`
  height: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.palette.grey5};
`

interface OwnProps {
  style?: any
  categoryList: BrowseTopNavDetailsModel[]
}

type Props = OwnProps

const BrowseCategoryList = ({ style, categoryList }: Props) => {
  return (
    <ScrollView style={ style }>
      { categoryList.map((category, index) => (<>
        { !!index && <Divider />}
        <Category
          key={ category.url }
          category={ category }
        />
      </>))}
    </ScrollView>
  )
}

export default BrowseCategoryList
