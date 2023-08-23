import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { NavigationInjectedProps } from 'react-navigation'
import styled, { withTheme } from 'styled-components/native'
import { ScrollView, Dimensions, ScaledSize } from 'react-native'

import { icons } from 'assets/images'

import Container from 'src/controls/layout/ScreenContainer'
import ScrollContainer from 'src/controls/layout/ScrollContainer'
import Button from 'src/controls/Button'
import CafeItemOptionList from 'src/components/Cafe/ItemOptionList'
import _SelectedVenueHeader from 'src/components/Cafe/SelectedVenueHeader'
import { PdfFile } from 'src/screens/webview/Pdf'

import { ThemeModel } from 'src/models/ThemeModel'
import { AddOrderToCart } from 'src/models/CafeModel/CartModel'
import { CafeItem, CafeItemOption } from 'src/models/CafeModel/ItemsModel'
import { ApiStatus, RequestStatus } from 'src/models/ApiStatus'

import { push, Routes, Params, navigate } from 'src/helpers/navigationService'
import cafeOrderHashKey from 'src/helpers/api/cafe/cafeOrderHashKey'
import {
  getScrollVerticalPadding,
  getScrollHorizontalPadding,
  getContentContainerStyleWithAnchor,
} from 'src/constants/layout'

import { fetchCafeItemOptionsAction } from 'src/redux/actions/cafe/itemOptionsAction'
import { fetchAddOrderToCartAction } from 'src/redux/actions/cafe/cartAction'
import {
  cafeItemSelector,
  cafeItemOptionsSelector,
} from 'src/redux/selectors/cafeSelector'
import { addToCartApiStatusesSelector } from 'src/redux/selectors/apiStatus/cafe'
import {
  addEventAction,
  LL_NUTRITIONAL_INFO_DOWNLOADED,
  LL_CHOOSE_CAFE_PRODUCT_SIZE,
  LL_CHOOSE_CAFE_PRODUCT_TYPE,
  LL_ADD_TO_CAFE_CART,
} from 'src/redux/actions/localytics'
interface ContainerProps {
  currentWidth: number
}

const SelectedVenueHeader = styled(_SelectedVenueHeader)`
  margin-top: ${({ theme }) => getScrollVerticalPadding(theme)};
  margin-horizontal: ${({ theme }) => getScrollVerticalPadding(theme)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const Image = styled.Image`
  height: ${({ theme }) => theme.spacing(14)};
  width: 100%;
  background-color: ${({ theme }) => theme.palette.disabledGrey};
`

const Flex = styled.View`
  flex-direction: row;
  align-items: center;
`

const HeaderContainer = styled.View<ContainerProps>`
  padding-top: ${({ theme }) => theme.spacing(1)};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  padding-horizontal: ${({ theme, currentWidth }) =>
    getScrollHorizontalPadding(theme, currentWidth)};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.palette.grey5};
  background-color: ${({ theme }) => theme.palette.white};
`

const HeaderText = styled.Text`
  flex: 1;
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const CaloriesText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
`

const DescriptionText = styled.Text<ContainerProps>`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
`

const OrderCount = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing(1)};
`

const OrderCountIcon = styled.TouchableOpacity``

const Icon = styled.Image`
  height: ${({ theme }) => theme.spacing(6)};
  width: ${({ theme }) => theme.spacing(6)};
`

const OrderCountText = styled.Text`
  min-width: ${({ theme }) => theme.spacing(9)};
  ${({ theme }) => theme.typography.heading1}
  color:${({ theme }) => theme.palette.grey1};
  text-align: center;
`

const DailyCaloryIntakeText = styled.Text`
  ${({ theme }) => theme.typography.caption};
  color: ${({ theme }) => theme.palette.grey2};
  margin-top: ${({ theme }) => theme.spacing(5)};
`

const NutritionButton = styled(Button)`
  padding-top: ${({ theme }) => theme.spacing(1)};
  padding-bottom: ${({ theme }) => theme.spacing(1)};
`

const AddToOrderButton = styled(Button)``

interface ThemeProps {
  theme: ThemeModel
}

interface State {
  selectedItemOptions: Record<string, string[]> // addonGroup => itemOptionId
  count: number
  currentDimension: ScaledSize
}

interface StateProps {
  item: CafeItem
  itemOptions: Record<string, CafeItemOption>
  addToCartApiStatuses: Record<string, ApiStatus>
}

