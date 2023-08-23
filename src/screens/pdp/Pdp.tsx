import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useContext,
} from 'react'
import { Linking } from 'react-native'
import { connect } from 'react-redux'
import { NavigationEvents, NavigationInjectedProps } from 'react-navigation'
import styled, { ThemeContext } from 'styled-components/native'
import config from 'config'

import Container from 'src/controls/layout/ScreenContainer'
import Section from 'src/controls/layout/Section'
import ScrollContainer from 'src/controls/layout/ScrollContainer'
import Header from 'src/controls/navigation/Header'
import Button, { Variant } from 'src/controls/Button'
import Alert from 'src/controls/Modal/Alert'

import BookHeader from 'src/components/Pdp/BookHeader'
import AvailableFormats from 'src/components/Pdp/AvailableFormats'
import _AddToWishListButton from 'src/components/AddPdpToWishList'
import { addProtectionPlanToOrder } from 'src/endpoints/atgGateway/cart'

import PdpShare from 'src/components/CtaButtons/PdpShare'
import RadioButton from 'src/controls/Button/RadioButton'

import htmlToText from 'src/helpers/ui/htmlToText'
import {
  getContentContainerStyle,
  getContentContainerStyleWithAnchor,
  useResponsiveDimensions,
} from 'src/constants/layout'

import Routes, { Params } from 'src/constants/routes'

import { Ean, BookModel, NookListItem } from 'src/models/BookModel'
import { BookDetails, ReviewsStateModel } from 'src/models/PdpModel'
import { QuestionModel } from 'src/models/Communities/QuestionModel'
import { fetchBookAndRelatedQuestionsAction } from 'src/redux/actions/book/bookAction'
import { fetchBookDetailsAction } from 'src/redux/actions/book/bookDetails'
import { fetchBookRecommendedBooksAction } from 'src/redux/actions/book/bookRecommendedBooks'
import { fetchBookCurrentlyReadingUsersWithEanAction } from 'src/redux/actions/book/workIdReadingList'
import { fetchNookLockerAction } from 'src/redux/actions/user/nodeProfileActions'
import OverviewComponent, {
  VIEW_EDITORIAL_REVIEWS,
  VIEW_OVERVIEW,
} from 'src/components/Pdp/OverviewComponent'

import { bookInNookLibrarySelector } from 'src/redux/selectors/booksListSelector'
import {
  isBusyFetchingPdp,
  pdpBookDetailsSelector,
  currentlyReadingUserIdsFromEanSelector,
  pdpBookRelatedQuestionsSelector,
  pdpBookRecommendedBookIdsSelector,
  reviewsSelector,
} from 'src/redux/selectors/pdpSelector'

import {
  addEventAction,
  LL_PRODUCT_VIEWED,
  LL_PRODUCT_DETAILS_VIEWED,
  LL_ADD_TO_CART,
} from 'src/redux/actions/localytics'
import { ThemeModel } from 'src/models/ThemeModel'
import AdditionalInfoTab from 'src/components/Pdp/AdditionalInfoTab'
import { navigate } from 'src/helpers/navigationService'
import {
  contributorsHelper,
  productDetailsHelper,
} from 'src/helpers/productDetailsHelper'
import {
  getBooksDetails,
  normalizeAtgBookDetailsToBookModelArray,
} from 'src/endpoints/atgGateway/pdp/booksDetails'
import Availability from 'src/components/Pdp/Availability'
import { bopisInventoryLookupInStore } from 'src/endpoints/bopis/stores'
import {
  addItemAsBopis,
  AddItemData,
  addItemToCart,
} from 'src/endpoints/atgGateway/cart'
import {
  fetchFavoriteStoreAction,
  setFavoriteStoreAction,
} from 'src/redux/actions/store/favorite'
import { bopisStoreSelector } from 'src/redux/selectors/bopisStore'
import { StoreModel } from 'src/models/StoreModel'
import { Vibration, TouchableOpacity } from 'react-native'
import { fetchNearestStoreAction } from 'src/redux/actions/store/search'
import { permissionDeniedAction } from 'src/redux/actions/permissions/request'
import { getReviewsAction } from 'src/redux/actions/pdp/bazaarvoice'
import RecommendedForYou from 'src/components/Pdp/RecommendedForYou'
import { getRecentlyViewedAction } from 'src/redux/actions/pdp/recentlyViewed'

