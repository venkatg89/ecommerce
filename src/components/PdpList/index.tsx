import React, { useCallback, useMemo, useContext } from 'react'
import { FlatList } from 'react-native'
import styled, { ThemeContext } from 'styled-components/native'

import { ResultModel } from 'src/models/SearchModel'
import { ThemeModel } from 'src/models/ThemeModel'
import Item from './Item'
import UndoItem from './UndoItem'
import LoadingIndicator from 'src/controls/progress/LoadingIndicator'

import {
  useResponsiveDimensions,
  CONTENT_HORIZONTAL_PADDING,
  CONTENT_VERTICAL_PADDING,
} from 'src/constants/layout'

const ListSpacing = styled.View`
  height: ${({ theme }) => theme.spacing(3)};
`

const NoMoreResultsText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1}
  color: ${({ theme }) => theme.palette.grey3};
  padding-top: ${({ theme }) => theme.spacing(6)};
  padding-bottom: ${({ theme }) => theme.spacing(5)};
  align-self: center;
`

interface OwnProps {
  results: ResultModel[]
  isLoading?: boolean
  onRefresh?: () => void
  onEndReached?: () => void
  hasReachedEnd?: boolean
  onSwipe?: (ean: string) => void
  onUndo?: (ean: string) => void
  deletedEans?: string[]
  onRemoveEan?: (ean: string) => void
  withoutHorizontalPadding?: boolean
  footerElement?: () => void
}

type Props = OwnProps

const PdpList = ({
  results,
  isLoading,
  onRefresh,
  onEndReached,
  hasReachedEnd,
  onSwipe,
  onUndo,
  deletedEans,
  onRemoveEan,
  withoutHorizontalPadding,
  footerElement,
}: Props) => {
  const theme = useContext(ThemeContext) as ThemeModel

  const { width } = useResponsiveDimensions()
  const contentContainerStyle = useMemo(
    () => ({
      flexGrow: 1,
      paddingVertical: CONTENT_VERTICAL_PADDING,
      paddingHorizontal: !withoutHorizontalPadding
        ? CONTENT_HORIZONTAL_PADDING(width)
        : 0,
    }),
    [width],
  )

  const keyExtractor = useCallback((item) => item.ean, [])

  const renderItem = useCallback(
    (item) =>
      deletedEans?.includes(item.item.ean) && onUndo ? (
        <UndoItem
          result={item.item}
          onUndo={onUndo}
          onRemoveEan={onRemoveEan}
        />
      ) : (
        <Item result={item.item} onSwipe={onSwipe} />
      ),
    [deletedEans],
  )

  return (
    <FlatList
      style={{ flex: 1 }}
      contentContainerStyle={contentContainerStyle}
      data={results}
      keyExtractor={keyExtractor}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      renderItem={renderItem}
      ItemSeparatorComponent={ListSpacing}
      ListFooterComponent={
        <>
          {hasReachedEnd && (
            <NoMoreResultsText>No more results.</NoMoreResultsText>
          )}

          <LoadingIndicator
            isLoading={!!isLoading}
            color={theme.palette.disabledGrey}
          />
          {footerElement && !isLoading && footerElement()}
        </>
      }
      extraData={deletedEans}
    />
  )
}

export default PdpList
