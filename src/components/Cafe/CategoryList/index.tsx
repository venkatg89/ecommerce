import React, { useMemo } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { styles } from 'src/controls/layout/ScrollContainer'
import { useResponsiveDimensions, CONTENT_HORIZONTAL_PADDING, CONTENT_VERTICAL_PADDING } from 'src/constants/layout'
import CafeCategoryItem from './Item'

const Spacing = styled.View`
  height: 16;
`

interface OwnProps {
  categoryIds: string[];
}

type Props = OwnProps

const CafeCategoryList = ({ categoryIds }: Props) => {
  const { width } = useResponsiveDimensions()
  const contentContainerStyle = useMemo(() => ({
    flexGrow: 1,
    paddingVertical: CONTENT_VERTICAL_PADDING,
    paddingHorizontal: CONTENT_HORIZONTAL_PADDING(width),
  }), [width])
  return (
    <FlatList
      style={ styles.container }
      contentContainerStyle={ contentContainerStyle }
      data={ categoryIds }
      keyExtractor={ item => item }
      renderItem={ ({ item }) => (
        <CafeCategoryItem categoryId={ item } />
      ) }
      ItemSeparatorComponent={ Spacing }
    />
  )
}

export default CafeCategoryList
