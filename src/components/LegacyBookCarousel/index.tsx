import React, { useCallback, useMemo } from 'react'
import { ListRenderItemInfo, AccessibilityProps, FlatList } from 'react-native'
import DeviceInfo from 'react-native-device-info'

import styled from 'styled-components/native'
import BookImage from 'src/components/BookImage'
import BookDetails from './Details'

import { push } from 'src/helpers/navigationService'
import Routes, { Params } from 'src/constants/routes'
import { BookOrEan, asEan } from 'src/models/BookModel'
import {
  CONTENT_HORIZONTAL_PADDING,
  useResponsiveDimensions,
} from 'src/constants/layout'

/*
// Performance Check
let renderCounts = 0
*/

type HeaderProps = {
  bookMaxWidth: number
  leftPadTypeMobile?:
    | number
    | 'none'
    | 'default'
    | 'content-padding'
    | 'book-width'
  leftPadTypeTablet?:
    | number
    | 'none'
    | 'default'
    | 'content-padding'
    | 'book-width'
  currentWidth: number
}

const Header = styled.View<HeaderProps>`
  ${
    ({ theme, bookMaxWidth, leftPadTypeMobile, currentWidth }) =>
      !DeviceInfo.isTablet() &&
      /* eslint-disable indent */
      (typeof leftPadTypeMobile === 'number'
        ? `width: ${theme.spacing(leftPadTypeMobile)};`
        : leftPadTypeMobile === 'none'
        ? 'width: 0;'
        : leftPadTypeMobile === 'content-padding'
        ? `width: ${CONTENT_HORIZONTAL_PADDING(currentWidth)}`
        : leftPadTypeMobile === 'book-width'
        ? `width: ${bookMaxWidth};`
        : `width: ${CONTENT_HORIZONTAL_PADDING(currentWidth)};`)
    /* eslint-enable indent */
  }

  ${
    ({ theme, bookMaxWidth, leftPadTypeTablet, currentWidth }) =>
      DeviceInfo.isTablet() &&
      /* eslint-disable indent */
      (typeof leftPadTypeTablet === 'number'
        ? `width: ${theme.spacing(leftPadTypeTablet)};`
        : leftPadTypeTablet === 'none'
        ? 'width: 0;'
        : leftPadTypeTablet === 'content-padding'
        ? `width: ${CONTENT_HORIZONTAL_PADDING(currentWidth)};`
        : leftPadTypeTablet === 'book-width'
        ? `width: ${bookMaxWidth};`
        : `width: ${
            CONTENT_HORIZONTAL_PADDING(currentWidth) + theme.spacing(1)
          };`)
    /* eslint-enable indent */
  }
`

type FooterProps = {
  bookMaxWidth: number
  bookMaxHeight: number
  rightPadTypeMobile?:
    | number
    | 'none'
    | 'default'
    | 'content-padding'
    | 'book-width'
  rightPadTypeTablet?:
    | number
    | 'none'
    | 'default'
    | 'content-padding'
    | 'book-width'
  currentWidth: number
}

const FooterContainer = styled.View<FooterProps>`
  height: ${({ bookMaxHeight }) => bookMaxHeight};
  justify-content: center;
  align-items: center;

  ${
    ({ theme, bookMaxWidth, rightPadTypeMobile, currentWidth }) =>
      !DeviceInfo.isTablet() &&
      /* eslint-disable indent */
      (typeof rightPadTypeMobile === 'number'
        ? `width: ${theme.spacing(rightPadTypeMobile)};`
        : rightPadTypeMobile === 'none'
        ? 'width: 0;'
        : rightPadTypeMobile === 'content-padding'
        ? `width: ${CONTENT_HORIZONTAL_PADDING(currentWidth)}`
        : rightPadTypeMobile === 'book-width'
        ? `width: ${bookMaxWidth};`
        : `width: ${CONTENT_HORIZONTAL_PADDING(currentWidth)};`)
    /* eslint-enable indent */
  }

  ${
    ({ theme, bookMaxWidth, rightPadTypeTablet, currentWidth }) =>
      DeviceInfo.isTablet() &&
      /* eslint-disable indent */
      (typeof rightPadTypeTablet === 'number'
        ? `width: ${theme.spacing(rightPadTypeTablet)};`
        : rightPadTypeTablet === 'none'
        ? 'width: 0;'
        : rightPadTypeTablet === 'content-padding'
        ? `width: ${CONTENT_HORIZONTAL_PADDING(currentWidth)};`
        : rightPadTypeTablet === 'book-width'
        ? `width: ${bookMaxWidth};`
        : `width: ${
            CONTENT_HORIZONTAL_PADDING(currentWidth) + theme.spacing(1)
          };`)
    /* eslint-enable indent */
  }
`

const Footer = styled.TouchableOpacity`
  flex-direction: column;
  width: 58;
  height: 76;
  align-items: center;
  justify-content: center;
`

