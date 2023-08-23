import React, { useContext, useEffect, useMemo, useCallback } from 'react'
import { connect } from 'react-redux'
import { toTodayTomorrowTimeOrDate } from 'src/helpers/dateFormatters'
import { CollectionCreated, CollectionBookAdded } from 'src/models/SocialModel/NotificationModel'
import { memberNameSelector } from 'src/redux/selectors/userSelector'
import { fetchBooksAction } from 'src/redux/actions/book/bookAction'
import styled, { ThemeContext } from 'styled-components/native'
import _BookCarousel from 'src/components//LegacyBookCarousel'
import UserIcon from '../UserIconList/UserIcon'
import _Button from 'src/controls/Button'
import ListItem from '../BookGridList/ListItem'
import { BookModel, Ean } from 'src/models/BookModel'
import { bookSelector } from 'src/redux/selectors/booksListSelector'
import { push, Params, Routes } from 'src/helpers/navigationService'
import { TouchableOpacity } from 'react-native'
import { isEmpty } from 'src/helpers/objectHelpers'

const Container = styled.TouchableOpacity`
  border: ${props => props.theme.palette.disabledGrey};
  border-radius: 4;
  background-color: ${props => props.theme.palette.white};
  ${({ theme }) => theme.boxShadow.container}
`

const HeaderWrapper = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-left: ${({ theme }) => theme.spacing(2)};
  padding-top: ${({ theme }) => theme.spacing(1)};
`

const Column = styled.View`
  flex:1;
  flex-direction:column;
  padding-left: ${({ theme }) => theme.spacing(2)};
`

const Username = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color:${({ theme }) => theme.palette.grey1};
`

const Time = styled.Text`
  ${({ theme }) => theme.typography.caption};
  color:${({ theme }) => theme.palette.grey2};
`

const BodyWrapper = styled.View`
  padding:0px ${({ theme }) => theme.spacing(2)}px ${({ theme }) => theme.spacing(3)}px ${({ theme }) => theme.spacing(2)}px;
`

const ListName = styled.Text`
  text-align: center;
  color: ${({ theme }) => theme.palette.grey1};
  margin: ${({ theme }) => theme.spacing(3)}px 0px;
  ${({ theme }) => theme.typography.heading2};
`

const BookCarousel = styled(_BookCarousel)`
  margin: ${({ theme }) => theme.spacing(2)}px 0px;
`

const ButtonContainer = styled.View`
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing(2)};
`

const Button = styled(_Button)`
  padding: ${({ theme }) => theme.spacing(1)}px;
`

interface OwnProps{
  item: CollectionCreated | CollectionBookAdded
  createdNewList?: boolean
}

interface StateProps {
  userName: string
  book: BookModel
}

interface DispatchProps {
  fetchBooks: (ean: Ean) => void
}

const selector = (state, ownProps) => ({
  userName: memberNameSelector(state, { uid: ownProps.item.uid }),
  book: bookSelector(state, { ean: ownProps.item.addedBook }) || null,
})

const dispatcher = dispatch => ({
  fetchBooks: ean => dispatch(fetchBooksAction([ean])),
})


const connector = connect<StateProps, DispatchProps, OwnProps>(selector, dispatcher)

type Props = OwnProps & StateProps & DispatchProps

const HistoryItem = ({ item, userName, createdNewList, book, fetchBooks }: Props) => {
  const { spacing } = useContext(ThemeContext)
  const onSeeAllTap = () => { push(Routes.MY_BOOKS__LIST, { [Params.COLLECTION_ID]: item.collection.id }) }
  useEffect(() => {
    if (!createdNewList) {
      // when book fetch failed in notifications get book details
      const collectionAdded = item as CollectionBookAdded
      const ean = collectionAdded.addedBook
      if (isEmpty(book) && ean) {
        fetchBooks(ean)
      }
    }
  }, [item])

  const pushToProfileScreen = useCallback(() => {
    push(Routes.PROFILE__MAIN, { [Params.MILQ_MEMBER_UID]: item.uid })
  }, [item.uid])


  const renderItem = useMemo(() => {
    if (createdNewList) {
      return (
        <BookCarousel
          bookOrEanList={ Object.keys(item.collection.books) }
          bookMaxHeight={ spacing(13) }
          bookMaxWidth={ spacing(9) }
        />
      )
    }
    return <ListItem bookOrEan={ book } />
  }, [item, createdNewList, book])

  return (
    <Container onPress={ onSeeAllTap }>
      <HeaderWrapper>
        <TouchableOpacity onPress={ pushToProfileScreen }>
          <UserIcon userId={ item.uid || '' } />
        </TouchableOpacity>
        <Column>
          <Username>
            {userName}
            {' '}
            {createdNewList ? 'created a list.' : 'added to a list'}
          </Username>
          <Time>{toTodayTomorrowTimeOrDate(new Date(item.creationDate))}</Time>
        </Column>
      </HeaderWrapper>
      <BodyWrapper>
        <ListName>{item.collection.name}</ListName>
        {renderItem}
        <ButtonContainer>
          <Button onPress={ onSeeAllTap } size="small" linkGreen>
            See List
          </Button>
        </ButtonContainer>
      </BodyWrapper>
    </Container>
  )
}

export default React.memo(connector(HistoryItem))
