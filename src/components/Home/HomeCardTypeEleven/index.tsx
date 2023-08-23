import React, { useCallback } from 'react'
import styled from 'styled-components/native'
import { FlatList, View, Platform } from 'react-native'
import DEFAULT from 'src/models/ThemeModel/default'
import BookImage from 'src/components/BookImage'
import BackgroundGradient from 'src/components/Home/BackgroundGradient'

import { push, Routes, Params } from 'src/helpers/navigationService'
import { HomeCardTypeElevenModel } from 'src/models/HomeModel'

const Container = styled(BackgroundGradient)`
  margin-vertical: ${({ theme }) => theme.spacing(3)};
`

const ContentContainer = styled.TouchableOpacity`
  ${({ theme }) => theme.boxShadow.container}
  height: ${({ theme }) => theme.spacing(13)};
  width: ${({ theme }) => theme.spacing(26)};
  flex-direction: column;
  justify-content: space-between;
  border-radius: ${({ theme }) => theme.spacing(0.5)};
  overflow: hidden;
  background-color: ${({ theme }) => theme.palette.white};
`

const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const Spacer = styled.View`
  width: ${({ theme }) => theme.spacing(2)};
`

const ContentTitle = styled.Text`
  ${({ theme }) => theme.typography.subTitle2};
  color: ${({ theme }) => theme.palette.grey1};
  padding-top: ${({ theme }) => theme.spacing(1)};
  padding-bottom: ${({ theme }) => theme.spacing(1.5)};
  padding-horizontal: ${({ theme }) => theme.spacing(1)};
`

const ContentWrapper = styled.View`
  flex-direction: row;
  margin-left: ${({ theme }) => theme.spacing(5)};
`

const BookContainer = styled.TouchableOpacity`
  left: ${({ index }) => -24 * index};
`

interface OwnProps {
  content: HomeCardTypeElevenModel
}

type Props = OwnProps

const HomeCardEleven = ({ content }: Props) => {
  const { contents, title } = content

  const renderContent = useCallback(
    ({ item, index }) => (
      <View
        style={{
          backgroundColor: DEFAULT.palette.grey5,
          width:
            Platform.OS === 'android'
              ? DEFAULT.spacing(26.2)
              : DEFAULT.spacing(26),
          height:
            Platform.OS === 'android'
              ? DEFAULT.spacing(13.2)
              : DEFAULT.spacing(13),
          justifyContent: 'flex-end',
          flexDirection: 'row',
          borderRadius: DEFAULT.spacing(0.5),
          shadowColor: DEFAULT.palette.grey2,
        }}
      >
        <ContentContainer
          onPress={() => {
            push(Routes.HOME__BROWSE, { [Params.BROWSE_URL]: item.url })
          }}
        >
          <ContentTitle>{item.name}</ContentTitle>
          <ContentWrapper>
            {item.items.map((item, index) => (
              <BookContainer
                key={item.ean}
                onPress={() => {
                  push(Routes.PDP__MAIN, { ean: item.ean })
                }}
                index={index}
                style={{
                  shadowColor: DEFAULT.palette.grey2,
                  shadowOffset: {
                    width: -6,
                    height: 2,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: 3.8,
                }}
              >
                <BookImage bookOrEan={item.ean} size="medium" />
              </BookContainer>
            ))}
          </ContentWrapper>
        </ContentContainer>
      </View>
    ),
    [],
  )

  return (
    <Container>
      <HeaderText>{title}</HeaderText>
      <FlatList
        style={{
          overflow: 'visible',
        }}
        ItemSeparatorComponent={Spacer}
        horizontal
        data={contents}
        renderItem={renderContent}
        keyExtractor={(item, index) => contents[index].items[0].ean}
        showsHorizontalScrollIndicator={false}
      />
    </Container>
  )
}

export default HomeCardEleven
