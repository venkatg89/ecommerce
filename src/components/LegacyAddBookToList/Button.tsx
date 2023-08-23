import React from 'react'

const AddBookToListButton = () => <></>

// import { connect } from 'react-redux'
// import { NavigationParams, NavigationInjectedProps, withNavigation } from 'react-navigation'
// import { createStructuredSelector } from 'reselect'
// import styled from 'styled-components/native'
//
// import { icons } from 'assets/images'
//
// import Button, { Size } from 'src/controls/Button'
// import AddBookToListModal from './AddBookToListModal'
// import CreateListModal from './CreateListModal'
//
// import countLabelText from 'src/helpers/countLabelText'
//
// import { checkIsUserLoggedOutToBreakAction } from 'src/redux/actions/modals/guestUser'
// import { setRouteToRedirectPostLoginAction } from 'src/redux/actions/onboarding'
// import { isBookAddedToAnyListSelector, getNumberOfCollectionsBookAddedToSelector } from 'src/redux/selectors/myBooks/collectionSelector'
//
// import Routes from 'src/constants/routes'
//
// const Icon = styled.Image`
//   height: ${({ theme }) => theme.spacing(2)};
//   width: ${({ theme }) => theme.spacing(2)};
//   margin-right: ${({ theme }) => theme.spacing(1)};
// `
//
// interface ButtonTextProps {
//   size: Size
// }
//
// const Text = styled.Text<ButtonTextProps>`
//   ${({ theme, size }) => theme.typography.button[size]}
//   color: ${({ theme }) => theme.palette.grey1};
//   text-transform: uppercase;
// `
//
// type ModalState = 'Closed' | 'AddToList' | 'CreateList'
//
// interface OwnProps {
//   style?: any;
//   ean: string;
//   onPress?: () => void;
//   isAddedOverride?: boolean;
//   size?: Size
// }
//
// interface StateProps {
//   isAddedToList: boolean;
//   collectionsAddedTo: number;
// }
//
// const selector = createStructuredSelector({
//   isAddedToList: (state, ownProps) => {
//     const { ean } = ownProps
//     return isBookAddedToAnyListSelector(state, { ean })
//   },
//   collectionsAddedTo: (state, ownProps) => {
//     const { ean } = ownProps
//     return getNumberOfCollectionsBookAddedToSelector(state, { ean })
//   },
// })
//
// interface DispatchProps {
//   checkIsUserLoggedOutToBreak: () => boolean;
//   setRedirect: (params: NavigationParams) => void
// }
//
// const dispatcher = dispatch => ({
//   checkIsUserLoggedOutToBreak: () => dispatch(checkIsUserLoggedOutToBreakAction()),
//   setRedirect: (params: NavigationParams) => dispatch(setRouteToRedirectPostLoginAction({ route: Routes.PDP__MAIN, params })),
// })
//
// const connector = connect<StateProps, DispatchProps, OwnProps>(selector, dispatcher)
//
// type Props = StateProps & DispatchProps & OwnProps & NavigationInjectedProps
//
// const AddBookToListButton = ({ style, ean, onPress, isAddedOverride, isAddedToList, checkIsUserLoggedOutToBreak, size = 'small', collectionsAddedTo, setRedirect, navigation }: Props) => {
//   const [modalState, setModalState] = useState<ModalState>('Closed')
//   const [collectionIdState, setCollectionIdState] = useState()
//   const [optionsState, setOptionsState] = useState({})
//
//   const isAdded = isAddedOverride || ((typeof isAddedOverride === 'undefined') && isAddedToList)
//
//   const _onCreateListSuccess = collectionId => setCollectionIdState(collectionId)
//   const _onCreateListDismiss = () => setModalState('AddToList')
//
//   const _onAddBookDismiss = () => { setModalState('Closed') }
//   const _onAddBookCreateList = (options) => {
//     setOptionsState(options)
//     setModalState('CreateList')
//   }
//
//   const _onPress = () => {
//     if (onPress) { onPress(); return }
//     if (checkIsUserLoggedOutToBreak()) {
//       if (navigation.state.routeName === Routes.SEARCH__MAIN_LEGACY) {return}
//       setRedirect({ ean })
//       return
//     }
//     setModalState('AddToList')
//   }
//   return (
//     <>
//       <Button
//         accessible
//         style={ style }
//         variant="outlined"
//         size={ size }
//         onPress={ _onPress }
//         icon
//       >
//         <Icon source={ isAdded ? icons.edit : icons.add } />
//         <Text
//           accessibilityLabel={ isAdded ? 'Book Added' : 'Add Book to List' }
//           size={ size }
//         >
//           { isAdded ? `In ${countLabelText(collectionsAddedTo, 'List', 'Lists')}` : 'Add to List' }
//         </Text>
//       </Button>
//       { modalState !== 'CreateList' // React-native modal only handles one modal at a time, render only 1 during animaion change
//         ? (
//           <AddBookToListModal
//             isOpen={ modalState === 'AddToList' }
//             onDismiss={ _onAddBookDismiss }
//             onCreateList={ _onAddBookCreateList }
//             ean={ ean }
//             newCollectionId={ collectionIdState }
//             options={ optionsState }
//           />
//         ) : (
//           <CreateListModal
//             isOpen={ modalState === 'CreateList' }
//             onSuccess={ _onCreateListSuccess }
//             onDismiss={ _onCreateListDismiss }
//           />
//         )
//       }
//     </>
//   )
// }

export default AddBookToListButton
