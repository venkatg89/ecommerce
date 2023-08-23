import React from 'react'
import { FlatList, Platform, StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import RecommendationQuestionsListItem from './Item'
import LoadingIndicator from 'src/controls/progress/LoadingIndicator'

const Spacing = styled.View`
  height: ${({ theme }) => theme.spacing(2)};
`
interface Props {
  questionIds: string[];
  fetching?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

const QuestionsList = ({ style, contentContainerStyle, questionIds, fetching, onRefresh, onEndReached }: Props) => {
  // with Flatlist refreshing, andorid always show two Loading indicator on top an bottom when Flatlist reached end
  // to prevent double LoadingIndicator in Android only IOS has footer indicator
  const refreshing = Platform.select({ ios: questionIds.length > 0 && !!fetching, android: !!fetching })
  return (
    <FlatList
      style={ style }
      contentContainerStyle={ contentContainerStyle }
      data={ questionIds }
      refreshing={ refreshing }
      onRefresh={ onRefresh }
      onEndReached={ onEndReached }
      keyExtractor={ (item, index) => `${item}${index}` }
      renderItem={ ({ item }) => (
        <RecommendationQuestionsListItem questionId={ item } />
      ) }
      ListFooterComponent={ (
        <>
          {Platform.OS === 'ios' &&
          <LoadingIndicator isLoading={ !!fetching } />
        }
        </>
      ) }
      ItemSeparatorComponent={ Spacing }
    />
  )
}

export default QuestionsList
