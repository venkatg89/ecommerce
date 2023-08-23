import React, { Fragment } from 'react'
import { FlatList, Platform, StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import LoadingIndicator from 'src/controls/progress/LoadingIndicator'
import MembersListItem from './Item'

const Spacing = styled.View`
  height: ${({ theme }) => theme.spacing(2)};
`

interface Props {
  memberIds: string[];
  fetching?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  header?: React.ReactNode
}

const MembersList = ({ style, contentContainerStyle, memberIds, fetching, onRefresh, onEndReached, header }: Props) => {
  const refreshing = Platform.select({ ios: false, android: !!fetching })
  return (
    <FlatList
      style={ style }
      ListHeaderComponent={ (
        <>
          {header || <Fragment />}
        </>
      ) }
      contentContainerStyle={ contentContainerStyle }
      data={ memberIds }
      refreshing={ refreshing }
      onRefresh={ onRefresh }
      onEndReached={ onEndReached }
      keyExtractor={ item => item }
      renderItem={ ({ item }) => (
        <MembersListItem memberId={ item } />
      ) }
      ListFooterComponent={ (
        <>
          {Platform.OS === 'ios' && <LoadingIndicator isLoading={ !!fetching } /> }
        </>
      ) }
      ItemSeparatorComponent={ Spacing }
    />
  )
}

export default MembersList
