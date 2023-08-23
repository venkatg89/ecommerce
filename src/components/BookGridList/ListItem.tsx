import React, { memo, useEffect, useCallback, useContext } from 'react'
import { SwipeRow } from 'react-native-swipe-list-view'
import styled, { ThemeContext } from 'styled-components/native'

import { icons } from 'assets/images'

// import AddBookToListButton from 'src/components/LegacyAddBookToList/Button'
import SwipeRemoveComponent from 'src/components/BookGridList/SwipeRemoveComponent'
import BookImage from 'src/components/BookImage'

import { Routes, Params, push } from 'src/helpers/navigationService'
import { Ean, BookOrEan, asEan } from 'src/models/BookModel'
import { ThemeModel } from 'src/models/ThemeModel'

const BOOK_IMAGE_WIDTH = 74
const BOOK_IMAGE_HEIGHT = 104

const Overlay = styled.View`
  background-color: ${({ theme }) => theme.palette.white};
`

const Container = styled.TouchableOpacity``


const SwipeableButtonContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
`

const RowChildren = styled.View`
  flex-direction: row;
`

const Info = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  margin-left: ${({ theme }) => theme.spacing(2)};
`

const Header = styled.View``

const Title = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(0.5)};
`

const Authors = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const ImageContainer = styled.View`
  position: relative;
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

export interface ListItemActionProps {
  ean: string;
  isAddedOverride?: boolean;
  onPress?: () => void;
}

interface OwnProps {
  bookOrEan: BookOrEan
  isActioned?: boolean
  ActionComponent?: React.ComponentType<ListItemActionProps> // react
  onActionPress?: (ean: Ean) => void
  onRemove?: (ean: Ean) => void
  isEditing?: boolean
}

const ListItem = ({ bookOrEan, ActionComponent, onActionPress: _onActionPress, isActioned, onRemove: _onRemove, isEditing }: OwnProps) => {
  const theme = useContext(ThemeContext) as ThemeModel
  // const addBookToListButtonStyle = useMemo(() => ({ padding: theme.spacing(0.5), alignSelf: 'flex-end' }), [])

  // const onActionPress = useCallback(() => { if (_onActionPress) { _onActionPress(asEan(bookOrEan)) } }, [_onActionPress, bookOrEan])
  const onRemove = useCallback(() => { if (_onRemove) { _onRemove(asEan(bookOrEan)) } }, [_onRemove, bookOrEan])

  useEffect(() => {

  }, [isEditing])

  const pushToPdpScreen = useCallback(() => {
    if (typeof bookOrEan === 'object') {
      push(Routes.PDP__MAIN, { [Params.EAN]: bookOrEan!.ean })
    }
  }, [bookOrEan])

  return (
    <SwipeRow
      rightOpenValue={ -theme.spacing(12) }
      disableRightSwipe
      disableLeftSwipe={ !_onRemove || isEditing }
    >
      <SwipeableButtonContainer>
        { _onRemove && (
          <SwipeRemoveComponent onPress={ onRemove } />
        ) }
      </SwipeableButtonContainer>
      <Overlay>
        <Container
          accessible={ false }
          onPress={ pushToPdpScreen }
        >
          <RowChildren
            accessible
            accessibilityLabel={ typeof bookOrEan === 'object' ? `${bookOrEan.name} by ${bookOrEan.authors}` : '' }
            accessibilityRole="button"
          >
            <ImageContainer>
              <BookImage
                bookOrEan={ bookOrEan }
                maxWidth={ BOOK_IMAGE_WIDTH }
                maxHeight={ BOOK_IMAGE_HEIGHT }
                addBookShadow
              />
              { _onRemove && isEditing && (
                <DeleteButton onPress={ onRemove }>
                  <DeleteIcon source={ icons.close } />
                </DeleteButton>
              ) || undefined }
            </ImageContainer>
            <Info
              accessibilityElementsHidden={ typeof bookOrEan !== 'object' }
              importantForAccessibility={ typeof bookOrEan === 'object' ? 'auto' : 'no-hide-descendants' }
            >
              <Header>
                <Title numberOfLines={ 2 }>
                  { typeof bookOrEan === 'object' ? bookOrEan.name : '' }
                </Title>
                <Authors numberOfLines={ 1 } ellipsizeMode="tail">
                  { typeof bookOrEan === 'object' ? bookOrEan.authors : ''}
                </Authors>
              </Header>
              {/* { ActionComponent && (
                <ActionComponent
                  // this is a combination of all the props of all the different action buttons
                  // the unneeded ones will simply not be used
                  ean={ typeof bookOrEan === 'object' ? bookOrEan.ean : '' }
                  isAddedOverride={ isActioned }
                  onPress={ onActionPress }
                />
              ) || <AddBookToListButton style={ addBookToListButtonStyle } ean={ typeof bookOrEan === 'object' ? bookOrEan.ean : '' } /> } */}
            </Info>
          </RowChildren>
        </Container>
      </Overlay>
    </SwipeRow>
  )
}

export default memo(ListItem)
