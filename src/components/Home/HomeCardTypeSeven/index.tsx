import React from 'react'
import styled from 'styled-components/native'
import { FlatList } from 'react-native'

import BackgroundGradient from 'src/components/Home/BackgroundGradient'

import { HomeCardTypeSevenModel } from 'src/models/HomeModel'
import { push, Routes, Params } from 'src/helpers/navigationService'

const Container = styled(BackgroundGradient)`
  ${({ theme, withSpace }) =>
    withSpace ? `margin-vertical: ${theme.spacing(3)};` : ''}
`
const CategoryImage = styled.Image`
  width: 112;
  height: 160;
  margin-vertical: ${({ theme }) => theme.spacing(1)};
`

const CategpryText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  text-align: center;
  color: ${({ theme }) => theme.palette.grey2};
`

const CategoryContainer = styled.TouchableOpacity`
  flex-direction: column;
  padding-horizontal: ${({ theme }) => theme.spacing(1)};
  max-width: 128;
`

const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
`

interface OwnProps {
  content: HomeCardTypeSevenModel
  onPress: (string) => void
}

type Props = OwnProps

const HomeCardSeven = ({ content, onPress }: Props) => {
  const renderBook = ({ item }) =>
    item.imageUrl !== undefined ? (
      <CategoryContainer
        onPress={() => {
          push(Routes.HOME__BROWSE, {
            [Params.BROWSE_URL]: item.seeAllBrowseUrl,
          })
        }}
      >
        <CategoryImage
          resizeMode="contain"
          source={{
            uri: 'http:' + item.imageUrl,
          }}
        />
        <CategpryText numberOfLines={2}>{item.text}</CategpryText>
      </CategoryContainer>
    ) : null

  return (
    <Container withSpace={content.items.length > 0}>
      <HeaderText numberOfLines={1}>{content.name}</HeaderText>
      <FlatList
        style={{ overflow: 'visible' }}
        horizontal
        data={content.items}
        renderItem={renderBook}
        keyExtractor={(item) => item.text}
        showsHorizontalScrollIndicator={false}
      />
    </Container>
  )
}

export default HomeCardSeven
