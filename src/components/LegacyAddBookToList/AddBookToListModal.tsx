import React from 'react'
// import { connect } from 'react-redux'
// import styled, { ThemeContext } from 'styled-components/native'
//
// import _Button from 'src/controls/Button'
// import _RadioButton from 'src/controls/Button/RadioButton'
// import DraggableModal from 'src/controls/Modal/BottomDraggable'
// import ListEmptyState from 'src/controls/EmptyState/ListEmptyState'
//
// import { isEmpty } from 'src/helpers/objectHelpers'
// import { ReadingStatus, ReadingStatusListUpdate } from 'src/models/ReadingStatusModel'
// import { CollectionId, CollectionModel, CollectionEditModel } from 'src/models/CollectionModel'
// import { NookListItem } from 'src/models/BookModel'
//
// import { updateCollectionsAction } from 'src/redux/actions/collections/updateActions'
// import { updateReadingStatusAction } from 'src/redux/actions/user/nodeProfileActions'
// import { singleBookReadingStatusSelector } from 'src/redux/selectors/myBooks/readingStatusSelector'
// import {
//   myCollectionIdsForBookSelector, myCollectionsSelector,
// } from 'src/redux/selectors/myBooks/collectionSelector'
// import { workIdFromEanSelector, bookInNookLibrarySelector } from 'src/redux/selectors/booksListSelector'
//
// import { addEventAction, LL_BOOK_ADDED_TO_LIST, LL_READING_STATUS_UPDATE } from 'src/redux/actions/localytics'
// import { icons } from 'assets/images'
// import { ThemeModel } from 'src/models/ThemeModel'
//
//
// const HeaderText = styled.Text`
//   ${({ theme }) => theme.typography.subTitle2}
//   color: ${({ theme }) => theme.palette.grey2};
// `
//
// const RadioButton = styled(_RadioButton)`
//   margin-top: ${({ theme }) => theme.spacing(2)};
// `
//
// const ButtonContainer = styled.View`
//   padding: ${({ theme }) => theme.spacing(2)}px;
//   padding-bottom: 0;
// `
//
// const Button = styled(_Button)`
//   padding: ${({ theme }) => theme.spacing(1)}px;
//   border-color: ${({ theme }) => theme.palette.linkGreen};
// `
//
// const Divider = styled.View`
//   margin-vertical: ${({ theme }) => theme.spacing(2)};
//   height: 1;
//   width: 100%;
//   background-color: ${({ theme }) => theme.palette.grey2};
// `
// const HeaderContainer = styled.View`
//   flex-direction: row;
//   align-items: center;
//   margin-bottom: ${({ theme }) => theme.spacing(4)};
//   margin-horizontal: ${({ theme }) => theme.spacing(2)};
// `
//
// const TitleText = styled.Text`
//   ${({ theme }) => theme.typography.body1};
//   color: ${({ theme }) => theme.palette.grey1};
//   text-align: center;
//   flex: 1;
//   padding-left:  ${({ theme }) => theme.spacing(3)};
// `
//
// const Icon = styled.Image`
//   width: ${({ theme }) => theme.spacing(3)};
//   height: ${({ theme }) => theme.spacing(3)};
// `
//
// const IconButton = styled(_Button)`
//   align-self: flex-end;
// `
//
// const NookBookInfoText = styled.Text`
//   ${({ theme }) => theme.typography.body2};
//   color: ${({ theme }) => theme.palette.grey2};
//   margin-top: ${({ theme }) => theme.spacing(1)};
// `
//
// interface OwnProps {
//   ean: string;
//   isOpen: boolean;
//   onDismiss: () => void;
//   onCreateList: (options) => void;
//   newCollectionId?: string;
//   options?: any
// }
//
// interface StateProps {
//   workId: number;
//   readingStatus?: ReadingStatus
//   collectionIdsForBook: CollectionId[]
//   allCollections: CollectionModel[]
//   nookBooks: NookListItem[]
// }
//
// const selector = () => {
//   const _singleBookReadingStatusSelector = singleBookReadingStatusSelector()
//   const _bookInNookLibrarySelector = bookInNookLibrarySelector()
//   return ((state, ownProps) => ({
//     workId: workIdFromEanSelector(state, { ean: ownProps.ean }),
//     readingStatus: _singleBookReadingStatusSelector(state, { ean: ownProps.ean }),
//     collectionIdsForBook: myCollectionIdsForBookSelector(state, { ean: ownProps.ean }),
//     allCollections: myCollectionsSelector(state),
//     nookBooks: _bookInNookLibrarySelector(state, ownProps),
//   }))
// }
//
// interface DispatchProps {
//   updateReadingStatus: (params: ReadingStatusListUpdate) => void;
//   updateCollections: (params: Record<CollectionId, CollectionEditModel>) => void;
//   addEvent: (name, attributes) => void
// }
//
// const dispatcher = dispatch => ({
//   updateReadingStatus: params => dispatch(updateReadingStatusAction(params)),
//   updateCollections: params => dispatch(updateCollectionsAction(params)),
//   addEvent: (name, attributes) => dispatch(addEventAction(name, attributes)),
// })
//
// const connector = connect<StateProps, DispatchProps, OwnProps >(selector, dispatcher)
//
// type Props = StateProps & DispatchProps & OwnProps

const AddBookToListModal = () => <></>

