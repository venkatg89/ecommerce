import React from 'react'
import IMAGES from 'assets/images'
import styled from 'styled-components/native'
import { VIEW_EDITORIAL_REVIEWS, VIEW_OVERVIEW } from './OverviewComponent'

const Container = styled.View``

const Divider = styled.View`
  margin-top: ${({ theme }) => theme.spacing(2)};
`

const ContentText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  font-size: 16;
  color: ${({ theme }) => theme.palette.grey1};

`
const Banner = styled.Image`
  margin-top: ${({ theme }) => theme.spacing(2)};
  height:44;
  width:272;
`
interface Props {
  booksellerContent: string
  numberOfLines?: number
  contentType? : string
}
const BooksellerComponent = ({ booksellerContent, numberOfLines, contentType }: Props) => {
  return (
    <Container>
      {contentType === VIEW_OVERVIEW && <Banner source={IMAGES.booksellerContent} /> }
      {contentType === VIEW_EDITORIAL_REVIEWS && <Divider />}
      <ContentText numberOfLines={numberOfLines} elipsizeMode="tail">
        {booksellerContent}
      </ContentText>
    </Container>
  )
}

export default BooksellerComponent
