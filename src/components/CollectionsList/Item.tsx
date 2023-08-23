import React from 'react'
import styled from 'styled-components/native'

import { push, Routes, Params } from 'src/helpers/navigationService'
import { CollectionAndReadingStatusModel } from 'src/models/CollectionModel'

import { icons } from 'assets/images'

const Container = styled.TouchableOpacity``

const TitleText = styled.Text`
  flex: 1;
  ${({ theme }) => theme.typography.subTitle1};
  margin-bottom: 10;
`

const BooksText = styled.Text`
  ${({ theme }) => theme.typography.body2};
`

const Header = styled.View`
  flex-direction: row;
`
const Icon = styled.Image`
  width: ${({ theme }) => theme.spacing(2)};
  height: ${({ theme }) => theme.spacing(2)};
`

interface Props {
  collection: CollectionAndReadingStatusModel;
}

const CollectionItem = ({ collection }: Props) => {
  const handleClickList = () => {
    if (['wtr', 'reading', 'read'].includes(collection.id)) {
      const navParams = {
        [Params.TITLE]: collection.name,
        [Params.READING_STATUS]: collection.id,
        [Params.MILQ_MEMBER_UID]: collection.milqUserId,
      }
      push(Routes.MY_BOOKS__READING_STATUS_LIST, navParams)
    } else {
      const navParams = {
        [Params.TITLE]: collection.name,
        [Params.COLLECTION_ID]: collection.id,
      }
      push(Routes.MY_BOOKS__LIST, navParams)
    }
  }

  return (
    <Container onPress={ handleClickList }>
      <Header>
        <TitleText>
          { collection.name }
        </TitleText>
        { !collection.public &&
          <Icon source={ icons.lockClosed } />
        }
      </Header>
      <BooksText>
        { `${Object.keys(collection.books || {}).length} books`}
      </BooksText>
    </Container>
  )
}

export default CollectionItem
