import React from 'react'
import Share from 'react-native-share'
import { connect } from 'react-redux'

import { BookModel } from 'src/models/BookModel'
import { ReviewsStateModel } from 'src/models/PdpModel'
import { addEventAction, LL_PRODUCT_SHARED } from 'src/redux/actions/localytics'

import { makeProductURLFull } from 'src/helpers/generateUrl'
import CtaButton from 'src/controls/navigation/CtaButton'

interface DispatchProps {
  addEvent: (name, attributes) => void
}

const dispatcher = (dispatch) => ({
  addEvent: (name, attributes) => dispatch(addEventAction(name, attributes)),
})
interface OwnProps {
  product: BookModel
  reviews: ReviewsStateModel
}

const connector = connect<{}, DispatchProps, {}>(null, dispatcher)

type Props = OwnProps & DispatchProps

const PdpShare = ({ product, reviews, addEvent }: Props) => {
  const handleClickShare = async () => {
    if (product) {
      const productUrl = makeProductURLFull(product)
      const options = {
        title: 'Share via',
        url: productUrl,
        social: Share.Social.EMAIL,
      }
      try {
        await Share.open(options)

        const productShare = {
          productFormat: product.parentFormat,
          productTitle: product.name,
          productId: product.ean,
          starRating: reviews[product.ean] ? reviews[product.ean].ratings : 0,
          recommend:
            reviews[product.ean] && reviews[product.ean].recommend > 0
              ? 'yes'
              : 'no',
          containSpoilers: 'No Value Set',
          readerTypeDescription: 'No Value Set',
        }
        addEvent(LL_PRODUCT_SHARED, productShare)
      } catch {}
    }
  }

  return (
    <CtaButton share onPress={handleClickShare} accessibilityLabel="share" />
  )
}

export default connector(PdpShare)
