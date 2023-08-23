import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import FastImage, {
  Source as FastImageSource,
  ImageStyle,
} from 'react-native-fast-image'
import styled from 'styled-components/native'
import { Ean, BookOrEan, asEan, asBookModel } from 'src/models/BookModel'
import { icons } from 'assets/images'
import { makeBookImageURL } from 'src/helpers/generateUrl'
/*
// Render Counters - here just for now
let renderCounts = 0
const imageRenderCounts = 0
*/
const EXTRA_LARGE_HEIGHT = 240
const EXTRA_LARGE_WIDTH = 168
const LARGE_BOOK_HEIGHT = 186
const LARGE_BOOK_WIDTH = 142
const MEDIUM_BOOK_HEIGHT = 104
const MEDIUM_BOOK_WIDTH = 74
const SMALL_BOOK_HEIGHT = 77
const SMALL_BOOK_WIDTH = 54

interface Props {
  bookOrEan?: BookOrEan
  maxHeight?: number
  maxWidth?: number
  addBookShadow?: boolean
  displayBestHQImage?: boolean
  onPress?: (ean: Ean) => void
  onLoad?: () => void
  // goToDetails?: boolean / TODO: set it so no need to pass a route navigate
  size?: string
  style?: any
}

interface ImageSize {
  width: number
  height: number
}

interface ContainerProps {
  width: number
  height: number
  border: boolean
}

const TouchableContainer = styled.TouchableOpacity<ContainerProps>`
  flex-direction: column-reverse;
  overflow: visible;
  align-items: center;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  border: ${(p) => (p.border ? '0.5px' : '0px')} #e8e8e8 solid;
`

const RegularContainer = styled.View<ContainerProps>`
  flex-direction: column-reverse;
  overflow: visible;
  align-items: center;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  border: ${(p) => (p.border ? '0.5px' : '0px')} #e8e8e8 solid;
`

const addedShadowStyle: ImageStyle = Platform.select({
  ios: {
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
  },
})!

type IconHeight = Nullable<string | number>
interface IconContainerProps {
  iconPosition: IconHeight
}

const IconContainer = styled.View<IconContainerProps>`
  position: absolute;
  overflow: visible;
  z-index: 1;
  top: ${({ iconPosition }) => iconPosition || 0};
  right: 0;
`

const IconWrapper = styled.View`
  position: relative;
  width: 34;
  height: 34;
`

const IconBase = styled.View`
  position: absolute;
  background: transparent;
  width: 0;
  height: 0;
  top: 0;
  right: 0;
  border: 34px white solid;
  border-top-width: 0px;
  border-bottom-color: transparent;
  border-left-color: transparent;
`

const Icon = styled.Image`
  width: 16;
  height: 16;
  position: absolute;
  top: 0;
  right: 0;
`

const getSize = (size) => {
  switch (size) {
    case 'extraLarge': {
      return {
        maxHeight: EXTRA_LARGE_HEIGHT,
        maxWidth: EXTRA_LARGE_WIDTH,
      }
    }
    case 'large': {
      return {
        maxHeight: LARGE_BOOK_HEIGHT,
        maxWidth: LARGE_BOOK_WIDTH,
      }
    }
    case 'medium': {
      return {
        maxHeight: MEDIUM_BOOK_HEIGHT,
        maxWidth: MEDIUM_BOOK_WIDTH,
      }
    }
    case 'small':
    default: {
      return {
        maxHeight: SMALL_BOOK_HEIGHT,
        maxWidth: SMALL_BOOK_WIDTH,
      }
    }
  }
}

