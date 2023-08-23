import React from 'react'
import styled from 'styled-components/native'
import { BookModel } from 'src/models/BookModel'
import HomeDiscoveryProductGrid from 'src/components/LegacyBookCarousel/TwoRowCarousel'

const Container = styled.View`
  padding-top: ${({ theme }) => theme.spacing(3)}px;
  padding-bottom: ${({ theme }) => theme.spacing(3)}px;
  ${({ theme }) => theme.innerBoxShadow.container};
`
const Text = styled.Text`
  text-align: center;
  ${({ theme }) => theme.typography.heading2};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
`

interface Props {
  bookOrEanList: BookModel[]
  title: string
}

export default ({ bookOrEanList, title }: Props) => {
  return (
    <Container>
      <Text accessibilityRole="header">{title}</Text>
      <HomeDiscoveryProductGrid bookOrEanList={bookOrEanList} size="medium" />
    </Container>
  )
}
