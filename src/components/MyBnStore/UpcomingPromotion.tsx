import React from 'react'
import styled from 'styled-components/native'

import { icons } from 'assets/images'

const Container = styled.TouchableOpacity`
  flex-direction: column;
`

const Title = styled.Text`
  color: ${({ theme }) => theme.font.light};
`

const Text = styled.Text`
  flex: 1;
  color: ${({ theme }) => theme.font.default};
`

const Flex = styled.View`
  flex-direction: row;
  margin-top: 15;
`

const Icon = styled.Image`
  height: 25;
  width: 25;
`

interface Props {
  promotion?: any; // need to figure out how this works
}

// TODO add touchables
const BookClub = ({ promotion }: Props) => (
  <Container>
    <Title>
      Buy a book, get another book
    </Title>
    <Flex>
      <Text>
        { 'Just buy a book and you\'ll get another' }
      </Text>
      <Icon source={ icons.dots } />
    </Flex>
  </Container>
)

export default BookClub
