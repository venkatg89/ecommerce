import React from 'react'
import { FlatList, Platform, StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import LoadingIndicator from 'src/controls/progress/LoadingIndicator'
import AnswerItem from './Item'

const Spacing = styled.View`
  height: ${({ theme }) => theme.spacing(2)};
`

interface OwnProps {
  answerIds: string[];
  fetching?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

type Props = OwnProps

const AnswersList = ({ style, contentContainerStyle, answerIds, fetching, onRefresh, onEndReached }: Props) => {
  const refreshing = Platform.select({ ios: answerIds.length > 0 && !!fetching, android: !!fetching })
  return (
    <FlatList
      style={ style }
      contentContainerStyle={ contentContainerStyle }
      data={ answerIds }
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
        <AnswerItem answerId={ item } />
      ) }
      ItemSeparatorComponent={ Spacing }
    />
  )
}

export default AnswersList
