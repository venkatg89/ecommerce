import React, { useCallback } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'
import FastImage from 'react-native-fast-image'

import BackgroundGradient from 'src/components/Home/BackgroundGradient'

import { push, Routes, Params } from 'src/helpers/navigationService'
import { HomeCardTypeOneModel } from 'src/models/HomeModel'

const Container = styled(BackgroundGradient)`
  margin-vertical: ${({ theme }) => theme.spacing(3)};
`

const Content = styled.TouchableOpacity`
  flex-direction: column;
`

const ContentTextContainer = styled.View`
  flex: 1;
  flex-shrink: 0;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`


const ContentText = styled.Text`
  ${({ theme }) => theme.typography.heading3};
  color: ${({ theme }) => theme.palette.grey1};
  width: ${({ theme }) => theme.spacing(40)};
`

const Image = styled(FastImage)`
  width: ${({ theme }) => theme.spacing(40)};
  height: ${({ theme }) => theme.spacing(30)};
`

const Spacer = styled.View`
  width: ${({ theme }) => theme.spacing(2)};
`

interface OwnProps {
  content: HomeCardTypeOneModel
}

type Props = OwnProps

const HomeCardOne = ({ content }: Props) => {
  const renderContent = useCallback(({ item }) => (
    <Content onPress={ () => { push(Routes.HOME__BROWSE, { [Params.BROWSE_URL]: item.url }) } }>
      <ContentTextContainer>
        <ContentText numberOfLines={2}>{ item.name }</ContentText>
      </ContentTextContainer>
      <Image
        source={{ uri: item.imageSource }}
      />
    </Content>
  ), [])

  return (
    <Container>
      <FlatList
        style={{ overflow: 'visible' }}
        horizontal
        data={content.items}
        renderItem={renderContent}
        keyExtractor={(item) => item.name}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={Spacer}
      />
    </Container>
  )
}

export default HomeCardOne
