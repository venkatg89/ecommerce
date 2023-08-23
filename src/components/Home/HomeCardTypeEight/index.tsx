import React from 'react'
import styled from 'styled-components/native'
import { FlatList } from 'react-native'

import BackgroundGradient from 'src/components/Home/BackgroundGradient'

import { push, Routes, Params } from 'src/helpers/navigationService'
import { HomeCardTypeEightnModel } from 'src/models/HomeModel'

const Container = styled(BackgroundGradient)`
  ${({ theme, withSpace }) =>
    withSpace ? `margin-vertical: ${theme.spacing(3)};` : ''}
`
const CategoryImage = styled.Image`
  width: 112;
  height: 160;
  margin-vertical: ${({ theme }) => theme.spacing(0.5)};
`

const CategpryText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  text-align: left;
  color: ${({ theme }) => theme.palette.grey2};
  font-weight: bold;
`
const ImageTitleContainer = styled.TouchableOpacity`
  flex-direction: column;
`

const CategoryContainer = styled.View`
  flex-direction: row;
  padding-horizontal: ${({ theme }) => theme.spacing(1)};
`

const LinksContainer = styled.View`
  flex-direction: column;
  margin-top: ${({ theme }) => theme.spacing(4)};
  margin-horizontal: ${({ theme }) => theme.spacing(2)};
`
const LinkText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  text-align: left;
  color: ${({ theme }) => theme.palette.linkGreen};
  text-transform: uppercase;
`
const LinkTextBox = styled.View`
  border-bottom-width: ${(props) => (props.isLast ? 0 : 1)};
  border-color: ${({ theme }) => theme.palette.grey4};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  padding-top: ${({ theme }) => theme.spacing(2)};
`

const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
`

interface OwnProps {
  content: HomeCardTypeEightnModel
  onPress: (string) => void
}

type Props = OwnProps

const HomeCardEight = ({ content, onPress }: Props) => {
  const renderSection = ({ item }) =>
    item.imageUrl !== undefined ? (
      <CategoryContainer>
        <ImageTitleContainer
          onPress={() => {
            push(Routes.HOME__BROWSE, {
              [Params.BROWSE_URL]: item.seeAllBrowseUrl,
            })
          }}
        >
          <CategpryText numberOfLines={2}>{item.text}</CategpryText>
          <CategoryImage
            resizeMode="contain"
            source={{
              uri: 'http:' + item.imageUrl,
            }}
          />
        </ImageTitleContainer>
        <LinksContainer>
          {item.sublinks.map((sub, index) => {
            return (
              <LinkTextBox
                key={sub.url}
                isLast={index === item.sublinks.length - 1}
              >
                <LinkText
                  onPress={() => {
                    push(Routes.HOME__BROWSE, {
                      [Params.BROWSE_URL]: sub.url,
                    })
                  }}
                >
                  {sub.text}
                </LinkText>
              </LinkTextBox>
            )
          })}
        </LinksContainer>
      </CategoryContainer>
    ) : null

  return (
    <Container withSpace={content.items.length > 0}>
      <HeaderText numberOfLines={1}>{content.name}</HeaderText>
      <FlatList
        style={{ overflow: 'visible' }}
        horizontal
        data={content.items}
        renderItem={renderSection}
        keyExtractor={(item) => item.text}
        showsHorizontalScrollIndicator={false}
      />
    </Container>
  )
}

export default HomeCardEight
