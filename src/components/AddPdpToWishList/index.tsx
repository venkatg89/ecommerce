import React, { useState, useEffect, useContext } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { useToast } from 'native-base'
import styled, { ThemeContext } from 'styled-components/native'

import Button from 'src/controls/Button'
import Modal from './Modal'
import CreateNewListModal from 'src/components/Modals/CreateNewList'

import { BookModel } from 'src/models/BookModel'
import { ReviewsStateModel } from 'src/models/PdpModel'

import { wishListsSelector } from 'src/redux/selectors/wishListSelector'
import { WishListModel } from 'src/models/WishListModel'
import { getWishListsAction } from 'src/redux/actions/wishList/wishListAction'
import { icons } from 'assets/images'
import { ThemeModel } from 'src/models/ThemeModel'
import { getSuccessToastStyle } from 'src/constants/layout'
import { addItemToWishListAction } from 'src/redux/actions/wishList/wishListAction'
import { checkIsUserLoggedOutToBreakAction } from 'src/redux/actions/modals/guestUser'

import { addEventAction, LL_ADD_TO_LIST } from 'src/redux/actions/localytics'

const Icon = styled.Image`
  height: ${({ theme }) => theme.spacing(3)};
  width: ${({ theme }) => theme.spacing(3)};
  tint-color: ${({ theme }) => theme.palette.moderateRed};
`

const ButtonText = styled.Text`
  margin-left: ${({ theme }) => theme.spacing(1)};
  color: ${({ theme }) => theme.palette.primaryGreen};
  ${({ theme }) => theme.typography.button.small}
  text-transform: uppercase;
`

const OverlayButton = styled.TouchableOpacity``

interface OwnProps {
  style?: any
  ean: string
  CustomButton?: React.ReactNode
  addToDefault?: boolean
  product?: BookModel
  reviews?: ReviewsStateModel
}

interface StateProps {
  wishLists: WishListModel[]
}

const selector = createStructuredSelector({
  wishLists: wishListsSelector,
})

interface DispatchProps {
  getWishLists: () => void
  addItemToWishList: (params) => boolean
  checkIsUserLoggedOutToBreak: () => boolean
  addEvent: (name, attributes) => void
}

const dispatcher = (dispatch) => ({
  getWishLists: () => dispatch(getWishListsAction()),
  addItemToWishList: (params) => dispatch(addItemToWishListAction(params)),
  checkIsUserLoggedOutToBreak: () =>
    dispatch(checkIsUserLoggedOutToBreakAction()),
  addEvent: (name, attributes) => dispatch(addEventAction(name, attributes)),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(
  selector,
  dispatcher,
)

type Props = StateProps & DispatchProps & OwnProps

enum IsModalOpen {
  ADD_PDP = 'add_pdp',
  CREATE_LIST = 'create_list',
  ADDED_DEFAULT_TOAST = 'added_default_toast',
}

const AddToWishListButton = ({
  style,
  CustomButton,
  getWishLists,
  wishLists,
  ean,
  addToDefault,
  addItemToWishList,
  checkIsUserLoggedOutToBreak,
  addEvent,
  product,
  reviews,
}: Props) => {
  const toast = useToast()
  const [isOpen, setIsOpen] = useState<IsModalOpen | undefined>(undefined)
  const theme = useContext(ThemeContext) as ThemeModel
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!!isOpen || addToDefault) {
      getWishLists()
    }
  }, [isOpen])

  const toggleCreateNewList = () => {
    setIsOpen(IsModalOpen.CREATE_LIST)
  }

  const isInWishList = wishLists
    .map((wishList) => wishList.items)
    .flat()
    .map((item) => item.ean)
    .includes(ean)

  const onAddToList = async () => {
    if (checkIsUserLoggedOutToBreak()) {
      return
    }
    if (isInWishList) {
      setIsOpen(IsModalOpen.ADD_PDP)
      return
    } else {
      if (isInWishList) {
        setIsOpen(IsModalOpen.ADD_PDP)
        return
      }
      if (addToDefault) {
        setIsLoading(true)
        const defaultWishList = wishLists.find((wishList) => wishList.default)
        if (defaultWishList) {
          const success = await addItemToWishList({
            id: defaultWishList.id,
            ean,
          })
          if (success) {
            /* @ts-ignore */
            toast.show({
              title: `Added to ${defaultWishList.name}`,
              ...getSuccessToastStyle(theme),
            })
            setIsOpen(IsModalOpen.ADDED_DEFAULT_TOAST)

            if (product && reviews) {
              const readSample = {
                productFormat: product.parentFormat,
                productTitle: product.name,
                productId: product.ean,
                starRating: reviews[product.ean]
                  ? reviews[product.ean].ratings
                  : 0,
              }
              addEvent(LL_ADD_TO_LIST, readSample)
            }
          }
        } else {
          setIsOpen(IsModalOpen.ADD_PDP)
        }
        setIsLoading(false)
      } else {
        setIsOpen(IsModalOpen.ADD_PDP)
      }
    }
  }

  return (
    <>
      {(CustomButton && (
        <OverlayButton onPress={onAddToList}>{CustomButton}</OverlayButton>
      )) || (
        <Button
          style={ style }
          onPress={onAddToList}
          variant="outlined"
          linkGreen
          icon
          showSpinner={isLoading}
        >
          <Icon source={isInWishList ? icons.favorite : icons.addWishlist} />
          <ButtonText>
            {isInWishList ? 'Change List' : 'Add to List'}
          </ButtonText>
        </Button>
      )}
      {isOpen === IsModalOpen.ADD_PDP && (
        <Modal
          isOpen={isOpen === IsModalOpen.ADD_PDP}
          onDismiss={() => {
            setIsOpen(undefined)
          }}
          ean={ean}
          toggleCreateNewList={toggleCreateNewList}
        />
      )}
      {isOpen === IsModalOpen.CREATE_LIST && (
        <CreateNewListModal
          isOpen={isOpen === IsModalOpen.CREATE_LIST}
          onDismiss={() => {
            setIsOpen(IsModalOpen.ADD_PDP)
          }}
        />
      )}
    </>
  )
}

export default connector(AddToWishListButton)
