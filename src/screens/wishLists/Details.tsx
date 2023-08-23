import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { NavigationInjectedProps } from 'react-navigation'
import styled from 'styled-components/native'

import Container from 'src/controls/layout/ScreenContainer'
import Header from 'src/controls/navigation/Header'
import PdpList from 'src/components/PdpList'
import Alert from 'src/controls/Modal/Alert'
import WishListCta from 'src/components/CtaButtons/WishListCta'
import DraggableModal from 'src/controls/Modal/BottomDraggable'
import OptionChip from 'src/components/OptionChipsList/Item'
import Button from 'src/controls/Button'

import {
  removeItemFromWishListAction,
  getWishListsAction,
  addItemToWishListAction,
  removeEanFromWishListStateAction,
} from 'src/redux/actions/wishList/wishListAction'
import { wishListSelector } from 'src/redux/selectors/wishListSelector'
import { WishListModel } from 'src/models/WishListModel'
import { getPdpDetailsData } from 'src/data/search'
import { ResultModel } from 'src/models/SearchModel'
import countLabelText from 'src/helpers/countLabelText'
import Images, { icons } from 'assets/images'
import { Routes, push } from 'src/helpers/navigationService'

const HeaderContainer = styled.View`
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-horizontal: ${({ theme }) => theme.spacing(2)};
`

const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.heading2}
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const VisiblityText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey2};
`

const Flex = styled.View`
  flex-direction: row;
  align-items: center;
  ${({ center, theme }) =>
    !center
      ? ''
      : `
  margin-top: ${theme.spacing(2)};
  width: 100%;
  justify-content: space-between;
  `}
`

const Wrapper = styled.View`
  margin-top: ${({ theme }) => theme.spacing(1)};
  margin-horizontal: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const IconButton = styled.TouchableOpacity``

const CountText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey2};
`

const Icon = styled.Image`
  height: ${({ theme, small }) => theme.spacing(small ? 2 : 3)};
  width: ${({ theme, small }) => theme.spacing(small ? 2 : 3)};
  ${({ theme, small }) => (small ? `margin-right: ${theme.spacing(1)};` : '')}
`

const ModalHeaderText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  align-self: center;
`

const ModalContainer = styled.View`
  align-items: flex-start;
`

const Content = styled.View`
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing(5)};
`

const DescriptionText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  padding-bottom: ${({ theme }) => theme.spacing(1)};
`

const DetailsContainer = styled.View`
  flex-direction: row;
  align-items: center;
`

const DetailsText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
`
const EmptyIcon = styled.Image`
  height: ${({ theme }) => theme.spacing(3)};
  width: ${({ theme }) => theme.spacing(3)};
  tint-color: ${({ theme }) => theme.palette.grey2};
`

const EmptyImage = styled.Image`
  width: 200;
  height: 200;
`

const FlexOne = styled.View`
  flex: 1;
  ${({ flexEnd }) => (flexEnd ? 'align-items: flex-end;' : '')}
`

interface StateProps {
  wishList: WishListModel
}

const selector = createStructuredSelector({
  wishList: (state, ownProps) => {
    const { navigation } = ownProps
    const id = navigation.getParam('wishlistId')
    return wishListSelector(state, { id })
  },
})

interface DispatchProps {
  removeItemFromWishList: (params) => boolean
  addItemToWishList: (params) => boolean
  getWishLists: () => void
  removeEanFromWishList: (params) => void
}