// ({ ean, isOpen, onDismiss, onCreateList, readingStatus, allCollections,
//   newCollectionId, collectionIdsForBook, updateReadingStatus, updateCollections, workId, addEvent, nookBooks, options,
// }: Props) => {
//   const theme = useContext(ThemeContext) as ThemeModel
//   const buttonStyles = {
//     textTransform: 'uppercase', color: theme.palette.linkGreen,
//   }
//
//   // keep updated states here and make update call onClose
//   const [readingStatusState, setReadingStatusState] = useState<(ReadingStatus | undefined)>(readingStatus)
//   const [listsAddedStates, setListsAddedState] = useState<CollectionId[]>(collectionIdsForBook)
//
//   useEffect(() => {
//     setReadingStatusState(readingStatus)
//     setListsAddedState(collectionIdsForBook)
//   }, [readingStatus, collectionIdsForBook])
//
//   useEffect(() => {
//     if (newCollectionId) {
//       if (!listsAddedStates.includes(newCollectionId)) {
//         setListsAddedState([...listsAddedStates, newCollectionId])
//       }
//     }
//   }, [newCollectionId])
//
//   useEffect(() => {
//     if (Object.keys(options).length) {
//       setReadingStatusState(options.reading)
//       setListsAddedState(options.lists)
//     }
//   }, [options])
//
//   // update
//   const onUpdate = () => {
//     const newlyAddedLists = listsAddedStates.filter(list => !collectionIdsForBook.includes(list)).reduce((object, list) => {
//       object[list] = { books: { [ean]: {} } } // eslint-disable-line
//       return object
//     }, {})
//     const removedLists = collectionIdsForBook.filter(list => !listsAddedStates.includes(list)).reduce((object, list) => {
//       object[list] = { books: { [ean]: null } } // eslint-disable-line
//       return object
//     }, {})
//
//     const updateReadingStatusPromise = (readingStatusState !== readingStatus) && updateReadingStatus({ [ean]: { status: readingStatusState || null, workId } }) || null
//     const updateCollectionsPromise = (!isEmpty(newlyAddedLists) || !isEmpty(removedLists)) && updateCollections({ ...newlyAddedLists, ...removedLists }) || null
//
//     Promise.all([
//       updateReadingStatusPromise,
//       updateCollectionsPromise,
//     ])
//   }
//
//   const handleCloseModal = () => {
//     onUpdate()
//     onDismiss()
//   }
//
//   const handlePressReadingStatus = (status: ReadingStatus) => () => {
//     setReadingStatusState(readingStatusState === status ? undefined : status)
//     addEvent(LL_READING_STATUS_UPDATE, { ean, status })
//   }
//
//   const onPressRadioButton = collection => () => {
//     const newListsAddedStates = listsAddedStates.includes(collection.id)
//       ? listsAddedStates.filter(list => list !== collection.id) // remove from list
//       : [...listsAddedStates, collection.id] // add to list
//     setListsAddedState(newListsAddedStates)
//     addEvent(LL_BOOK_ADDED_TO_LIST, { ean, collection })
//   }
//
//   const _onCreateList = () => {
//     onCreateList({ reading: readingStatusState, lists: listsAddedStates })
//   }
//   return (
//     <DraggableModal
//       hideCloseButton
//       isOpen={ isOpen }
//       onDismiss={ handleCloseModal }
//       fullContent
//       footer={ (
//         <ButtonContainer>
//           <Button
//             variant="outlined"
//             onPress={ _onCreateList }
//             textStyle={ buttonStyles }
//             maxWidth
//             center
//           >
//             Create a new List
//           </Button>
//         </ButtonContainer>
//       ) }
//       header={ (
//         <HeaderContainer>
//           <TitleText>Add to List</TitleText>
//           <IconButton
//             icon
//             onPress={ handleCloseModal }
//           >
//             <Icon source={ icons.actionClose } />
//           </IconButton>
//         </HeaderContainer>
//       ) }
//     >
//       <HeaderText>Reading List</HeaderText>
//       {nookBooks.length > 0 && <NookBookInfoText>You have this book in your NOOK library. The Reading List will automatically update as you read.</NookBookInfoText> }
//       <RadioButton
//         disabled={ !!nookBooks.length }
//         selected={ readingStatusState === ReadingStatus.TO_BE_READ }
//         onPress={ handlePressReadingStatus(ReadingStatus.TO_BE_READ) }
//         text
//       >
//         To Be Read
//       </RadioButton>
//       <RadioButton
//         disabled={ !!nookBooks.length }
//         selected={ readingStatusState === ReadingStatus.READING }
//         onPress={ handlePressReadingStatus(ReadingStatus.READING) }
//         text
//       >
//         Reading
//       </RadioButton>
//       <RadioButton
//         disabled={ !!nookBooks.length }
//         selected={ readingStatusState === ReadingStatus.FINISHED }
//         onPress={ handlePressReadingStatus(ReadingStatus.FINISHED) }
//         text
//       >
//         Finished
//       </RadioButton>
//       <Divider accessible={ false } />
//       <HeaderText>Created Lists</HeaderText>
//       {allCollections.length < 1 ? (
//         <ListEmptyState title="Start making your own lists today." description="The sky&apos;s the limit." />
//       ) : (
//         <>
//           { allCollections.map(collection => (
//             <RadioButton
//               key={ collection.id }
//               selected={ listsAddedStates.includes(collection.id) }
//               onPress={ onPressRadioButton(collection) }
//               checkboxStyle
//               text
//             >
//               { collection.name }
//             </RadioButton>
//           )) }
//         </>
//       )}
//     </DraggableModal>
//   )
// }

export default AddBookToListModal