const FooterText = styled.Text`
  ${({ theme }) => theme.typography.button.small}
  color: ${({ theme }) => theme.palette.linkGreen};
  text-transform: uppercase;
`

/*
 * Using a TouchableWithoutFeedback here instead of just a View so that pan gestures are not triggered when the finger is over a spacer
 */
const SpacingContainer = styled.TouchableWithoutFeedback``

const SpacingItem = styled.View<Pick<OwnProps, 'spacingSize'>>`
  width: ${({ theme, spacingSize }) =>
    spacingSize ? theme.spacing(spacingSize) : theme.spacing(3)};
`

const BookContainer = styled.View`
  padding-vertical: ${({ theme }) => theme.spacing(1)};
  overflow: visible;
`

interface StateProps {
  bookOrEanList: BookOrEan[]
}
interface OwnProps {
  style?: any
  leftPadTypeMobile?:
    | number
    | 'none'
    | 'default'
    | 'content-padding'
    | 'book-width'
  leftPadTypeTablet?:
    | number
    | 'none'
    | 'default'
    | 'content-padding'
    | 'book-width'
  rightPadTypeMobile?:
    | number
    | 'none'
    | 'default'
    | 'content-padding'
    | 'book-width'
  rightPadTypeTablet?:
    | number
    | 'none'
    | 'default'
    | 'content-padding'
    | 'book-width'
  spacingSize?: number
  withMore?: boolean
  withMoreCallback?: any
  contentContainerStyle?: any
  bookMaxHeight: number
  bookMaxWidth: number
  withDetails?: boolean
  size?: string
}

type Props = OwnProps & StateProps & AccessibilityProps

const Carousel = (props: Props) => {
  const {
    bookMaxWidth,
    bookMaxHeight,
    rightPadTypeMobile,
    rightPadTypeTablet,
    withMore,
    withMoreCallback,
    withDetails,
    accessible,
    accessibilityElementsHidden,
    importantForAccessibility,
    style,
    bookOrEanList,
    contentContainerStyle,
    leftPadTypeMobile,
    leftPadTypeTablet,
    spacingSize,
    size,
  } = props

  const imageWidthStyle = useMemo(() => ({ width: bookMaxWidth }), [
    bookMaxWidth,
  ])

  const { width } = useResponsiveDimensions()

  const onPressHandler = (ean) => {
    push(Routes.PDP__MAIN, { [Params.EAN]: ean })
  }

  const renderFooter = useCallback(
    () => (
      <FooterContainer
        bookMaxWidth={bookMaxWidth}
        bookMaxHeight={bookMaxHeight}
        rightPadTypeMobile={rightPadTypeMobile}
        rightPadTypeTablet={rightPadTypeTablet}
        currentWidth={width}
      >
        {withMore && (
          <Footer onPress={withMoreCallback}>
            <FooterText>More</FooterText>
          </Footer>
        )}
      </FooterContainer>
    ),
    [
      bookMaxWidth,
      bookMaxHeight,
      rightPadTypeMobile,
      rightPadTypeTablet,
      withMore,
      withMoreCallback,
    ],
  )

  const renderBookSingle = useCallback(
    (itemInfo: ListRenderItemInfo<BookOrEan>) => {
      const bookOrEan = itemInfo.item
      return (
        <BookContainer>
          <BookImage
            bookOrEan={bookOrEan}
            maxHeight={bookMaxHeight}
            maxWidth={bookMaxWidth}
            onPress={onPressHandler}
            addBookShadow
            size={size}
          />
          {withDetails && (
            <BookDetails ean={asEan(bookOrEan)} style={imageWidthStyle} />
          )}
        </BookContainer>
      )
    },
    [bookMaxHeight, bookMaxWidth, withDetails],
  )

  const Spacer = useCallback(
    () => (
      <SpacingContainer accessible={false}>
        <SpacingItem spacingSize={spacingSize} />
      </SpacingContainer>
    ),
    [],
  )

  const keyExtractor = useCallback((item) => asEan(item), [])

  // OptimizeFlatlist has issue with dynamic data https://github.com/stoffern/react-native-optimized-flatlist/issues/26
  return (
    <FlatList
      accessible={accessible}
      accessibilityElementsHidden={accessibilityElementsHidden}
      importantForAccessibility={importantForAccessibility}
      style={style}
      contentContainerStyle={contentContainerStyle}
      horizontal
      showsHorizontalScrollIndicator={false}
      data={bookOrEanList}
      keyExtractor={keyExtractor}
      renderItem={renderBookSingle}
      ItemSeparatorComponent={Spacer}
      ListHeaderComponent={
        <Header
          bookMaxWidth={bookMaxWidth}
          leftPadTypeMobile={leftPadTypeMobile}
          leftPadTypeTablet={leftPadTypeTablet}
          currentWidth={width}
        />
      }
      ListFooterComponent={renderFooter}
    />
  )
}

export default Carousel
