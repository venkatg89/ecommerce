import React, { useMemo, useContext } from 'react'
import { ScrollView, StyleSheet, RefreshControl } from 'react-native'
import { ThemeContext } from 'styled-components/native'

import {
  CONTENT_HORIZONTAL_PADDING,
  CONTENT_VERTICAL_PADDING,
  useResponsiveDimensions,
} from 'src/constants/layout'

export { CONTENT_HORIZONTAL_PADDING, CONTENT_VERTICAL_PADDING }

import { getContentContainerStyleWithAnchor } from 'src/constants/layout'
import { ThemeModel } from 'src/models/ThemeModel'

// We should try to not use the below in favour of the styles in src/constants/layout, will deprecate styles
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerPaddingTop: {
    paddingTop: CONTENT_VERTICAL_PADDING,
  },
  contentContainerCenter: {
    alignItems: 'center',
  },
})

interface Props {
  style?: any
  children?: React.ReactNode
  contentContainerStyle?: any
  full?: boolean
  center?: boolean
  refreshing?: boolean
  onRefresh?: () => void
  withAnchor?: boolean
  withoutHorizontalPadding?: boolean
  showsVerticalScrollIndicator?: boolean
}

export default ({
  style,
  children,
  contentContainerStyle,
  full,
  center,
  refreshing,
  onRefresh,
  withAnchor,
  withoutHorizontalPadding,
  showsVerticalScrollIndicator = true,
}: Props) => {
  const { width } = useResponsiveDimensions()
  const theme = useContext(ThemeContext) as ThemeModel

  const anchoredContentContainerStyle = useMemo(
    () => getContentContainerStyleWithAnchor(theme, width),
    [theme, width],
  )

  const containerStyles = useMemo(
    () => ({
      flexGrow: 1,
      paddingVertical: CONTENT_VERTICAL_PADDING,
      paddingHorizontal: !withoutHorizontalPadding
        ? CONTENT_HORIZONTAL_PADDING(width)
        : 0,
    }),
    [width],
  )
  return (
    <ScrollView
      style={[!full && styles.container, style]}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      contentContainerStyle={[
        full && styles.containerPaddingTop,
        center && styles.contentContainerCenter,
        withAnchor && anchoredContentContainerStyle,
        containerStyles,
        contentContainerStyle,
      ]}
      refreshControl={
        onRefresh /* shown on top of view if refreshable & refreshing now. Hidden otherwise */ && (
          <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} />
        )
      }
      pointerEvents={
        !refreshing ? 'auto' : 'none' /* disables user input if refreshing */
      }
      // accessible={ !refreshing /* also disables user input if refreshing */ }
      /* Possible values https://facebook.github.io/react-native/docs/scrollview#keyboardshouldpersisttaps */
      accessible={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  )
}
