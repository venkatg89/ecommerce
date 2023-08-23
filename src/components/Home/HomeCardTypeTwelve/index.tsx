import React from 'react'
import styled from 'styled-components/native'

import { HomeCardTypeTwelveModel } from 'src/models/HomeModel'
import { icons } from 'assets/images'
import { push, Routes, Params } from 'src/helpers/navigationService'

const Container = styled.View`
  margin-vertical: ${({ theme }) => theme.spacing(3)};
`

const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.subTitle2}
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  text-transform: uppercase;
`

const Divider = styled.View`
  height: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.palette.grey5};
`

const ItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-vertical: ${({ theme }) => theme.spacing(1.5)};
`

const ItemText = styled.Text`
  flex: 1;
  ${({ theme }) => theme.typography.subTitle2}
  color: ${({ theme }) => theme.palette.grey1};
  text-transform: uppercase;
`

const Icon = styled.Image`
  height: ${({ theme, large }) => theme.spacing(large ? 3 : 2)};
  width: ${({ theme, large }) => theme.spacing(large ? 3 : 2)};
  margin-right: ${({ theme }) => theme.spacing(1)};
`

interface OwnProps {
  content: HomeCardTypeTwelveModel
}

type Props = OwnProps

const HomeCardTwelve = ({ content }: Props) => {
  const { items, name } = content
  return (
    <Container>
      <HeaderText>{name}</HeaderText>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {!!index && <Divider />}
          <ItemContainer
            onPress={() => {
              push(Routes.HOME__BROWSE, { [Params.BROWSE_URL]: item.url })
            }}
          >
            <Icon large source={{ uri: item.iconUrl }} />
            <ItemText>{item.name}</ItemText>
            <Icon source={icons.arrowRight} />
          </ItemContainer>
        </React.Fragment>
      ))}
    </Container>
  )
}

export default HomeCardTwelve
