import React, { useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import _Button from 'src/controls/Button'
import { toTodayTomorrowTimeOrDate } from 'src/helpers/dateFormatters'
import { ReadingStatusUpdate } from 'src/models/SocialModel/NotificationModel'
import { memberNameSelector, milqNodeProfileSelector } from 'src/redux/selectors/userSelector'
import styled from 'styled-components/native'
import ListItem from '../BookGridList/ListItem'
import UserIcon from '../UserIconList/UserIcon'
import { bookSelector } from 'src/redux/selectors/booksListSelector'
import { BookModel, Ean } from 'src/models/BookModel'
import { push, Params, Routes } from 'src/helpers/navigationService'
import { TouchableOpacity } from 'react-native'
import { fetchNodeProfileAction } from 'src/redux/actions/user/nodeProfileActions'
import { fetchBooksAction } from 'src/redux/actions/book/bookAction'
import { NodeProfileModel } from 'src/models/UserModel/NodeProfileModel'
import { isEmpty } from 'src/helpers/objectHelpers'


const Container = styled.TouchableOpacity`
  border: ${props => props.theme.palette.disabledGrey};
  border-radius: 4;
  background-color: ${props => props.theme.palette.white};
  ${({ theme }) => theme.boxShadow.container}
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


const ButtonContainer = styled.View`
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing(2)};
`

const Button = styled(_Button)`
  padding: ${({ theme }) => theme.spacing(1)}px;
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

interface OwnProps{
  item: ReadingStatusUpdate
}

interface StateProps {
  userName: string
  book: BookModel
  nodeProfile: NodeProfileModel | {}
}

const selector = (state, ownProps) => ({
  userName: memberNameSelector(state, { uid: ownProps.item.uid }),
  book: bookSelector(state, { ean: ownProps.item.statusUpdates.ean }),
  nodeProfile: milqNodeProfileSelector(state, ownProps.item.uid),
})

interface DispatchProps {
  fetchNodeProfile: (uid: string) => void;
  fetchBook: (ean: Ean) => void
}

const dispatcher = dispatch => ({
  fetchNodeProfile: uid => dispatch(fetchNodeProfileAction(uid)),
  fetchBook: (ean: Ean) => dispatch(fetchBooksAction([ean])),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(selector, dispatcher)

type Props = OwnProps & StateProps & DispatchProps

enum BookReadingStatus{
  wtr = 'To Be Read',
  reading = 'Reading',
  read = 'Finished'
}

const HistoryReadingStatusUpdate = ({ item, userName, book, nodeProfile, fetchNodeProfile, fetchBook }: Props) => {
  const readingStatus = BookReadingStatus[item.statusUpdates.status]

  const seeFullList = async () => {
    if (!Object.keys(nodeProfile).length) {
      await fetchNodeProfile(item.uid)
    }

    push(Routes.MY_BOOKS__READING_STATUS_LIST, {
      [Params.TITLE]: readingStatus,
      [Params.READING_STATUS]: item.statusUpdates.status,
      [Params.MILQ_MEMBER_UID]: item.uid,
    })
  }
  // fetch missing book detail
  const { ean } = item.statusUpdates
  useEffect(() => {
    if (isEmpty(book) && ean) {
      fetchBook(ean)
    }
  }, [ean, book])

  const pushToProfileScreen = useCallback(() => {
    push(Routes.PROFILE__MAIN, { [Params.MILQ_MEMBER_UID]: item.uid })
  }, [item.uid])

  return (
    <Container onPress={ seeFullList }>
      <HeaderWrapper>
        <TouchableOpacity onPress={ pushToProfileScreen }>
          <UserIcon userId={ item.uid || '' } />
        </TouchableOpacity>
        <Column>
          <Username>
            {userName}
            {' '}
              updated status for a book.
          </Username>
          <Time>{toTodayTomorrowTimeOrDate(new Date(item.creationDate))}</Time>
        </Column>
      </HeaderWrapper>
      <BodyWrapper>
        <ListName>{readingStatus}</ListName>
        <ListItem bookOrEan={ book } />
        <ButtonContainer>
          <Button onPress={ seeFullList } size="small" linkGreen>See List</Button>
        </ButtonContainer>
      </BodyWrapper>
    </Container>
  )
}

export default React.memo(connector(HistoryReadingStatusUpdate))
