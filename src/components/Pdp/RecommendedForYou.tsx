import React, { useEffect } from 'react'
import styled from 'styled-components/native'
import { getRecommendedForYouProductsAction } from 'src/redux/actions/pdp/recommendedProducts'
import { createStructuredSelector } from 'reselect'
import { recommendedProductsSelector } from 'src/redux/selectors/pdpSelector'
import { connect } from 'react-redux'
import BookCarouselHorizontalRow from '../BookCarousel/HorizontalRow'

const Container = styled.View`
  background-color: #fafafa;
`

interface StateProps {
  recommendedForYouProducts: string[]
}

interface OwnProps {
  ean: string
}

const selector = createStructuredSelector({
  recommendedForYouProducts: recommendedProductsSelector,
})

interface DispatchProps {
  getRecommendedProduct: (ean: string) => void
}

const dispatcher = (dispatch) => ({
  getRecommendedProduct: (ean) =>
    dispatch(getRecommendedForYouProductsAction(ean)),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps & OwnProps

const RecommendedForYou = ({
  ean,
  recommendedForYouProducts,
  getRecommendedProduct,
}: Props) => {
  useEffect(() => {
    getRecommendedProduct(ean)
  }, [])

  const eanList = recommendedForYouProducts.map((ean) => ean)
  return (
    <Container>
      <BookCarouselHorizontalRow
        header="Recommended for You"
        eans={eanList}
        size="large"
      />
    </Container>
  )
}

export default connector(RecommendedForYou)
