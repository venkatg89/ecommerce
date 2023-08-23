import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { StyleSheet } from 'react-native'
import styled from 'styled-components/native'

import Section from 'src/controls/layout/Section'
import CtaButton from 'src/controls/layout/Section/CtaButton'
import {
  CONTENT_HORIZONTAL_PADDING,
  useResponsiveDimensions,
} from 'src/constants/layout'

import BookCarousel from 'src/components/LegacyBookCarousel'
import CollectionEmptyState from 'src/controls/EmptyState/CollectionEmptyState'
import _Button from 'src/controls/Button'

import { Ean, BookOrEan } from 'src/models/BookModel'

import { booksOrEanListSelector } from 'src/redux/selectors/booksListSelector'

const EmptyStateContainer = styled.View``

const Title = styled.Text`
  flex: 1;
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
`
const Button = styled(_Button)`
  margin-vertical: ${({ theme }) => theme.spacing(3)};
`

interface OwnProps {
  title: string
  // eslint-disable-next-line react/no-unused-prop-types
  eans: Ean[]
  onPressSeeAll?: () => void
  errorText1?: string
  errorText2?: string
  onAddToList?: () => void
  emptyButtonText?: string
  size?: string
}

interface StateProps {
  bookOrEanList: BookOrEan[]
}

const selector = createStructuredSelector({
  bookOrEanList: (state, ownProps) => {
    const { eans } = ownProps
    return booksOrEanListSelector(state, { eans })
  },
})

const connector = connect<StateProps, {}, {}>(selector)

type Props = OwnProps & StateProps

const styles = StyleSheet.create({
  container: {
    marginHorizontal: -CONTENT_HORIZONTAL_PADDING,
  },
  buttonText: {
    textTransform: 'uppercase',
  },
})

const BookListSection = ({
  title,
  onPressSeeAll,
  bookOrEanList,
  errorText1,
  errorText2,
  onAddToList,
  emptyButtonText,
  size = 'small',
}: Props) => {
  const { width } = useResponsiveDimensions()
  const containerStyle = useMemo(
    () => ({
      marginHorizontal: -CONTENT_HORIZONTAL_PADDING(width),
    }),
    [width],
  )

  if (bookOrEanList.length < 1) {
    return (
      <EmptyStateContainer>
        <Title>{title}</Title>
        <CollectionEmptyState
          errorText1={errorText1 || ''}
          errorText2={errorText2 || ''}
        />
        <Button
          variant="outlined"
          onPress={onAddToList}
          center
          linkGreen
          textStyle={styles.buttonText}
        >
          {emptyButtonText}
        </Button>
      </EmptyStateContainer>
    )
  }

  return (
    <Section
      title={title}
      onPress={onPressSeeAll}
      ctaButton={<CtaButton title="See All" onPress={onPressSeeAll!} />}
    >
      <BookCarousel
        style={containerStyle}
        bookOrEanList={bookOrEanList}
        bookMaxHeight={160}
        bookMaxWidth={112}
        rightPadTypeMobile="book-width"
        leftPadTypeTablet="content-padding"
        rightPadTypeTablet="content-padding"
        spacingSize={2}
        size={size}
      />
    </Section>
  )
}

export default connector(BookListSection)