import {
  setItemPickupStoreAction,
  StorePickupParams,
} from 'src/redux/actions/shop/cartAction'
import { ErrorMessage } from 'src/models/FormModel'
import { setActiveGlobalModalAction } from 'src/redux/actions/modals/globalModals'
import { setformErrorMessagesAction } from 'src/redux/actions/form/errorsAction'
import { GlobalModals } from 'src/constants/globalModals'
import { PDP_ERROR_MODAL } from 'src/constants/formErrors'
import { BookDetailsState } from 'src/redux/reducers/PdpReducer/BookDetailsReducer'
import _ReadSample from '../home/ReadSample'
import CustomerReviewsSection from 'src/components/Pdp/ReadReviews/CustomerReviewsSection'
import { favoriteStoreSelector } from 'src/redux/selectors/myBn/storeSelector'
import { ShopCartModel } from 'src/models/ShopModel/CartModel'
import { shopCartSelector } from 'src/redux/selectors/shopSelector'
import { isDigital, SKU_TYPES } from 'src/constants/skutypes'
import LoadingIndicator from 'src/controls/progress/LoadingIndicator'
import PriceHeader from 'src/components/Pdp/PriceHeader'
import { setBopisStoreAction } from 'src/redux/actions/pdp/bopisStore'

const FlexRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const FlexRowContent = styled.View`
  flex: 1;
  max-width: 50%;
  margin-right: ${({ marginRight, theme }) =>
    marginRight ? theme.spacing(1) : 0};
`

const ActivityIndicator = styled(LoadingIndicator)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
  background-color: #fff9;
`

const NookButton = styled(Button)``

const AddToCartButton = styled(Button)``

const AddToWishListButton = styled(_AddToWishListButton)`
  flex: 1;
`

const ReadSample = styled(_ReadSample)`
  flex: 1;
