import React, { useCallback, useEffect, useState } from 'react'

import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { Rating } from 'react-native-rating-element'

import { saveForLaterListSelector } from 'src/redux/selectors/saveForLaterListSelector'
import { SaveForLaterListModel } from 'src/models/SaveForLaterListModel'

import styled from 'styled-components/native'
import Button from 'src/controls/Button'
import { icons, nav } from 'assets/images'
import {
  addItemToSaveForLaterListAction,
  removeSaveForLaterItemAction,
  getSaveForLaterListAction,
  moveSaveForLaterItemToCartAction,
} from 'src/redux/actions/saveForLaterList/saveForLaterAction'
import { isDigital } from 'src/constants/skutypes'
import {
  getBooksDetails,
  normalizeAtgBookDetailsToBookModelArray,
} from 'src/endpoints/atgGateway/pdp/booksDetails'
import { BookModel } from 'src/models/BookModel'

const MEDIUM_BOOK_HEIGHT = 104
const MEDIUM_BOOK_WIDTH = 74

const Container = styled.View`
  flex: 1;
  position: relative;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.palette.lightGrey};
  border-top-width: 1;
  border-top-color: ${({ theme }) => theme.palette.grey5};
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-right: ${({ theme }) => theme.spacing(2)};
  padding-top: ${({ theme }) => theme.spacing(3)};
`
const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  align-items: center;
`

const MainSectionTitle = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
`

const MainSubTitle = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  margin-right: ${({ theme }) => theme.spacing(2)};
`

const BookDetailsContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: flex-start;
`
const BookNameText = styled.Text`
  flex: 1;
  ${({ theme }) => theme.typography.subTitle2};
  color: ${({ theme }) => theme.palette.grey1};
  ${({ ignoreTextTransform }) =>
    ignoreTextTransform ? '' : 'text-transform: capitalize;'}
  margin-bottom: 4;
`

const BookImage = styled.Image`
  margin-right: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  width: ${MEDIUM_BOOK_WIDTH};
  height: ${MEDIUM_BOOK_HEIGHT};
`

const ButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
`

const ButtonText = styled.Text`
  ${({ theme }) => theme.typography.button.small}
  text-transform: uppercase;
  color: ${(props) =>
    props.buttonType === 'link'
      ? props.theme.palette.linkGreen
      : props.theme.palette.grey1};
  margin-left: 2;
`

const Icon = styled.Image`
  height: ${({ theme }) => theme.spacing(2)};
  width: ${({ theme }) => theme.spacing(2)};
`

const AddToCartButton = styled(Button)`
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing(1)};
  height: 24;
  padding-top: 4;
  padding-bottom: 4;
  padding-left: ${({ theme }) => theme.spacing(1)};
  padding-right: ${({ theme }) => theme.spacing(1)};
`

const Column = styled.View`
  flex-direction: column;
  flex: 1;
  padding-bottom: 20;
  margin-left: 4;
  margin-right: 4;
`

const PriceFormatContainer = styled.View`
  flex-direction: row;
`
const PricesContainer = styled.View`
  flex-direction: row;
  margin-vertical: ${({ theme }) => theme.spacing(1)};
`

const OriginalPriceText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey3};
  text-align: left;
  padding-left: ${({ theme }) => theme.spacing(0.5)};
  text-decoration: line-through;
`

const PriceText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey1};
  font-weight: bold;
  text-align: left;
`

const FormatText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  text-align: left;
  padding-left: ${({ theme }) => theme.spacing(2)};
`

const AuthorText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey1};
  text-align: left;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const DigitalText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  text-align: left;
`

const RatingsContainer = styled.View`
  flex-direction: row;
`

const RatingsText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  text-align: left;
  margin-left: ${({ theme }) => theme.spacing(1)};
`

interface StateProps {
  saveForLaterList: SaveForLaterListModel
}

const selector = createStructuredSelector<any, StateProps>({
  saveForLaterList: saveForLaterListSelector,
})

interface DispatchProps {
  addItemToSaveForLaterList: (params) => boolean
  removeItemToSaveForLaterList: (params) => boolean
  getSaveForLaterList: () => void
  moveItemToSaveForLaterList: (params) => void
}