export default ({
  bookOrEan,
  size = 'small',
  onLoad,
  onPress,
  displayBestHQImage,
  addBookShadow,
  style,
  maxHeight: maxHeightOverride,
  maxWidth: maxWidthOverride,
}: Props) => {
  const { maxHeight: sizedHeight, maxWidth: sizedWidth } = getSize(size)
  const [maxHeight, setMaxHeight] = useState<number>(0)
  const [maxWidth, setMaxWidth] = useState<number>(0)

  useEffect(() => {
    if (maxHeightOverride && maxWidthOverride) {
      setMaxHeight(maxHeightOverride)
      setMaxWidth(maxWidthOverride)
    } else {
      setMaxHeight(sizedHeight)
      setMaxWidth(sizedWidth)
    }
  }, [maxWidthOverride, maxWidthOverride, sizedHeight, sizedWidth])

  const containerWidth = maxWidth > 1 ? maxWidth : 1
  const containerHeight = maxHeight > 1 ? maxHeight : 1

  const ean = asEan(bookOrEan || '')
  const book = asBookModel(bookOrEan)

  const [isLoaded, setIsLoaded] = React.useState<boolean>(false)
  const [iconHeight, setIconHeight] = React.useState<IconHeight>(null)
  const [imageStyle, setImageStyle] = React.useState<ImageStyle>({
    // Important for Android, but not necessary for iOS
    width: '100%',
    height: '100%',
    // Hides the larger image on Android
    opacity: 0,
  })

  const isAudioBook = book ? book.skuType === 'audiobook' : undefined

  const imageSource = React.useMemo<FastImageSource>(
    () => ({ uri: makeBookImageURL(bookOrEan) }),
    [bookOrEan, displayBestHQImage],
  )

  const onLoadCallback = React.useCallback(
    (ev) => {
      let { width, height } = ev.nativeEvent as ImageSize
      if (width < 1) {
        width = 1
      }
      if (height < 1) {
        height = 1
      }
      const aspectContainer = containerWidth / containerHeight
      const aspectImage = width / height
      // Size the image down to the container's size. Leave spaces either horizonally or vertically
      // The containers flex-direction: column-reverse will pull the image down in case of space left vertically.
      let result: ImageStyle = {}
      if (aspectContainer > aspectImage) {
        result = {
          width: `${(aspectImage / aspectContainer) * 100}%`,
          height: '100%',
        }
      } else if (aspectContainer === aspectImage) {
        result = { width: '100%', height: '100%' }
      } /* aspectContainer < aspectImage */ else {
        result = {
          width: '100%',
          height: `${(aspectContainer / aspectImage) * 100}%`,
        }
      }
      result = {
        ...result,
        ...(addBookShadow ? addedShadowStyle : {}),
        overflow: 'visible', // for shadow
        opacity: 1.0, // We can show the image, now that it's loaded.
      }
      setImageStyle(result)

      if (isAudioBook && typeof result.height === 'string') {
        setIconHeight(`${(100 - parseFloat(result.height)).toString()}%`)
      }

      if (typeof onLoad === 'function') {
        onLoad()
      }
      setIsLoaded(true)
    },
    [maxWidth, maxHeight, addBookShadow, onLoad],
  )
  /*
    // Render Counters - put inside renderedImage
    imageRenderCounts += 1
    if (imageRenderCounts % 50 === 0) {
      console.log(`BookImage image render ${imageRenderCounts}`)
    }
   */
  const renderedImage = React.useMemo(
    () => (
      <>
        {isAudioBook && (
          <IconContainer iconPosition={iconHeight}>
            <IconWrapper>
              <IconBase />
              <Icon source={icons.audio} />
            </IconWrapper>
          </IconContainer>
        )}
        <FastImage
          resizeMode="contain"
          source={imageSource}
          style={imageStyle}
          onLoad={onLoadCallback}
        />
      </>
    ),
    [imageSource, imageStyle, onLoadCallback],
  )

  const onPressCallback = React.useCallback(() => {
    typeof onPress === 'function' && onPress(ean)
  }, [ean])

  return onPress ? (
    <TouchableContainer
      height={maxHeight}
      width={maxWidth}
      onPress={onPressCallback}
      accessibilityLabel={book ? `cover: ${book.name}` : ''}
      accessibilityRole="imagebutton"
      border={!isLoaded}
      style={style}
    >
      {renderedImage}
    </TouchableContainer>
  ) : (
    <RegularContainer
      style={style}
      height={maxHeight}
      width={maxWidth}
      border={!isLoaded}
    >
      {renderedImage}
    </RegularContainer>
  )
}
