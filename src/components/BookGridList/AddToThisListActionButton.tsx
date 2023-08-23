/* eslint-disable react/no-unused-prop-types */
import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import { icons } from 'assets/images'

import Button, { Size } from 'src/controls/Button'

import { Ean } from 'src/models/BookModel'
import { ReadingStatus } from 'src/models/ReadingStatusModel'

import { isBookInCollectionSelector, isBookInReadingStatusSelector, isBookInOnboardingListSelector } from 'src/redux/selectors/myBooks/booksSelector'

const Icon = styled.Image`
  height: ${({ theme }) => theme.spacing(2)};
  width: ${({ theme }) => theme.spacing(2)};
  margin-right: ${({ theme }) => theme.spacing(1)};
`

interface ButtonTextProps {
  size: Size
}

const Text = styled.Text<ButtonTextProps>`
  ${({ theme, size }) => theme.typography.button[size]}
  color: ${({ theme }) => theme.palette.grey1};
  text-transform: uppercase;
`

interface OwnProps {
  style?: any;
  onPress: () => void;
  isAddedOverride?: boolean;
  size?: Size;
  ean: Ean;
  collectionId?: string;
  readingStatus?: ReadingStatus;
  onboarding?: boolean;
}

interface StateProps {
  isInReadingStatus: boolean;
  isInCollection: boolean;
  isInOnboardingList: boolean;
}

const selector = createStructuredSelector({
  isInReadingStatus: isBookInReadingStatusSelector,
  isInCollection: isBookInCollectionSelector,
  isInOnboardingList: (state, ownProps) => {
    const { onboarding, ean } = ownProps as OwnProps
    return (onboarding ? isBookInOnboardingListSelector(state, { ean }) : false)
  },
})

const connector = connect<StateProps, {}, OwnProps>(selector)

type Props = StateProps & OwnProps

const AddBookToThisListButton = ({ style, isAddedOverride, onPress, size = 'small', isInCollection, isInReadingStatus, isInOnboardingList }: Props) => {
  const isAdded = isAddedOverride !== undefined ? isAddedOverride : (isInCollection || isInReadingStatus || isInOnboardingList)

  return (
    <Button
      accessible
      style={ style }
      variant="outlined"
      size={ size }
      onPress={ onPress }
      icon
    >
      <Icon source={ isAdded ? icons.edit : icons.add } />
      <Text
        accessibilityLabel={ isAdded ? 'Book added to this list' : 'Add Book to this List' }
        size={ size }
      >
        { isAdded ? 'In this List' : 'Add to this List' }
      </Text>
    </Button>
  )
}

export default connector(AddBookToThisListButton)
