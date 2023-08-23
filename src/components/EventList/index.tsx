import React from 'react'
import { SectionList } from 'react-native'
import styled from 'styled-components/native'

import EventListItem from './Item'

import { EventModel } from 'src/models/StoreModel'
import { formatListWithDateToMonthSectionsData } from 'src/helpers/sectionList'

const HeaderContainer = styled.View`
  padding-bottom: ${({ theme }) => theme.spacing(1)};
  border-bottom-width: 1;
  border-color: rgb(119, 119, 119);
  background-color: ${({ theme }) => theme.palette.white};
`
const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey2};
`

const SectionSpacing = styled.View`
  height: ${({ theme }) => theme.spacing(2)};
`

const ItemSpacing = styled.View`
  height: ${({ theme }) => theme.spacing(3)};
`

interface Props {
  eventList: EventModel[] // TODO: use Id
  onRefresh?: () => void
  onEndReached?: () => void
  fetching?: boolean
  stack?: string
}

const EventList = ({
  eventList,
  fetching,
  onRefresh,
  onEndReached,
  stack,
}: Props) => {
  const renderSectionHeader = (item) => (
    <HeaderContainer>
      <HeaderText>{item.section.title}</HeaderText>
    </HeaderContainer>
  )

  const renderItem = (child) => (
    <EventListItem eventId={child.item.id} stack={stack} />
  )

  const renderSectionFooter = () => <SectionSpacing />

  const sectionsData = formatListWithDateToMonthSectionsData<EventModel>(
    eventList,
  ) // TODO type

  return (
    <SectionList
      contentContainerStyle={{
        paddingHorizontal: 2,
        marginTop: 16,
      }}
      sections={sectionsData}
      keyExtractor={(item) => item.id}
      refreshing={fetching}
      onRefresh={onRefresh}
      onEndReached={onEndReached}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      SectionSeparatorComponent={SectionSpacing}
      ItemSeparatorComponent={ItemSpacing}
      renderSectionFooter={renderSectionFooter}
    />
  )
}

export default EventList
