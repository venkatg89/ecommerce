import React, { useCallback } from 'react'
import { FlatList, Dimensions, Platform } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import styled from 'styled-components/native'
import Button from 'src/controls/Button'

import BookImage from 'src/components/BookImage'

import { push, Routes, Params } from 'src/helpers/navigationService'

const Container = styled.View``

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: ${({ theme }) => theme.spacing(2)};
`

const HeaderText = styled.Text`
  flex: 1;
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme, coloredBackground }) =>
    coloredBackground ? theme.palette.white : theme.palette.grey1};
  padding-right: ${({ theme }) => theme.spacing(2)};
`
const Subtitle = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme, coloredBackground }) =>
    coloredBackground ? theme.palette.white : theme.palette.grey1};
  line-height: 18;
  padding-bottom: ${({ theme }) => theme.spacing(1)};
`

const Description = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme, coloredBackground }) =>
    coloredBackground ? theme.palette.white : theme.palette.grey1};
  line-height: 18;
  padding-bottom: ${({ theme }) => theme.spacing(1)};
`

const Spacer = styled.View`
  width: ${({ theme }) => theme.spacing(2)};
`

const AddToCartButton = styled(Button)`
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing(1)};
  padding-top: ${({ theme }) => theme.spacing(0.5)};
  padding-bottom: ${({ theme }) => theme.spacing(0.5)};
  padding-left: ${({ theme }) => theme.spacing(1)};
  padding-right: ${({ theme }) => theme.spacing(1)};
  margin-left: ${({ theme }) => theme.spacing(1.5)};
`

const ButtonText = styled.Text`
  ${({ theme }) => theme.typography.button.small}
  text-transform: uppercase;
  color: ${({ theme }) => theme.palette.grey1};
  margin-left: ${({ theme }) => theme.spacing(0.5)};
`

const BookContainer = styled.View`
  ${({ overlap, index, surface }) =>
    overlap ? `left: -${surface * index}%;` : ''}
`
interface OwnProps {
  eans: string[]
  size?: string
  disableNavigation?: boolean
  header?: string
  subtitle?: string
  description?: string
  showAddToCartBtn?: boolean
  seeAllLinkUrl?: string | null
  bookCategory?: string
  seeAllText?: string
  handleAddToCart?: (ean: string) => void
  overlap?: boolean
  disableScroll?: boolean
  overflowHidden?: boolean
  coloredBackground?: boolean
  addToCartDisabled?: boolean
}

type Props = OwnProps

const BookCarouselHorizontalRow = ({
  eans,
  size = 'small',
  disableNavigation,
  header,
  subtitle,
  description,
  bookCategory,
  showAddToCartBtn,
  seeAllLinkUrl,
  seeAllText,
  handleAddToCart = () => {},
  overlap,
  disableScroll,
  overflowHidden,
  coloredBackground,
  addToCartDisabled = false,
}: Props) => {
  const renderBook = useCallback(
    (ean) => {
      if (disableNavigation) {
        return (
          <BookContainer
            overlap={overlap}
            index={ean.index}
            surface={0.1 * (Dimensions.get('window').width - 32)}
          >
            <BookImage bookOrEan={ean.item} size={size} />
          </BookContainer>
        )
      } else {
        return (
          <BookContainer
            overlap={overlap}
            index={ean.index}
            surface={0.1 * (Dimensions.get('window').width - 32)}
          >
            <TouchableOpacity
              accessible={true}
              onPress={() => {
                push(Routes.PDP__MAIN, { ean: ean.item })
              }}
            >
              <BookImage bookOrEan={ean.item} size={size} />
            </TouchableOpacity>
            {showAddToCartBtn && (
              <AddToCartButton
                variant="outlined"
                icon
                size="small"
                disabled={addToCartDisabled}
                onPress={() => handleAddToCart(ean.item)}
              >
                <ButtonText>Add To Cart</ButtonText>
              </AddToCartButton>
            )}
          </BookContainer>
        )
      }
    },
    [size, disableNavigation, overlap],
  )

  return (
    <Container>
      {!!header && !!eans.length && (
        <Header>
          <HeaderText numberOfLines={1} coloredBackground={!!coloredBackground}>
            {header}
          </HeaderText>
          {seeAllLinkUrl && (
            <Button
              onPress={() => {
                if (seeAllLinkUrl.substring(0, 2) === '/w') {
                  const product = seeAllLinkUrl.split('ean=')[1]
                  product
                    ? push(Routes.PDP__MAIN, { ean: product })
                    : push(Routes.HOME__BROWSE, {
                        [Params.BROWSE_URL]: seeAllLinkUrl,
                      })
                } else {
                  push(Routes.HOME__BROWSE, {
                    [Params.BROWSE_URL]: seeAllLinkUrl,
                  })
                }
              }}
              linkGreen={!coloredBackground}
              textStyle={coloredBackground ? { color: 'white' } : {}}
            >
              {seeAllText ? seeAllText : 'See all'}
            </Button>
          )}
        </Header>
      )}
      {!!subtitle && !!eans.length && (
        <Subtitle coloredBackground={!!coloredBackground}>{subtitle}</Subtitle>
      )}
      {!!description && !!eans.length && (
        <Description coloredBackground={!!coloredBackground}>
          {description}
        </Description>
      )}
      <FlatList
        style={[
          {
            overflow: overflowHidden ? 'hidden' : 'visible',
          },
          //if we don't enforce the width, the last images are being cut on android
          Platform.OS === 'android' ? { minWidth: 600 } : {},
        ]}
        ItemSeparatorComponent={!overlap && Spacer}
        horizontal
        data={eans}
        renderItem={renderBook}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={!disableScroll}
      />
    </Container>
  )
}

export default BookCarouselHorizontalRow
