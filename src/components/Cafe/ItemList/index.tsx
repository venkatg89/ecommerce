import React, { useMemo } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import CafeListItem from './Item'

import {
  useResponsiveDimensions,
  CONTENT_HORIZONTAL_PADDING,
  CONTENT_VERTICAL_PADDING,
} from 'src/constants/layout'

const Spacing = styled.View`
  height: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.palette.grey3};
`

interface OwnProps {
  itemIds: string[]
  itemType: string
}

type Props = OwnProps

const CafeItemList = ({ itemIds, itemType }: Props) => {
  const { width } = useResponsiveDimensions()
  const contentContainerStyle = useMemo(
    () => ({
      flexGrow: 1,
      paddingVertical: CONTENT_VERTICAL_PADDING,
      paddingHorizontal: CONTENT_HORIZONTAL_PADDING(width),
    }),
    [width],
  )

  return (
    <FlatList
      data={itemIds}
      contentContainerStyle={contentContainerStyle}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <CafeListItem itemId={item} itemType={itemType} />
      )}
      ItemSeparatorComponent={Spacing}
    />
  )
}

export default CafeItemList
