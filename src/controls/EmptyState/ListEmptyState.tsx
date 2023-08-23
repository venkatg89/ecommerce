import React, { memo } from 'react'
import styled from 'styled-components/native'
import { ViewStyle, StyleProp } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import Images from 'assets/images'


interface OwnProps {
  style?: StyleProp<ViewStyle>
  description?: string
  title?: string
  contentContainerStyle?: StyleProp<ViewStyle>
}

const EmptyStateContainer = styled.View`
  align-items: center;
  flex: 1;
`

const EmptyImage = styled.Image`
  width: 183;
  height: 183;
`
const EmptyStateTitle = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`
const EmptyStateText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  text-align: center;
`

type Props = OwnProps

const ListEmptyState = memo(({ style, title = 'This list is waiting for great reads.', description = 'Tap the Add to List below to start adding.', contentContainerStyle }: Props) => (
  <ScrollView contentContainerStyle={ contentContainerStyle }>
    <EmptyStateContainer style={ style }>
      <EmptyImage source={ Images.bookStack } />
      <EmptyStateTitle>{title}</EmptyStateTitle>
      <EmptyStateText>{description}</EmptyStateText>
    </EmptyStateContainer>
  </ScrollView>
))


export default ListEmptyState
