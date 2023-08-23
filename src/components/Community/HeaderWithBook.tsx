import React, { useCallback, useContext } from 'react'
import styled, { ThemeContext } from 'styled-components/native'

import BookImage from 'src/components/BookImage'

import { BookModel } from 'src/models/BookModel'
import { push, Routes, Params } from 'src/helpers/navigationService'

const Container = styled.TouchableOpacity`
  flex-direction: row;
  margin-bottom:${({ theme }) => theme.spacing(3)};
`

const Title = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
`

const Description = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  margin-top: ${({ theme }) => theme.spacing(2)};
`

const Information = styled.View`
  flex: 1;
  padding-right: ${({ theme }) => theme.spacing(2)};
`

interface Props {
  style?: any
  title: string
  book: BookModel
  desc: string
}

const HeaderWithBook = ({ book, title, desc, style }: Props) => {
  const { spacing } = useContext(ThemeContext)

  const goToPdp = useCallback(() => {
    push(Routes.PDP__MAIN, { [Params.EAN]: book.ean })
  }, [book])

  return (
    <Container style={ style } onPress={ goToPdp }>
      { (title && desc) && (
        <Information>
          <Title>{title}</Title>
          <Description>{desc}</Description>
        </Information>
      ) || undefined }
      <BookImage bookOrEan={ book } maxWidth={ spacing(12) } maxHeight={ spacing(20) } />
    </Container>
  )
}

export default HeaderWithBook
