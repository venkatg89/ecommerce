import React, { memo, useCallback } from 'react'
import styled from 'styled-components/native'

import { icons } from 'assets/images'

import BookImage from 'src/components/BookImage'
import { ListItemActionProps } from './ListItem'

import { Ean, BookOrEan, asEan } from 'src/models/BookModel'
import { ReadingStatusListItem } from 'src/models/ReadingStatusModel'

import { Routes, Params, push } from 'src/helpers/navigationService'

interface ContainerProps {
  gridSpacingHorizontal: number
  gridSpacingVertical?: number
}

const Container = styled.View<ContainerProps>`
  flex-direction: column;
  align-items: center;
  height: auto;
  width: auto;
  margin-right: ${({ gridSpacingHorizontal }) => gridSpacingHorizontal};
  margin-bottom: ${({ gridSpacingVertical, gridSpacingHorizontal }) => gridSpacingVertical || gridSpacingHorizontal};
`

const BookContainer = styled.TouchableOpacity`
  position: relative;
  align-items: center;
  justify-content: center;
`

const DeleteButton = styled.TouchableOpacity`
  position: absolute;
  top: ${({ theme }) => -theme.spacing(1)};
  left: ${({ theme }) => -theme.spacing(1)};
  height: ${({ theme }) => theme.spacing(3)};
  width: ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.spacing(1.5)};
  background-color: ${({ theme }) => theme.palette.supportingError};
  justify-content: center;
  align-items: center;
`

const DeleteIcon = styled.Image`
  height: ${({ theme }) => theme.spacing(2)};
  width: ${({ theme }) => theme.spacing(2)};
  tint-color: ${({ theme }) => theme.palette.white};
`

interface Props {
  bookOrEan: BookOrEan
  libraryBook?: ReadingStatusListItem
  showingDateInsteadOfStatus?: boolean
  gridSpacingHorizontal: number
  gridSpacingVertical?: number
  width: number
  height: number
  ActionComponent?: React.ComponentType<ListItemActionProps>
  isActioned?: boolean
  onActionPress?: (ean: Ean) => void
  onRemove?: (ean: Ean) => void
  isEditing?: boolean
}

// These work well as decision chains in basic react components
/* eslint-disable no-nested-ternary */

const GridItem = ({
  bookOrEan, libraryBook, showingDateInsteadOfStatus, width, height, gridSpacingHorizontal,
  gridSpacingVertical, ActionComponent, isActioned, onActionPress: _onActionPress, isEditing, onRemove: _onRemove,
}: Props) => {
  const onActionPress = useCallback(() => { if (_onActionPress) { _onActionPress(asEan(bookOrEan)) } }, [_onActionPress, bookOrEan])
  const onRemove = useCallback(() => { if (_onRemove) { _onRemove(asEan(bookOrEan)) } }, [_onRemove, bookOrEan])

  return (
    <Container gridSpacingHorizontal={ gridSpacingHorizontal } gridSpacingVertical={ gridSpacingVertical }>
      <BookContainer
        onPress={ () => typeof bookOrEan === 'object' && push(Routes.PDP__MAIN, { [Params.EAN]: bookOrEan.ean }) }
      >
        <BookImage
          bookOrEan={ bookOrEan }
          maxHeight={ height }
          maxWidth={ width }
          addBookShadow
        />
        { _onRemove && isEditing && (
          <DeleteButton onPress={ onRemove }>
            <DeleteIcon source={ icons.close } />
          </DeleteButton>
        ) || undefined }
      </BookContainer>
      { ActionComponent && (
        <ActionComponent
          ean={ asEan(bookOrEan) }
          isAddedOverride={ isActioned }
          onPress={ onActionPress }
        />
      ) }
    </Container>
  )
}

export default memo(GridItem)
