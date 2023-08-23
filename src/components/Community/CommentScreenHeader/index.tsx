import React, { Fragment } from 'react'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'

import HeaderWithBook from 'src/components/Community/HeaderWithBook'

import { BookModel, Ean } from 'src/models/BookModel'
import { bookSelector } from 'src/redux/selectors/booksListSelector'
import { isEmpty } from 'src/helpers/objectHelpers'

interface OwnProps {
  // eslint-disable-next-line react/no-unused-prop-types
  ean: Ean
}

interface StateProps {
  book: BookModel
}

const selector = createStructuredSelector({
  book: bookSelector,
})

const connector = connect<StateProps, null, OwnProps>(selector)

type Props = OwnProps & StateProps

const CommentScreenHeader = ({ book }: Props) => {
  if (isEmpty(book)) {
    return <Fragment />
  }
  const { name, authors } = book
  return (
    <HeaderWithBook book={ book } title="Tell Us Why" desc={ `You selected ${name} by ${authors}` } />
  )
}

export default connector(CommentScreenHeader)
