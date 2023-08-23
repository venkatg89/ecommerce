import React, { useMemo, useState } from 'react'
import { Dimensions, FlatList } from 'react-native'
import FastImage, { Source as FastImageSource } from 'react-native-fast-image'
import {
  bestImageSuffix,
  normalImageSuffix,
  thumbImageSuffix,
} from 'src/helpers/generateUrl'
import styled from 'styled-components/native'
import Header from 'src/controls/navigation/Header'

const ImageContainer = styled.View`
  align-items: center;
  justify-content: center;
  margin-horizontal: 8;
  margin-vertical: 8;
`

const Container = styled.View`
  flex: 1;
  padding-vertical: 8;
  justify-content: space-around;
  background-color: #fff;
`

const ScrollContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  margin-vertical: 8;
  flex: 1;
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
const maxHeight = 490

const ProductImagesScreen = ({ navigation }) => {
  const [page, setPage] = useState(0)

  const urlList = navigation.getParam('urlList')

  const width = useMemo(() => Dimensions.get('window').width, [urlList])

  return (
    <Container>
      <FlatList
        data={urlList}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          let contentOffset = event.nativeEvent.contentOffset
          let viewSize = event.nativeEvent.layoutMeasurement

          // Divide the horizontal offset by the width of the view to see which page is visible
          let pageNum = Math.floor(contentOffset.x / viewSize.width)
          setPage(pageNum)
        }}
        renderItem={(book) => {
          let uri: string = book.item.replace(thumbImageSuffix, bestImageSuffix)
          uri = uri.replace(normalImageSuffix, bestImageSuffix)
          const imageSource: FastImageSource = {
            uri,
          }
          return (
            <ImageContainer width={width} style={{ width: width - 16 }}>
              <FastImage
                resizeMode="contain"
                style={{
                  width: '100%',
                  height: maxHeight,
                  marginHorizontal: 16,
                  shadowOffset: { width: 0, height: 5 },
                  shadowOpacity: 1,
                  shadowColor: 'black',
                  overflow: 'visible',
                }}
                source={imageSource}
              />
            </ImageContainer>
          )
        }}
      />
      {urlList.length > 1 && (
        <ScrollContainer>
          {urlList.map((_, index) => (
            <ScrollIndicator isActive={index === page} />
          ))}
        </ScrollContainer>
      )}
    </Container>
  )
}

ProductImagesScreen.navigationOptions = ({ navigation }) => ({
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default ProductImagesScreen
