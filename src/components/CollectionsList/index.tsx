import React, { useCallback, useEffect } from 'react'
import { FlatList, StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import CollectionItem from './Item'

import { CollectionAndReadingStatusModel, CollectionPrivacyNames, CollectionModel, CollectionsSortNames } from 'src/models/CollectionModel'
import { ReadingStatus } from 'src/models/ReadingStatusModel'

import { FilterState } from 'src/screens/myBooks/CollectionsList'

const Spacing = styled.View`
  height: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.palette.grey3};
  margin-vertical: ${({ theme }) => theme.spacing(2)};
`

interface Props {
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
  collections: CollectionAndReadingStatusModel[] // TODO: use Id
  currentFilter: FilterState
  setCount: (count: number) => void
}

const CollectionsList = ({ style, contentContainerStyle, collections, currentFilter, setCount }: Props) => {
  const { filter, sort } = currentFilter
  let sortedCollections = [...collections]
  const getSorted = useCallback(() => {
    if (filter) {
      const filterKey = filter !== CollectionPrivacyNames.PRIVACY
      sortedCollections = collections.filter(list => list.public === filterKey)
    }
    switch (sort) {
      case CollectionsSortNames.A_Z:
        sortedCollections = sortedCollections.sort((a, b) => {
          const aKey = a.name || 'zzz'
          const bKey = b.name || 'zzz'
          if (bKey > aKey) {return -1}
          if (aKey > bKey) {return 1}
          return 0
        })
        break
      default: {
        const filterKey = Object.values(ReadingStatus) as string[]
        // reading list doesn't have crated date so filter out and added after
        const readingList = sortedCollections.filter(list => filterKey.includes(list.id))
        const filteredCollections = sortedCollections.filter(list => !readingList.includes(list)) as CollectionModel[]
        sortedCollections = [...filteredCollections.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()), ...readingList]
      }
    }
  }, [sort, filter, sortedCollections])
  getSorted()

  useEffect(() => {
    setCount(sortedCollections.length)
  }, [sortedCollections.length])

  return (
    <FlatList
      style={ style }
      contentContainerStyle={ contentContainerStyle }
      data={ sortedCollections }
      keyExtractor={ item => item.id }
      renderItem={ ({ item }) => (
        <CollectionItem collection={ item } />
      ) }
      ItemSeparatorComponent={ Spacing }
    />
  )
}

export default CollectionsList
