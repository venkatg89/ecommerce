import React, { useMemo } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { styles } from 'src/controls/layout/ScrollContainer'
import RelatedQuestionsListItem from './Item'

import { useResponsiveDimensions, CONTENT_VERTICAL_PADDING, CONTENT_HORIZONTAL_PADDING } from 'src/constants/layout'

const Spacing = styled.View`
  height: 18;
`

interface Props {
  questionIds: string[];
  fetching?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
}

const RelatedQuestionsList = ({ questionIds, fetching, onRefresh, onEndReached }: Props) => {
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
      data={ questionIds }
      refreshing={ !!fetching }
      onRefresh={ onRefresh }
      onEndReached={ onEndReached }
      keyExtractor={ (item, index) => `${item}${index}` }
      renderItem={ ({ item }) => (
        <RelatedQuestionsListItem questionId={ item } />
      ) }
      ItemSeparatorComponent={ Spacing }
    />
  )
}

export default RelatedQuestionsList
