import React from 'react'
import styled from 'styled-components/native'

import WishListItem from './Item'

const Container = styled.ScrollView``

interface OwnProps {
  style?: any
  listIds: string[]
}

type Props = OwnProps

const WishLists = ({ style, listIds }: Props) => {
  return (
    <Container style={ style }>
      { listIds.map(listId => (
        <WishListItem key={listId } id={ listId } />
      )) }
    </Container>
  )
}

export default WishLists