`

const NOOK_PARENT_FORMAT = 'NOOK'

export interface StoreBasicInfo {
  id: string
  name: string
}

interface ProtectionPlan {
  ean?: string | boolean
  displayName?: string
  class?: string
  price?: number
}
interface StateProps {
  isBusy: (ean: string) => boolean
  bookDetails: BookDetailsState
  bookRelatedQuestions: QuestionModel[]
  bookRecommendedBooks: string[]
  currentlyReadingUserIds: string[]
  nookBooks: NookListItem[]
  bopisStore?: StoreModel
  favoriteStore?: StoreModel
  reviews: ReviewsStateModel
  cart: ShopCartModel
}

const selector = (_, ownProps) => {
  const _ean = ownProps.navigation.getParam(Params.EAN)
  const _bookInNookLibrarySelector = bookInNookLibrarySelector()
  const _pdpBookRelatedQuestionsSelector = pdpBookRelatedQuestionsSelector()
  return (state) => ({
    isBusy: (ean) => isBusyFetchingPdp(state, { ean }),
    bookDetails: pdpBookDetailsSelector(state),
    currentlyReadingUserIds: currentlyReadingUserIdsFromEanSelector(state, {
      ean: _ean,
    }),
    bookRelatedQuestions: _pdpBookRelatedQuestionsSelector(state, {
      ean: _ean,
    }),
    bookRecommendedBooks: pdpBookRecommendedBookIdsSelector(state, {
      ean: _ean,
    }),
    nookBooks: _bookInNookLibrarySelector(state, { ean: _ean }),
    bopisStore: bopisStoreSelector(state),
    reviews: reviewsSelector(state),
    favoriteStore: favoriteStoreSelector(state),
    cart: shopCartSelector(state),
  })
}

interface DispatchProps {
  fetchBookAndRelatedQuestions: (ean: Ean) => void
  fetchBookDetails: (ean: Ean) => void
  fetchBookRecommendedBooks: (ean: Ean) => void
  fetchBookCurrentlyReadingUsers: (ean: Ean) => void
  fetchNookLocker: () => void
  addEvent: (name, attributes) => void
  fetchFavoriteStore: () => void
  setActiveGlobalModal: ({ id: string }) => void
  setError: (error: ErrorMessage) => void
  getReviews: (ean) => void
  getRecentlyViewed: (ean: string) => void
}

const dispatcher = (dispatch) => ({
  fetchBookAndRelatedQuestions: (ean) =>
    dispatch(fetchBookAndRelatedQuestionsAction(ean)),
  fetchBookDetails: (ean) => dispatch(fetchBookDetailsAction(ean)),
  fetchBookRecommendedBooks: (ean) =>
    dispatch(fetchBookRecommendedBooksAction(ean)),
  fetchBookCurrentlyReadingUsers: (ean) =>
    dispatch(fetchBookCurrentlyReadingUsersWithEanAction(ean)),
  fetchNookLocker: () => dispatch(fetchNookLockerAction()),
  addEvent: (name, attributes) => dispatch(addEventAction(name, attributes)),
  fetchFavoriteStore: () => dispatch(fetchFavoriteStoreAction()),
  getNearestStore: (params) => dispatch(fetchNearestStoreAction(params)),
  locationPermissionDenied: () => dispatch(permissionDeniedAction('location')),
  setError: (error: ErrorMessage) =>
    dispatch(setformErrorMessagesAction(PDP_ERROR_MODAL, [error])),
  setActiveGlobalModal: (modal: { id: string }) =>
    dispatch(setActiveGlobalModalAction(modal)),
  getReviews: (ean) => dispatch(getReviewsAction(ean)),
  getRecentlyViewed: (ean) => dispatch(getRecentlyViewedAction(ean)),
  setFavoriteStore: (storeId) => dispatch(setFavoriteStoreAction(storeId)),
  setItemPickupStore: (params: StorePickupParams) =>
    dispatch(setItemPickupStoreAction(params)),
  setBopisStore: (store: StoreModel) => dispatch(setBopisStoreAction(store)),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps & NavigationInjectedProps

export enum DELIVERY_OPTIONS {
  BOPIS,
  ONLINE,
}

const PdpScreen = (props: Props) => {
  const {
    isBusy,
    bookDetails,
    bopisStore,
    // fetchBookAndRelatedQuestions,
    fetchBookDetails,
    // fetchBookRecommendedBooks,
    navigation,
    // fetchBookCurrentlyReadingUsers,
    nookBooks,
    // fetchNookLocker,
    fetchFavoriteStore,
    addEvent,
    setError,
    setActiveGlobalModal,
    getReviews,
    reviews,
    getRecentlyViewed,
    favoriteStore,
    cart,
  } = props

  const [ean, setEan] = useState<Ean>(navigation.getParam(Params.EAN))

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isRefreshing] = useState(isBusy(ean))

  const [isLoading, setIsLoading] = useState(false)

  const [isNookModalOpen, setNookModal] = useState<boolean>(false)
  const theme = useContext(ThemeContext) as ThemeModel
  const { width } = useResponsiveDimensions()

  const [product, setProduct] = useState<BookModel | undefined>(undefined)

  const [isBopisAvailable, setIsBopisAvailable] = useState<boolean>(false)
  const [isBopisEligible, setIsBopisEligible] = useState<boolean>(false)
  const [protectionPlan, setProtectionPlan] = useState<ProtectionPlan>({
    ean: false,
  })
  const [addProtectionPlan, setAddProtectionPlan] = useState<boolean>(false)

  const [protectionPlanProgress, setProtectionPlanProgress] = useState<boolean>(
    false,
  )
  const [addToCartProgress, setAddToCartProgress] = useState<boolean>(false)

  const [productDetails, setProductDetails] = useState<BookDetails>(
    bookDetails[ean] || {},
  )

  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<
    DELIVERY_OPTIONS | undefined
  >(undefined)

  const [pickupStore, setPickupStore] = useState<StoreModel | undefined>(
    bopisStore || favoriteStore,
  )

  const fetchPdpData = useCallback(async () => {
    setIsLoading(true)
    if (bookDetails[ean] === undefined) {
      await fetchBookDetails(ean)
    }
    const currentBookDetails = bookDetails[ean]
    if (currentBookDetails?.availableFormats) {
      // only change this when we have book details;
      setProductDetails(currentBookDetails)
    }
    const productDetailsResponse = await getBooksDetails([ean])
    const normalizedDetails = normalizeAtgBookDetailsToBookModelArray(
      productDetailsResponse.data,
    )

    const productDetails =
      productDetailsResponse.data.response?.productDetails?.[0]
    if (productDetails) {
      const protectionPlansEAN = productDetails?.protectionPlansEAN
      if (protectionPlansEAN && protectionPlansEAN.length) {
        const protectionPlansEANId = protectionPlansEAN[0]?.repositoryId
        const warrantyDetails: [] = productDetails?.warrantyDetails
        Object.keys(warrantyDetails).forEach((key) => {
          warrantyDetails[key].forEach((warranty: any) => {
            if (warranty.ean === protectionPlansEANId) {
              setProtectionPlan(warranty)
            }
          })
        })
      }
    }

    setProduct(normalizedDetails[0])
    setIsLoading(false)
  }, [ean, bookDetails, isBusy])

  // BOPIS store priority: bopisStore (for this session) -> favorite store -> nearest store
  const getNeededStores = useCallback(async () => {
    if (bopisStore?.id) {
      return
    }
    if (!favoriteStore?.id) {
      await fetchFavoriteStore()
    } else {
      return
    }
  }, [bopisStore, favoriteStore])

  const setupPickupStore = useCallback(async () => {
    if (bopisStore?.id && bopisStore?.id !== pickupStore?.id) {
      setPickupStore(bopisStore)
      return
    }
    if (bopisStore?.id === '' && favoriteStore) {
      setPickupStore(favoriteStore)
      return
    }
  }, [bopisStore, favoriteStore])

  useEffect(() => {
    getNeededStores()
  }, [bopisStore])

  useEffect(() => {
    setupPickupStore()
  }, [bopisStore])

  useEffect(() => {
    getNeededStores()
    setupPickupStore()
  }, [bopisStore, favoriteStore])

  useEffect(() => {
    if (isDigital(product?.skuType || SKU_TYPES.DEFAULT)) {
      setSelectedDeliveryOption(undefined)
      return
    }
    if (product?.availabilityStatus === 'inStock') {
      setSelectedDeliveryOption(DELIVERY_OPTIONS.ONLINE)
      return
    }
    if (isBopisEligible && isBopisAvailable) {
      setSelectedDeliveryOption(DELIVERY_OPTIONS.BOPIS)
    }
  }, [
    isBopisAvailable,
    isBopisEligible,
    product?.availabilityStatus,
    product?.skuType,
  ])

  const fetchBopisInfo = useCallback(async () => {
    if (pickupStore?.id) {
      const response = await bopisInventoryLookupInStore(
        pickupStore?.id || '',
        ean,
      )
      if (response.ok) {
        const isBopisEligible = response.data.item.eligible
        const isBopisAvailable = isBopisEligible && response.data.item.available
        setIsBopisAvailable(isBopisAvailable)
        setIsBopisEligible(isBopisEligible)
      }
    }
  }, [pickupStore])

  useEffect(() => {
    fetchPdpData()
  }, [ean, bookDetails[ean]])

  useEffect(() => {
    navigation.setParams({ _book: product })
    if (product) {
      getRecentlyViewed(product.ean)
    }
  }, [product])

  useEffect(() => {
    fetchBopisInfo()
  }, [pickupStore])

  useEffect(() => {
    navigation.setParams({ _book: product })
    if (product) {
      getReviews(product.ean)
    }
  }, [product, ean])

  useEffect(() => {
    navigation.setParams({ _reviews: reviews })
    if (product && reviews) {
      const productViewed = {
        productFormat: product.parentFormat,
        productTitle: product.name,
        productId: product.ean,
        starRating: reviews[product.ean] ? reviews[product.ean].ratings : 0,
        filterApplied: 'No Value Set',
      }

      addEvent(LL_PRODUCT_VIEWED, productViewed)
    }
  }, [product, reviews])

  useEffect(() => {
    navigation.setParams({ _title: product?.name })
  }, [product?.name, ean])

  const toggleNookModal = useCallback(() => setNookModal(!isNookModalOpen), [
    isNookModalOpen,
  ])

  const handleOpenNook = () => {
    toggleNookModal()
  }

  const handleProtectionPlan = async (response) => {
    if (addProtectionPlan) {
      const protectionPlanLinkToCommerceItemID =
        response.data.order.commerceItems?.[0]?.id

      setProtectionPlanProgress(true)
      const pPlanResponse = await addProtectionPlanToOrder({
        quantity: '1',
        protectionPlanLinkToCommerceItemID,
        selectedPlan: protectionPlan.ean as string,
      })
      setProtectionPlanProgress(false)

      if (!pPlanResponse.ok) {
        setActiveGlobalModal({ id: GlobalModals.PDP_ERROR })
        setError({
          formFieldId: PDP_ERROR_MODAL,
          error: pPlanResponse.data?.formExceptions[0].localizedMessage,
        })
        return
      }
      Vibration.vibrate()
    }
  }

  const handleAddToCart = useCallback(async () => {
    let addData: AddItemData = {
      catalogRefIds: ean,
      quantity: 1,
      productId: `prd${ean}`,
    }
    if (selectedDeliveryOption === DELIVERY_OPTIONS.BOPIS) {
      addData.listPrice = 0
      addData.webPrice = 0
      addData.skuType = product?.skuType
      setAddToCartProgress(true)
      const response = await addItemAsBopis(addData)
      setAddToCartProgress(false)
      if (!response.ok) {
        setActiveGlobalModal({ id: GlobalModals.PDP_ERROR })
        setError({
          formFieldId: PDP_ERROR_MODAL,
          error: response.data?.response?.message,
        })
        return
      }
      handleProtectionPlan(response)
    } else {
      setAddToCartProgress(true)
      const response = await addItemToCart(addData)
      setAddToCartProgress(false)
      if (!response.ok) {
        setActiveGlobalModal({ id: GlobalModals.PDP_ERROR })
        setError({
          formFieldId: PDP_ERROR_MODAL,
          error: htmlToText(response.data?.formExceptions[0]?.localizedMessage),
        })
        return
      } else {
        if (product) {
          const addToCart = {
            productFormat: product.parentFormat,
            productTitle: product.name,
            productId: product.ean,
            price: product.listPrice,
            qty: 1,
          }
          addEvent(LL_ADD_TO_CART, addToCart)
        }
      }

      handleProtectionPlan(response)
    }
    Vibration.vibrate()
  }, [
    selectedDeliveryOption,
    ean,
    product,
    favoriteStore,
    bopisStore,
    cart,
    addProtectionPlan,
  ])

  const handleOpenNookBook = (type) => {
    // const selectedBook = nookBooks.find((nookBook) => nookBook.type === type)!
    // if (selectedBook) {
    Linking.openURL(config.api.nook.deepLinking.replace('<ean>', ean))
    // }
  }

  const modalButtons = useMemo(() => {
    if (nookBooks.length > 1) {
      return [
        {
          title: 'Open eBook',
          onPress: () => {
            handleOpenNookBook('ebook')
          },
          variant: 'outlined' as Variant,
          linkGreen: true,
        },
        {
          title: 'Open Audiobook',
          onPress: () => {
            handleOpenNookBook('audiobook')
          },
        },
      ]
    }
    return [
      {
        title: 'Continue',
        onPress: () => {
          handleOpenNookBook(product?.skuType)
        },
        variant: 'outlined' as Variant,
        linkGreen: true,
      },
    ]
  }, [nookBooks, product])

  const contentContainerStyle = useMemo(
    () =>
      nookBooks.length
        ? getContentContainerStyleWithAnchor(theme, width)
        : getContentContainerStyle(width),
    [theme, nookBooks.length, width],
  )

  const removeTextEmplyLines = (text) => {
    var lines = text.split('\n')
    lines = lines.filter((line) => line !== '')
    return lines.join('\n')
  }

  const removeBooksellerContentTitle = (booksellerContent) => {
    var lines = booksellerContent.split('\n')
    removeTextEmplyLines(booksellerContent)
    if (lines[0].toLowerCase().search('notes from your bookseller')) {
      lines.splice(0, 1)
    }

    return lines.join('\n')
  }

  return (
    <Container>
      <NavigationEvents onWillFocus={fetchBopisInfo} />
      <ScrollContainer
        style={{
          marginBottom:
            isDigital(product?.skuType || '') ||
            isDigital(
              productDetails.availableFormats?.find(
                (format) => format.ean === ean,
              )?.format as string,
            )
              ? 60
              : 80,
        }}
        contentContainerStyle={contentContainerStyle}
        refreshing={isRefreshing}
        onRefresh={fetchPdpData}
      >
        {!!product && (
          <Section>
            <BookHeader
              book={product}
              reviews={reviews}
              isBusy={isRefreshing}
              productDetails={productDetails}
            />
          </Section>
        )}

        {!!productDetails.availableFormats?.length && (
          <Section>
            <AvailableFormats
              availableFormats={productDetails.availableFormats}
              selectedFormat={productDetails.availableFormats?.find(
                (format) => format.ean === ean,
              )}
              onPress={(format) => {
                setEan(format.ean)
              }}
            />
          </Section>
        )}
        {!!product && (
          <Section>
            <PriceHeader
              salePrice={product?.salePrice || 0}
              listPrice={product?.listPrice || 0}
              savedPercentage={product?.percentageSave || ''}
            />
          </Section>
        )}
        <Section title="Availability">
          <Availability
            isElectronic={
              isDigital(product?.skuType || SKU_TYPES.DEFAULT) ||
              isDigital(
                productDetails.availableFormats?.find(
                  (format) => format.ean === ean,
                )?.format as string,
              )
            }
            isBopisAvailable={isBopisAvailable}
            isBopisEligible={isBopisEligible}
            bopisStore={pickupStore}
            availabilityStatus={product?.availabilityStatus || 'outOfStock'}
            selectedOption={selectedDeliveryOption}
            onSelectOption={setSelectedDeliveryOption}
            onPressChangeStore={() => {
              navigation.navigate(Routes.PDP__SELECT_STORE, { isForPdp: true })
            }}
          />
        </Section>

        <FlexRow>
          {product && (
            <FlexRowContent marginRight>
              <AddToWishListButton
                ean={ean}
                addToDefault
                product={product}
                reviews={reviews}
              />
            </FlexRowContent>
          )}
          {product?.webReaderUrl ? (
            <FlexRowContent>
              <ReadSample
                url={product?.webReaderUrl}
                product={product}
                reviews={reviews}
              />
            </FlexRowContent>
          ) : null}
        </FlexRow>

        {protectionPlan?.ean && (
          <ProtectionPlanHolder>
            <ProtectText>{`${protectionPlan.displayName} $${protectionPlan.price} `}</ProtectText>
            <Row>
              <Checkbox
                selected={addProtectionPlan}
                onPress={() => {
                  setAddProtectionPlan(!addProtectionPlan)
                }}
                checkboxStyle
              />
              <ProtectBody>Add a Barnes & Noble Protection Plan</ProtectBody>
            </Row>
            <TouchableOpacity
              onPress={() => navigate(Routes.PDP__PROTECTION_PLAN_DETAILS)}
            >
              <ProtectionLinkText>See details</ProtectionLinkText>
            </TouchableOpacity>
          </ProtectionPlanHolder>
        )}

        {!!productDetails.description &&
          !!productDetails.description.overview && (
            <OverviewComponent
              overviewText={removeTextEmplyLines(
                htmlToText(productDetails.description.overview),
              )}
              booksellerContent={
                productDetails.description.booksellerContent
                  ? removeBooksellerContentTitle(
                      htmlToText(productDetails.description.booksellerContent),
                    )
                  : undefined
              }
              contentType={VIEW_OVERVIEW}
            />
          )}
        {!!productDetails.description &&
          !!productDetails.description.editorialReviews && (
            <OverviewComponent
              overviewText={htmlToText(
                productDetails.description.editorialReviews,
              )}
              booksellerContent={
                productDetails.description.editorialReviews
                  ? htmlToText(productDetails.description.editorialReviews)
                  : undefined
              }
              contentType={VIEW_EDITORIAL_REVIEWS}
            />
          )}
        {!!product && (
          <Section>
            <CustomerReviewsSection
              book={product}
              reviews={reviews}
              productDetails={productDetails}
            />
          </Section>
        )}
        {!!product && product.parentFormat !== NOOK_PARENT_FORMAT && (
          <AdditionalInfoTab
            title="Product Details"
            onPress={() => {
              const data = productDetailsHelper(
                productDetails.bookTabs.productDetails,
                productDetails.salesRank,
                product?.skuType,
              )

              navigate(Routes.PDP__PRODUCT_DETAILS, {
                data,
                productName: product?.name,
              })
              const publisher = data?.filter(
                (item) => item.fieldName === 'Publisher',
              )

              const isbn13 = data?.filter(
                (item) => item.fieldName === 'ISBN-13',
              )
              if (publisher && isbn13) {
                const productDetailsViewed = {
                  publisher: publisher[0]?.content,
                  isbn13: isbn13[0]?.content,
                }
                addEvent(LL_PRODUCT_DETAILS_VIEWED, productDetailsViewed)
              }
            }}
          />
        )}
        {!!product && product.parentFormat === NOOK_PARENT_FORMAT && (
          <AdditionalInfoTab
            title="Features & Specs"
            onPress={() => {
              navigate(Routes.PDP__NOOK_DEVICE, {
                [Params.EAN]: ean,
                [Params.PRODUCT]: product,
              })
            }}
          />
        )}
        {!!productDetails.bookTabs && productDetails.bookTabs.tracks !== null && (
          <AdditionalInfoTab
            title="Tracks"
            onPress={() =>
              navigate(Routes.PDP__TRACKS, {
                data: productDetails.bookTabs.tracks,
                productName: product?.name,
              })
            }
          />
        )}
        {!!product &&
          !!productDetails.bookTabs &&
          productDetails.bookTabs.contributors !== null && (
            <AdditionalInfoTab
              title={
                product?.skuType === 'music' ? 'Album Credits' : 'Cast & Crew'
              }
              onPress={() =>
                navigate(Routes.PDP__CONTRIBUTORS, {
                  data: contributorsHelper(
                    productDetails.bookTabs.contributors,
                    product?.skuType,
                  ),
                  title:
                    product?.skuType === 'music'
                      ? 'Album Credits'
                      : 'Contributors',
                  productName: product?.name,
                })
              }
            />
          )}
        {!!productDetails.bookTabs &&
          productDetails.bookTabs.tableOfContents !== null && (
            <AdditionalInfoTab
              title="Table of Contents"
              onPress={() =>
                navigate(Routes.PDP__TOC, {
                  data:
                    productDetails.bookTabs.tableOfContents &&
                    htmlToText(productDetails.bookTabs.tableOfContents),
                  productName: product?.name,
                })
              }
            />
          )}

        <RecommendedForYou ean={ean} />
      </ScrollContainer>
      {!isDigital(product?.skuType || '') &&
        !isDigital(
          productDetails.availableFormats?.find((format) => format.ean === ean)
            ?.format as string,
        ) && (
          <AddToCartButton
            disabled={
              (selectedDeliveryOption === DELIVERY_OPTIONS.ONLINE &&
                product?.availabilityStatus === 'outOfStock') ||
              (selectedDeliveryOption === DELIVERY_OPTIONS.BOPIS &&
                !(isBopisAvailable && isBopisEligible)) ||
              selectedDeliveryOption === undefined
            }
            showSpinner={addToCartProgress || protectionPlanProgress}
            variant="contained"
            isAnchor
            onPress={handleAddToCart}
          >
            Add to Cart
          </AddToCartButton>
        )}
      {((product?.skuType === SKU_TYPES.E_BOOK ||
        product?.skuType === SKU_TYPES.AUDIO_BOOK) && (
        <NookButton variant="contained" onPress={handleOpenNook} isAnchor>
          Open in NOOK
        </NookButton>
      )) ||
        undefined}
      {isLoading && <ActivityIndicator isLoading />}
      <Alert
        isOpen={isNookModalOpen}
        onDismiss={toggleNookModal}
        title="Open in NOOK app"
        buttons={modalButtons}
        description="You are about to leave the B&N app. Click Continue to open your book in the NOOK app."
      />
    </Container>
  )
}

PdpScreen.navigationOptions = ({ navigation }) => {
  const product = navigation.getParam('_book')
  const reviews = navigation.getParam('_reviews')

  return {
    title: navigation.getParam('_title'), // this will be updated on component load
    header: (headerProps) => (
      <Header
        headerProps={headerProps}
        ctaComponent={<PdpShare product={product} reviews={reviews} />}
      />
    ),
  }
}

export default connector(PdpScreen)

const ProtectText = styled.Text`
  ${({ theme }) => theme.typography.subTitle2}
  color: ${({ theme }) => theme.palette.grey1};
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`
const ProtectBody = styled.Text`
  ${({ theme }) => theme.typography.body1}
  color: ${({ theme }) => theme.palette.grey1};
  margin-left: ${({ theme }) => theme.spacing(1)};
`

const Row = styled.View`
  flex-direction: row;
`

const ProtectionPlanHolder = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`

const Checkbox = styled(RadioButton)``

const ProtectionLinkText = styled.Text`
  ${({ theme }) => theme.typography.button.small}
  color: ${({ theme }) => theme.palette.linkGreen};
  text-transform: uppercase;
  margin-left: ${({ theme }) => theme.spacing(5)};
  margin-top: ${({ theme }) => theme.spacing(1)};
`