const dispatcher = (dispatch) => ({
  addItemToSaveForLaterList: (params) =>
    dispatch(addItemToSaveForLaterListAction(params)),
  moveItemToSaveForLaterList: (params) =>
    dispatch(moveSaveForLaterItemToCartAction(params)),
  removeItemToSaveForLaterList: (params) =>
    dispatch(removeSaveForLaterItemAction(params)),
  getSaveForLaterList: () => dispatch(getSaveForLaterListAction()),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps

const SaveForLater = ({
  saveForLaterList,
  addItemToSaveForLaterList,
  removeItemToSaveForLaterList,
  getSaveForLaterList,
  moveItemToSaveForLaterList,
}: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [items, setItems] = useState<BookModel[]>([])

  useEffect(() => {
    load()
  }, [saveForLaterList])

  const load = useCallback(async () => {
    setIsLoading(true)
    const eans = Object.keys(saveForLaterList).map(
      (item) => saveForLaterList[item].skuId,
    )
    // avoid API calls if no previously viewed items
    if (eans.length !== 0) {
      const response = await getBooksDetails(eans)
      if (response.ok) {
        const normalizedDetails = normalizeAtgBookDetailsToBookModelArray(
          response.data,
        )
        setItems(normalizedDetails)
      }
    }
    setIsLoading(false)
  }, [saveForLaterList])

  const onPressRemove = async (id) => {
    setIsLoading(true)
    await removeItemToSaveForLaterList({
      itemId: id,
    })
    setIsLoading(false)
  }

  const onPressAddToCart = async (id, skuId, productId) => {
    setIsLoading(true)
    await moveItemToSaveForLaterList({
      itemIds: id,
      catalogRefIds: skuId,
      productId: productId,
    })
    setIsLoading(false)
  }

  if (Object.keys(saveForLaterList).length === 0 || items.length === 0) {
    return <></>
  }

  return (
    <Container>
      <TitleContainer>
        <MainSectionTitle>Saved for Later</MainSectionTitle>
        <MainSubTitle>
          {Object.keys(saveForLaterList).length} items
        </MainSubTitle>
      </TitleContainer>

      {items.length > 0 &&
        Object.keys(saveForLaterList).map((item, index) => (
          <BookDetailsContainer key={index}>
            <BookImage
              resizeMode="contain"
              source={{ uri: saveForLaterList[item].imageUrls[0] }}
            />
            <Column>
              <BookNameText>{saveForLaterList[item].productName}</BookNameText>
              <AuthorText>
                {items[index]?.authors.contributors[0].name}
              </AuthorText>
              <RatingsContainer>
                <Rating
                  rated={saveForLaterList[item].rating}
                  totalCount={5}
                  size={16}
                  direction="row"
                  type="custom"
                  selectedIconImage={icons.fullStar}
                  emptyIconImage={icons.emptyStar}
                />
                <RatingsText>{items[index]?.reviewCount} reviews</RatingsText>
              </RatingsContainer>
              <PriceFormatContainer>
                <PricesContainer>
                  {items[index]?.salePrice &&
                  items[index]?.listPrice !== items[index]?.salePrice ? (
                    <>
                      <PriceText>
                        ${items[index]?.salePrice?.toFixed(2)}
                      </PriceText>
                      <OriginalPriceText>
                        {'$' + items[index]?.listPrice?.toFixed(2)}
                      </OriginalPriceText>
                    </>
                  ) : (
                    <PriceText>
                      {'$' + items[index]?.listPrice.toFixed(2)}
                    </PriceText>
                  )}

                  <FormatText>{items[index]?.parentFormat}</FormatText>
                </PricesContainer>
              </PriceFormatContainer>
              <ButtonsContainer>
                {items.length > 0 &&
                index < items.length &&
                !isDigital(items[index]?.skuType) ? (
                  <>
                    <AddToCartButton
                      variant="outlined"
                      icon
                      size="small"
                      onPress={() => {
                        onPressAddToCart(
                          saveForLaterList[item].id,
                          saveForLaterList[item].skuId,
                          saveForLaterList[item].productId,
                        )
                      }}
                      showSpinner={isLoading}
                    >
                      <Icon source={nav.tabs.cart} />
                      <ButtonText>Move To Cart</ButtonText>
                    </AddToCartButton>
                    <Button
                      onPress={() => onPressRemove(saveForLaterList[item].id)}
                      size={'small'}
                      flex
                    >
                      <ButtonText buttonType={'link'}>Remove</ButtonText>
                    </Button>
                  </>
                ) : (
                  <DigitalText>
                    This item cannot be purchased in app.
                  </DigitalText>
                )}
              </ButtonsContainer>
            </Column>
          </BookDetailsContainer>
        ))}
    </Container>
  )
}

export default connector(SaveForLater)
