import React, { useMemo, useState } from 'react'
import { Dimensions, FlatList, TouchableOpacity } from 'react-native'
import FastImage, { Source as FastImageSource } from 'react-native-fast-image'
import styled from 'styled-components/native'

const LARGE_BOOK_HEIGHT = 240
const LARGE_BOOK_WIDTH = 168

const ImageContainer = styled.View`
  width: ${({ width }) => width};
  align-items: center;
`

const Container = styled.View``

const ScrollContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-vertical: 8;
`

const ScrollIndicator = styled.View`
  background-color: ${({ theme, isActive }) =>
    isActive ? theme.palette.grey3 : '#FFF'};
  border-color: #aaa;
  border-width: 1;
  width: 8;
  height: 8;
  border-radius: 5;
  margin-horizontal: 4;
`

interface OwnProps {
  urlList: [string]
  onPress: () => void
}

const BookHeaderGallery = ({ urlList, onPress }: OwnProps) => {
  const [page, setPage] = useState(0)

  const width = useMemo(() => Dimensions.get('window').width - 32, [urlList])
  return (
    <Container>
      <FlatList
        data={urlList}
        pagingEnabled
        horizontal
        keyExtractor={(_, index) => {
          return index.toString()
        }}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          let contentOffset = event.nativeEvent.contentOffset
          let viewSize = event.nativeEvent.layoutMeasurement

          // Divide the horizontal offset by the width of the view to see which page is visible
          let pageNum = Math.floor(contentOffset.x / viewSize.width)
          setPage(pageNum)
        }}
        renderItem={(book) => {
          const imageSource: FastImageSource = {
            uri: book.item,
          }
          return (
            <TouchableOpacity onPress={onPress}>
              <ImageContainer width={width}>
                <FastImage
                  resizeMode="contain"
                  style={{
                    width: LARGE_BOOK_WIDTH,
                    height: LARGE_BOOK_HEIGHT,
                    shadowOffset: { width: 0, height: 50 },
                    shadowOpacity: 1,
                    shadowColor: 'black',
                  }}
                  source={imageSource}
                />
              </ImageContainer>
            </TouchableOpacity>
          )
        }}
      />
      {urlList.length > 1 && (
        <ScrollContainer>
          {urlList.map((_, index) => (
            <ScrollIndicator isActive={index === page} key={index} />
          ))}
        </ScrollContainer>
      )}
    </Container>
  )
}

export default BookHeaderGallery
