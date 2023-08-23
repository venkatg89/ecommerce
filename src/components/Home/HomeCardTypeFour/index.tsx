import React, { useCallback } from 'react'
import styled from 'styled-components/native'
import { FlatList } from 'react-native'

import Button from 'src/controls/Button'
import BookImage from 'src/components/BookImage'
import BackgroundGradient from 'src/components/Home/BackgroundGradient'

import { push, Routes, Params } from 'src/helpers/navigationService'
import { HomeCardTypeFourModel } from 'src/models/HomeModel'

const Container = styled(BackgroundGradient)`
  margin-vertical: ${({ theme }) => theme.spacing(3)};
`

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
`

const ContentColumn = styled.View``

const Content = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing(2)};
  width: ${({ theme }) => theme.spacing(40)};
`

const Description = styled.View`
  margin-left: ${({ theme }) => theme.spacing(1)};
  flex: 1;
`

const CountText = styled.Text`
  ${({ theme }) => theme.typography.heading1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-left: ${({ theme }) => theme.spacing(2)};
`
const TitleText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
`

const AuthorText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
`

const Spacer = styled.View`
  width: ${({ theme }) => theme.spacing(2)};
`

interface OwnProps {
  content: HomeCardTypeFourModel
}

type Props = OwnProps

const HomeCardFour = ({ content }: Props) => {
  const { contents } = content

  const renderContent = useCallback(
    ({ item, index }) => (
      <ContentColumn>
        {!!item.name && (
          <Header>
            <HeaderText numberOfLines={1}>{item.name}</HeaderText>
            {item.url && (
              <Button
                onPress={() => {
                  push(Routes.HOME__BROWSE, {
                    [Params.BROWSE_URL]: item.url,
                  })
                }}
                linkGreen
              >
                See all
              </Button>
            )}
          </Header>
        )}
        {item.items.map((pdp, count) => (
          <Content
            key={pdp.ean}
            marginTop={!!index}
            onPress={() => {
              push(Routes.PDP__MAIN, { ean: pdp.ean })
            }}
          >
            <BookImage bookOrEan={pdp.ean} size="medium" />
            <CountText>{count + 1}</CountText>
            <Description>
              <TitleText>{pdp.title}</TitleText>
              <AuthorText>{pdp.contributor}</AuthorText>
            </Description>
          </Content>
        ))}
      </ContentColumn>
    ),
    [],
  )

  return (
    <Container>
      <FlatList
        style={{ overflow: 'visible' }}
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

export default HomeCardFour
