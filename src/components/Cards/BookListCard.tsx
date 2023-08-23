import React, { useMemo } from 'react'
import styled from 'styled-components/native'

import BookImage from 'src/components/BookImage'
import { Ean } from 'src/models/BookModel'

import Images, { icons } from 'assets/images'


const Container = styled.TouchableOpacity<Pick<OwnProps, 'last'>>`
  background-color: ${({ theme }) => theme.palette.white};
  border-radius: 3;
  border-width: 0.5;
  border-style: solid;
  border-color: ${({ theme }) => theme.border.color};
  shadow-offset: 0px 0px;
  shadow-color: black;
  shadow-radius: 5px;
  shadow-opacity: 0.18;
  margin-vertical: ${({ theme }) => theme.spacing(1)};

  width: ${({ theme }) => theme.spacing(31)};
  min-height: 142;
  ${({ theme, last }) => !last && `margin-right: ${theme.spacing(2)};`}
`

const Content = styled.View`
  flex: 1;
  padding-left: ${({ theme }) => theme.spacing(1)};
  padding-top: ${({ theme }) => theme.spacing(1)};
`

const Title = styled.Text`
  color: ${({ theme }) => theme.palette.grey1};
  ${({ theme }) => theme.typography.subTitle2}
  margin-bottom: ${({ theme }) => theme.spacing(1)}px;
`

const CaptionWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  margin-right: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const Caption = styled.Text`
  color: ${({ theme }) => theme.palette.grey2};
  ${({ theme }) => theme.typography.caption}
`

const Icon = styled.Image`
  width: 16;
  height: 16;
`

const BooksContainer = styled.View`
  flex-direction: row;
  overflow: hidden;
`

const ImageWrapper = styled.View`
 margin-right: ${({ theme }) => -theme.spacing(2)};
`

const EmptyImage = styled.Image`
  width: 82;
  height: 82;
`

const EmptyImageWrapper = styled.View`
  align-items: center;
  flex: 1;
`

type OwnProps = {
  title: string
  details?: string
  eans: Ean[]
  onSeeFullList: () => void
  last: boolean
  isPrivate?: boolean
  style?: any
}

type Props = OwnProps

const BookListCard = ({ title, style, onSeeFullList, last, details, eans, isPrivate }: Props) => {
  const renderBookCard = useMemo(() => {
    if (eans.length > 0) {
      return eans.map(ean => (
        <ImageWrapper key={ ean }>
          <BookImage
            maxWidth={ 54 }
            maxHeight={ 77 }
            bookOrEan={ ean }
            key={ ean }
          />
        </ImageWrapper>
      ))
    }
    return (
      <EmptyImageWrapper>
        <EmptyImage source={ Images.bookStack } />
      </EmptyImageWrapper>
    )
  }, [JSON.stringify(eans)])

  return (
    <Container onPress={ onSeeFullList } last={ last }>
      <Content style={ style }>
        <Title
          accessibilityLabel={ `${title}.` }
        >
          { title }
        </Title>
        <CaptionWrapper>
          <Caption
            accessibilityLabel={ `${details}.` }
          >
            {details}
          </Caption>
          {isPrivate && <Icon source={ icons.lockClosed } />}
        </CaptionWrapper>
        <BooksContainer accessible={ false }>
          { renderBookCard }
        </BooksContainer>
      </Content>
    </Container>
  )
}


export default BookListCard
