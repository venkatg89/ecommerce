import React, { useCallback } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'
import Button from 'src/controls/Button'
import { chunk } from 'lodash'

import BookImage from 'src/components/BookImage'

import { push, Routes, Params } from 'src/helpers/navigationService'

const Container = styled.View`
  ${({ theme, withSpace }) =>
    withSpace ? `margin-vertical: ${theme.spacing(3)};` : ''}
`

const ColumnContainer = styled.View`
  padding-top: ${({ theme }) => theme.spacing(1)};
`

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: ${({ theme }) => theme.spacing(2)};
`

const HeaderText = styled.Text`
  flex: 1;
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
  padding-right: ${({ theme }) => theme.spacing(2)};
`

const Spacer = styled.View`
  width: ${({ theme }) => theme.spacing(3)};
`

const NavigateButton = styled.TouchableOpacity`
  ${({ theme, first }) => (first ? `margin-bottom: ${theme.spacing(3)};` : '')}
  ${({ theme, main }) => (main ? `margin-right: ${theme.spacing(2)};` : '')}
`

interface OwnProps {
  eans: string[]
  header?: string
  seeAllLinkUrl?: string | null
  showFeatured?: boolean
  maxHeight?: number
  maxWidth?: number
}

type Props = OwnProps

const BookCarouselDoubleHorizontalRow = ({
  eans,
  header,
  showFeatured,
  seeAllLinkUrl,
  maxHeight,
  maxWidth,
}: Props) => {
  const renderBook = useCallback(
    (item) => (
      <ColumnContainer>
        {item.item.map((ean, index) => (
          <NavigateButton
            key={ean}
            onPress={() => {
              push(Routes.PDP__MAIN, { ean: ean })
            }}
            first={index === 0}
          >
            <BookImage
              bookOrEan={ ean }
              maxHeight={ maxHeight && ((maxHeight / 2) - 16) } // container 8 + button 24 = 32/2 = 16
              maxWidth={ maxWidth && ((maxWidth / 2) - 8) } // button 16 = 16/2 = 8
            />
          </NavigateButton>
        ))}
      </ColumnContainer>
    ),
    [],
  )

  const renderFeaturedBook = () => {
    if (!showFeatured || eans.length === 0) {
      return null
    }

    return (
      <NavigateButton
        key={eans[0]}
        onPress={() => {
          push(Routes.PDP__MAIN, { ean: eans[0] })
        }}
        main
      >
        <BookImage
          bookOrEan={ eans[0] }
          maxHeight={ maxHeight }
          maxWidth={ maxWidth }
        />
      </NavigateButton>
    )
  }

  return (
    <Container withSpace={eans.length > 0}>
      {!!header && !!eans.length && (
        <Header>
          <HeaderText numberOfLines={1}>{header}</HeaderText>
          {seeAllLinkUrl && (
            <Button
              onPress={() => {
                push(Routes.HOME__BROWSE, {
                  [Params.BROWSE_URL]: seeAllLinkUrl,
                })
              }}
              linkGreen
            >
              See all
            </Button>
          )}
        </Header>
      )}
      <FlatList
        style={{ overflow: 'visible' }}
        ListHeaderComponent={renderFeaturedBook()}
        ItemSeparatorComponent={Spacer}
        horizontal
        data={showFeatured ? chunk(eans, 2).splice(1) : chunk(eans, 2)}
        renderItem={renderBook}
        keyExtractor={(item) => item[0]}
        showsHorizontalScrollIndicator={false}
      />
    </Container>
  )
}

export default BookCarouselDoubleHorizontalRow
