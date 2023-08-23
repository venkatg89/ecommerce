import React from 'react'
import styled from 'styled-components/native'

import _BookImage from 'src/components/BookImage'

import { icons } from 'assets/images'
import { toWeekdayCommaDayMonthYearAtTime } from 'src/helpers/dateFormatters'

const Container = styled.View`
  flex-direction: column;
`

const Row = styled.View`
  flex-direction: row;
`

const Column = styled.View`
  flex-direction: column;
  margin-left: 10;
  flex: 1;
`

const BookImage = styled(_BookImage)`
  flex-direction: column;

`

interface TextProps {
  marginTop?: number;
}

const Text = styled.Text<TextProps>`
  flex: 1;
  color: ${({ theme }) => theme.font.light};
  ${({ marginTop }) => (marginTop ? `margin-top: ${marginTop};` : '')}
`

const LightText = styled(Text)`
  color: ${({ theme }) => theme.font.inactive};
`

const Icon = styled.Image`
  height: 25;
  width: 25;
`

const Button = styled.TouchableOpacity`
  flex-direction: row;
  margin-top: 8;
`

interface Props {
  bookClub: any; // need to figure out how this works
}

/*
  TODO figure out of this contains the book data or need to get it separately
  title: 'Reading book title',
  author: 'Amazing writer',
  description: 'blah blah blah',
  date: new Date(Date.now()),
*/

// TODO add touchables
const BookClub = ({ bookClub }: Props) => (
  <Container>
    <Row>
      <BookImage
        bookOrEan="9781426307553"
        maxWidth={ 66 }
        maxHeight={ 66 * 1.4 }
      />
      <Column>
        <LightText>
          { bookClub.title }
        </LightText>
        <Text marginTop={ 4 }>
          { bookClub.author }
        </Text>
        <Text marginTop={ 8 }>
          { bookClub.description }
        </Text>
      </Column>
    </Row>
    <Button>
      <LightText numberOfLines={ 3 }>
        { `Meet and discuss this book in-store on ${toWeekdayCommaDayMonthYearAtTime(bookClub.date)}` }
      </LightText>
      <Icon source={ icons.forward } />
    </Button>
  </Container>
)

export default BookClub
