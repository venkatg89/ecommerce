import React from 'react'
import { FlatList, Platform, StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import LoadingIndicator from 'src/controls/progress/LoadingIndicator'
import CategoryItem from './Item'

const Spacing = styled.View`
  height: ${({ theme }) => theme.spacing(2)};
`

interface Props {
  categoryIds: string[];
  fetching?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

const CategoryList = ({ categoryIds, fetching, onRefresh, onEndReached, style, contentContainerStyle }: Props) => {
  const refreshing = Platform.select({ ios: categoryIds.length > 0 && !!fetching, android: !!fetching })
  return (
    <FlatList
      style={ style }
      contentContainerStyle={ contentContainerStyle }
      data={ categoryIds }
      refreshing={ refreshing }
      onRefresh={ onRefresh }
      onEndReached={ onEndReached }
      keyExtractor={ item => item }
      ListFooterComponent={ (
        <>
          {Platform.OS === 'ios' && <LoadingIndicator isLoading={ !!fetching } />}
        </>
      ) }
      renderItem={ ({ item }) => (
        <CategoryItem categoryId={ item } />
      ) }
      ItemSeparatorComponent={ Spacing }
    />
  )
}

export default CategoryList