const selector = createStructuredSelector({
  item: (state, ownProps) => {
    const itemId = ownProps.navigation.getParam(Params.CAFE_ITEM_ID)
    return cafeItemSelector(state, { itemId })
  },
  itemOptions: cafeItemOptionsSelector,
  addToCartApiStatuses: addToCartApiStatusesSelector,
})

interface DispatchProps {
  fetchCafeItemOptions: (itemId: string) => void
  addOrderToCart: (params: AddOrderToCart) => boolean
  addEvent: (name, attributes) => void
}

const dispatcher = (dispatch) => ({
  fetchCafeItemOptions: (itemId) =>
    dispatch(fetchCafeItemOptionsAction(itemId)),
  addOrderToCart: (params) => dispatch(fetchAddOrderToCartAction(params)),
  addEvent: (name, attributes) => dispatch(addEventAction(name, attributes)),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps & NavigationInjectedProps & ThemeProps

class CafeItemOptionsScreen extends React.Component<Props, State> {
  state = {
    selectedItemOptions: {},
    count: 1,
    currentDimension: Dimensions.get('screen'),
  }

  handleSetDimension = (dims) => {
    this.setState({ currentDimension: dims.screen })
  }

  componentWillMount() {
    Dimensions.addEventListener('change', this.handleSetDimension)
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.handleSetDimension)
  }

  componentDidMount() {
    const { fetchCafeItemOptions, navigation } = this.props
    const itemId = navigation.getParam(Params.CAFE_ITEM_ID)
    fetchCafeItemOptions(itemId)
  }

  toggleItemOptionId = (itemOptionId: string, addonGroupId: string) => {
    // we need to be able to add options for our items and there are different types of option fields
    // 1) required field: prevent this resetting to no options selected (always atleast 1 selected)
    // 2) optional field: allow this to reset to no options selected
    // 3) options which you can select more than 1 from
    this.setState((prevState) => {
      const selectedItemOptions =
        prevState.selectedItemOptions[addonGroupId] || []

      const { item } = this.props
      const addonGroup = item.addonGroups.find(
        (_addonGroup) => _addonGroup.id === addonGroupId,
      )

      const index = selectedItemOptions.indexOf(itemOptionId) // check if we have this option already selected
      // if we have this selected, we remove it
      if (index > -1) {
        const required = !!(addonGroup && addonGroup.minSelection)
        // only allow untoggling an option to no options selected if this is an optional option
        // if required, keep atleast 1 option selected
        if (!required) {
          selectedItemOptions.splice(index, 1)
        }
      } else {
        // otherwise if this option isn't selected, lets select this option
        // check how many options can be selected for this section at once
        const maxSelection = (addonGroup && addonGroup.maxSelection) || 1
        // if we can more selections than the currently selected amount, just add this selection
        if (selectedItemOptions.length < maxSelection) {
          selectedItemOptions.push(itemOptionId)
        } else {
          // hit the maximum amount selected
          // remove first index (oldest) and push the new option to the array
          selectedItemOptions.splice(0, 1)
          selectedItemOptions.push(itemOptionId)
        }
      }
      return {
        selectedItemOptions: {
          ...prevState.selectedItemOptions,
          [addonGroupId]: selectedItemOptions, // we also save it as an array to allow multiple selections
        },
      }
    })
  }

  canAddToOrder = () => {
    const { selectedItemOptions } = this.state
    const { item } = this.props
    const { addonGroups = [] } = item

    for (const addonGroup of addonGroups) {
      // eslint-disable-line
      // search for addonGroups with a minSelection
      const { minSelection } = addonGroup
      const selectionAddonGroupOptions =
        selectedItemOptions[addonGroup.id] || [] // empty state
      // if we have nothing selected, or fail to meet the minSelection amount
      if (
        !selectionAddonGroupOptions ||
        selectionAddonGroupOptions.length < minSelection
      ) {
        return false
      }
    }
    return true
  }

  calculateSubtotalAmount = () => {
    const { selectedItemOptions } = this.state
    const { itemOptions } = this.props

    const itemOptionIds = Array.prototype.concat.apply(
      [],
      Object.values(selectedItemOptions),
    ) // flatten
    let totalAmount = 0

    itemOptionIds.map((itemOptionId) => {
      // eslint-disable-line
      totalAmount += itemOptions[itemOptionId].price
    })

    return totalAmount
  }

  adjustCount = (value: number) => {
    this.setState((prevState) => ({
      count: Math.max(prevState.count + value, 1),
    }))
  }

  getCalories = () => {
    const { selectedItemOptions } = this.state
    const { itemOptions } = this.props

    const itemOptionIds = Array.prototype.concat.apply(
      [],
      Object.values(selectedItemOptions),
    ) // flatten
    let totalCalories
    itemOptionIds.forEach((itemOptionId) => {
      if (itemOptions[itemOptionId].calories) {
        if (!totalCalories) {
          totalCalories = itemOptions[itemOptionId].calories
        } else {
          totalCalories += itemOptions[itemOptionId].calories
        }
      }
    })

    return totalCalories
  }

  goToNutritionPdf = () => {
    const { addEvent } = this.props
    push(Routes.WEBVIEW__PDF, { [Params.PDF_FILE]: PdfFile.CAFE_NUTRITION })
    addEvent(LL_NUTRITIONAL_INFO_DOWNLOADED, {})
  }

  render() {
    const {
      theme,
      navigation,
      addOrderToCart,
      addToCartApiStatuses,
      item,
    } = this.props
    const { selectedItemOptions, count, currentDimension } = this.state
    const { width } = currentDimension
    const itemId = navigation.getParam(Params.CAFE_ITEM_ID)
    const canAddToOrder = this.canAddToOrder()
    const subtotalAmount = this.calculateSubtotalAmount()

    const hash = cafeOrderHashKey({ itemId, selectedItemOptions })
    const pending =
      addToCartApiStatuses &&
      addToCartApiStatuses[hash] &&
      addToCartApiStatuses[hash].requestStatus === RequestStatus.FETCHING
    const totalCalories = this.getCalories()
    return (
      <Container>
        <SelectedVenueHeader />
        <ScrollView stickyHeaderIndices={[1]}>
          {item.coverImageUrl && <Image source={{ uri: item.coverImageUrl }} />}
          <HeaderContainer currentWidth={width}>
            <Flex>
              <HeaderText>{item.name}</HeaderText>
              {totalCalories && (
                <CaloriesText>{`${totalCalories} cal`}</CaloriesText>
              )}
            </Flex>
            <DescriptionText currentWidth={width}>
              {item.description}
            </DescriptionText>
          </HeaderContainer>
          <ScrollContainer
            contentContainerStyle={getContentContainerStyleWithAnchor(
              theme,
              width,
            )}
          >
            <CafeItemOptionList
              itemId={itemId}
              selectedItemOptions={selectedItemOptions}
              toggleItemOptionId={this.toggleItemOptionId}
            />
            <OrderCount>
              <OrderCountIcon
                onPress={() => {
                  this.adjustCount(-1)
                }}
              >
                <Icon source={icons.minus} />
              </OrderCountIcon>
              <OrderCountText>{count}</OrderCountText>
              <OrderCountIcon
                onPress={() => {
                  this.adjustCount(1)
                }}
              >
                <Icon source={icons.plus} />
              </OrderCountIcon>
            </OrderCount>
            <DailyCaloryIntakeText>
              2,000 calories a day is used for general advice, but calorie needs
              vary. Additional nutrition information available upon request.
            </DailyCaloryIntakeText>
            <NutritionButton
              size="small"
              onPress={this.goToNutritionPdf}
              linkGreen
            >
              Nutritional Information (PDF)
            </NutritionButton>
          </ScrollContainer>
        </ScrollView>
        <AddToOrderButton
          variant="contained"
          onPress={async () => {
            const productType = navigation.getParam(Params.CAFE_TYPE)
            const success = await addOrderToCart({
              itemId,
              selectedItemOptions,
              count,
            })

            if (success) {
              navigate(Routes.CAFE__CHECKOUT)
            }

            const { item, itemOptions, addEvent } = this.props

            const itemIdForSize = item.addonGroups.find(
              (_addonGroup) => _addonGroup.name === 'Size',
            )

            const productSize = {
              size: itemIdForSize
                ? itemOptions[selectedItemOptions[itemIdForSize.id][0]]?.name
                : 'No Value Set',
            }

            addEvent(LL_ADD_TO_CAFE_CART, { productTitle: item.name })
            addEvent(LL_CHOOSE_CAFE_PRODUCT_TYPE, { type: productType })
            addEvent(LL_CHOOSE_CAFE_PRODUCT_SIZE, productSize)
          }}
          disabled={!canAddToOrder || pending}
          isAnchor
          showSpinner={pending}
        >
          Add to order
          {canAddToOrder
            ? ` - $${((count * subtotalAmount) / 100).toFixed(2)}`
            : ''}
        </AddToOrderButton>
      </Container>
    )
  }
}

export default withTheme(connector(CafeItemOptionsScreen))