const dispatcher = (dispatch) => ({
  addItemToWishList: (params) => dispatch(addItemToWishListAction(params)),
  removeItemFromWishList: (params) =>
    dispatch(removeItemFromWishListAction(params)),
  getWishLists: () => dispatch(getWishListsAction()),
  removeEanFromWishList: (params) => dispatch(removeEanFromWishListStateAction(params)),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps & NavigationInjectedProps

enum IsOpen {
  DELETE_ALERT = 'delete_alert',
  FILTER_MODAL = 'filter_modal',
}

enum Filter {
  DATE_OLDEST = 'date_oldest',
  DATE_RECENT = 'date_recent',
  PRICE_LOW = 'price_low',
  PRICE_HIGH = 'price_hight',
  TITLE_A = 'title_a',
  TITLE_Z = 'title_z',
}

const WishListsDetails = ({
  wishList,
  removeItemFromWishList,
  navigation,
  addItemToWishList,
  getWishLists,
  removeEanFromWishList,
}: Props) => {
  const [books, setBooks] = useState<ResultModel[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<IsOpen | undefined>(undefined)
  const [eanToRemove, setEanToRemove] = useState<string | undefined>(undefined)
  const [awaitRemoveItem, setAwaitRemoveItem] = useState<boolean>(false)
  const [filter, setFilter] = useState<Filter | undefined>(undefined)
  const [deletedEans, setDeletedEans] = useState<string[]>([])

  useEffect(() => {
    navigation.setParams({ _wishListId: wishList.id })
  }, [wishList])

  useEffect(() => {
    return () => {
      getWishLists()
    }
  }, [])

  useEffect(() => {
    if (!(wishList && wishList.items?.length)) {
      setBooks([])
      return
    }
    setIsLoading(true)
    const callback = async () => {
      const eans = wishList.items.map((item) => item.ean)
      const results = await getPdpDetailsData(eans)
      setBooks(results)
      setIsLoading(false)
    }
    callback()
  }, [wishList])

  useEffect(() => {
    if (!isOpen) {
      setEanToRemove(undefined)
    }
  }, [isOpen])

  const onConfirmDeleteItemFromList = (ean) => {
    setEanToRemove(ean)
    setIsOpen(IsOpen.DELETE_ALERT)
  }

  const onDeleteItemFromList = async () => {
    // map ean back to item id
    if (wishList && wishList.items?.length && eanToRemove) {
      setAwaitRemoveItem(true)
      const success = await removeItemFromWishList({
        id: wishList.id,
        ean: eanToRemove,
        disableReload: true,
      })
      if (success) {
        setIsOpen(undefined)
        setDeletedEans([...deletedEans, eanToRemove])
      }
      setAwaitRemoveItem(false)
    }
  }

  const toggleFilter = (filterType: Filter) => {
    setFilter(filterType)
    switch (filterType) {
      case Filter.DATE_OLDEST: {
        const eanOrder = wishList.items
          .sort((a, b) => {
            if (a.addedDate < b.addedDate) {
              return -1
            }
            if (a.addedDate > b.addedDate) {
              return 1
            }
            return 0
          })
          .map((item) => item.ean)
        const _books = eanOrder.map((_ean) =>
          books.find((book) => book.ean === _ean),
        ) as ResultModel[]
        setBooks(_books)
        setIsOpen(undefined)
        return
      }
      case Filter.DATE_RECENT: {
        const eanOrder = wishList.items
          .sort((a, b) => {
            if (a.addedDate > b.addedDate) {
              return -1
            }
            if (a.addedDate < b.addedDate) {
              return 1
            }
            return 0
          })
          .map((item) => item.ean)
        const _books = eanOrder.map((_ean) =>
          books.find((book) => book.ean === _ean),
        ) as ResultModel[]
        setBooks(_books)
        setIsOpen(undefined)
        return
      }
      case Filter.PRICE_LOW: {
        const _books = books.sort((a, b) => {
          if (a.listPrice < b.listPrice) {
            return -1
          }
          if (a.listPrice > b.listPrice) {
            return 1
          }
          return 0
        })
        setBooks(_books)
        setIsOpen(undefined)
        return
      }
      case Filter.PRICE_HIGH: {
        const _books = books.sort((a, b) => {
          if (a.listPrice > b.listPrice) {
            return -1
          }
          if (a.listPrice < b.listPrice) {
            return 1
          }
          return 0
        })
        setBooks(_books)
        setIsOpen(undefined)
        return
      }
      case Filter.TITLE_A: {
        const _books = books.sort((a, b) => {
          if (a.name < b.name) {
            return -1
          }
          if (a.name > b.name) {
            return 1
          }
          return 0
        })
        setBooks(_books)
        setIsOpen(undefined)
        return
      }
      case Filter.TITLE_Z: {
        const _books = books.sort((a, b) => {
          if (a.name > b.name) {
            return -1
          }
          if (a.name < b.name) {
            return 1
          }
          return 0
        })
        setBooks(_books)
        setIsOpen(undefined)
        return
      }
    }
  }

  const resetFilter = () => {
    const _books = wishList.items.map((item) => {
      const ean = item.ean
      return books.find((book) => book.ean === ean)
    }) as ResultModel[]
    setBooks(_books)
    setFilter(undefined)
    setIsOpen(undefined)
  }

  const onUndo = async (ean: string) => {
    const success = await addItemToWishList({ id: wishList.id, ean })
    if (success) {
      setDeletedEans(deletedEans.filter((e) => e !== ean))
    }
  }

  const onRemoveEan = (ean: string) => {
    removeEanFromWishList({ ean, id:  wishList.id })
  }

  return (
    <Container>
      <HeaderContainer>
        <HeaderText>{wishList.name}</HeaderText>
        <Flex>
          {!wishList.isPublic && <Icon small source={icons.lockClosed} />}
          <VisiblityText>
            {wishList.isPublic ? 'Public List' : 'Private List'}
          </VisiblityText>
        </Flex>
        {!!books?.length && (
          <Flex center>
            <IconButton
              onPress={() => {
                setIsOpen(IsOpen.FILTER_MODAL)
              }}
            >
              <Icon source={icons.sortDefault} />
            </IconButton>
            <CountText>
              {countLabelText(wishList?.items?.length, 'item', 'items')}
            </CountText>
            <Icon />
          </Flex>
        )}
      </HeaderContainer>
      {!!books?.length || isLoading ? (
        <PdpList
          results={books}
          isLoading={isLoading}
          onSwipe={onConfirmDeleteItemFromList}
          deletedEans={deletedEans}
          onUndo={onUndo}
          onRemoveEan={ onRemoveEan }
        />
      ) : (
        <>
          <Content>
            <EmptyImage source={Images.bookStack} />
            <DescriptionText>This List is Lonely</DescriptionText>
            <DetailsContainer>
              <DetailsText>Tap </DetailsText>
              <EmptyIcon source={icons.addWishlist} />
              <DetailsText> to save items you love and books</DetailsText>
            </DetailsContainer>
            <DetailsText>for your TBR to a list.</DetailsText>
          </Content>
          <Button
            variant="contained"
            center
            maxWidth
            isAnchor
            onPress={() => {
              push(Routes.SEARCH__SEARCH)
            }}
          >
            Start Browsing
          </Button>
        </>
      )}
      {isOpen === IsOpen.DELETE_ALERT && (
        <Alert
          isOpen={isOpen === IsOpen.DELETE_ALERT}
          title="Remove from list?"
          description="Are you sure you want to remove this item?"
          buttons={[
            {
              title: 'Remove',
              onPress: onDeleteItemFromList,
              showSpinner: awaitRemoveItem,
              warning: true,
            },
          ]}
          onDismiss={() => {
            setIsOpen(undefined)
          }}
        />
      )}
      {isOpen === IsOpen.FILTER_MODAL && (
        <DraggableModal
          isOpen={isOpen === IsOpen.FILTER_MODAL}
          onDismiss={() => {
            setIsOpen(undefined)
          }}
          header={
            <Wrapper>
              <FlexOne>
                <Button linkGreen onPress={resetFilter}>
                  RESET
                </Button>
              </FlexOne>
              <FlexOne>
                <ModalHeaderText>Sort</ModalHeaderText>
              </FlexOne>
              <FlexOne flexEnd>
                <Button
                  icon
                  onPress={() => {
                    setIsOpen(undefined)
                  }}
                >
                  <Icon source={icons.actionClose} />
                </Button>
              </FlexOne>
            </Wrapper>
          }
          hideCloseButton
        >
          <ModalContainer>
            <OptionChip
              chip={{
                name: 'Date Added — Most Recent to Oldest',
                id: Filter.DATE_RECENT,
              }}
              onSelect={() => {
                toggleFilter(Filter.DATE_RECENT)
              }}
              disableIcons
              selected={filter === Filter.DATE_RECENT}
            />
            <OptionChip
              chip={{
                name: 'Date Added — Oldest to Most Recent',
                id: Filter.DATE_RECENT,
              }}
              onSelect={() => {
                toggleFilter(Filter.DATE_OLDEST)
              }}
              disableIcons
              selected={filter === Filter.DATE_OLDEST}
            />
            <OptionChip
              chip={{ name: 'Price - Low to High', id: Filter.DATE_RECENT }}
              onSelect={() => {
                toggleFilter(Filter.PRICE_LOW)
              }}
              disableIcons
              selected={filter === Filter.PRICE_LOW}
            />
            <OptionChip
              chip={{ name: 'Price - High to Low', id: Filter.DATE_RECENT }}
              onSelect={() => {
                toggleFilter(Filter.PRICE_HIGH)
              }}
              disableIcons
              selected={filter === Filter.PRICE_HIGH}
            />
            <OptionChip
              chip={{ name: 'Title - A to Z', id: Filter.DATE_RECENT }}
              onSelect={() => {
                toggleFilter(Filter.TITLE_A)
              }}
              disableIcons
              selected={filter === Filter.TITLE_A}
            />
            <OptionChip
              chip={{ name: 'Title - Z to A', id: Filter.DATE_RECENT }}
              onSelect={() => {
                toggleFilter(Filter.TITLE_Z)
              }}
              disableIcons
              selected={filter === Filter.TITLE_Z}
            />
          </ModalContainer>
        </DraggableModal>
      )}
    </Container>
  )
}

WishListsDetails.navigationOptions = ({ navigation }) => {
  const id = navigation.getParam('_wishListId')
  return {
    header: (headerProps) => (
      <Header
        headerProps={headerProps}
        ctaComponent={<WishListCta id={id} />}
      />
    ),
  }
}

export default connector(WishListsDetails)
