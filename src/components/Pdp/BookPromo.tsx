import React, { useCallback } from 'react'
import styled from 'styled-components/native'
import AuthorRow from 'src/components/Pdp/AuthorRow'
import BookImage from 'src/components/BookImage'
import RatingStars from 'src/components/Pdp/RatingStars'

import { push, Routes, Params } from 'src/helpers/navigationService'
import { PromotionBookModel } from 'src/endpoints/atgGateway/pdp/browseDetails'

const Wrapper = styled.TouchableOpacity`
  background-color: #fafafa;
  padding-vertical: ${({ theme }) => theme.spacing(3)};
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
`

const Container = styled.View`
  flex-direction: row;
`

const CardTitle = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
`

const BookTitle = styled.Text`
  ${({ theme }) => theme.typography.subTitle2};
  color: ${({ theme }) => theme.palette.grey1};
`

const Description = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey1};
  padding-top: ${({ theme }) => theme.spacing(1)};
`

const Information = styled.View`
  flex: 1;
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
`

interface Props {
  style?: any
  book: PromotionBookModel
}

const BookPromo = ({ book, style }: Props) => {
  const goToPdp = useCallback(() => {
    push(Routes.PDP__MAIN, { [Params.EAN]: book.ean })
  }, [book.ean])

  return (
    <Wrapper style={style} onPress={goToPdp}>
      <CardTitle numberOfLines={1}>{book.cardTitle}</CardTitle>
      <Container>
        <BookImage bookOrEan={book.ean} size="large" />
        <Information>
          <BookTitle>{book.name}</BookTitle>
          <AuthorRow book={book} isDisabled />
          <RatingStars ratingLevel={book.averageRating} size={16} isLeft />
          <Description>{book.description}</Description>
        </Information>
      </Container>
    </Wrapper>
  )
}

export default BookPromo
