import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import { BookModel } from 'src/models/BookModel'

import { bookSelector } from 'src/redux/selectors/booksListSelector'

const Container = styled.View`
  margin-top: ${({ theme }) => theme.spacing(2)};
`

const TitleText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1}
  color: ${({ theme }) => theme.palette.grey1};
`

const AuthorText = styled.Text`
  margin-top: ${({ theme }) => theme.spacing(2)};
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey3};
`

interface OwnProps {
  style?: any;
  // eslint-disable-next-line react/no-unused-prop-types
  ean: string;
}

interface StateProps {
  book: BookModel;
}

const selector = createStructuredSelector({
  book: (state, ownProps) => {
    const { ean } = ownProps
    return bookSelector(state, { ean })
  },
})

const connector = connect<StateProps, {}, OwnProps>(selector)

type Props = StateProps & OwnProps

const Details = ({ style, book }: Props) => (
  <Container style={ style }>
    <TitleText numberOfLines={ 2 }>{ book.name }</TitleText>
    <AuthorText numberOfLines={ 1 }>{ book.authors }</AuthorText>
  </Container>
)

export default connector(Details)
