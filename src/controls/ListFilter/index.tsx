import React from 'react'
import { StyleSheet } from 'react-native'
import styled from 'styled-components/native'

import FilterItem from './FilterItem'
import { CONTENT_HORIZONTAL_PADDING, useResponsiveDimensions } from 'src/constants/layout'

const styles = StyleSheet.create({
  contentContainerStyle: {
  },
})

interface ContainerProps {
  currentWidth: number
}

const Container = styled.View<ContainerProps>`
  height: 32px;
  margin-vertical: ${({ theme }) => theme.spacing(1)}px;
  margin-horizontal: ${({ currentWidth }) => -CONTENT_HORIZONTAL_PADDING(currentWidth)};
`

const Scroll = styled.ScrollView`
  flex: 1;
`

/* usage
 enum FilterKeys {
   KEY_1 = 'server_filter_key_1',
   KEY_2 = 'server_filter_key_2',
   KEY_3 = 'server_filter_key_3',
 }

 const FilterKeyNames = {
   [FilterKeys.KEY_1]: 'Title to display',
   [FilterKeys.KEY_2]: 'Title to display',
   [FilterKeys.KEY_3]: 'Title to display',
 }
*/

interface Props {
  filterKeyNames: {[key: string]: string};
  selectedFilterKeys: string | string[];
  onPress: (value: string) => void;
}

const ListFilter = ({ filterKeyNames, selectedFilterKeys, onPress }: Props) => {
  const { width } = useResponsiveDimensions()
  return (
    <Container currentWidth={ width }>
      <Scroll
        contentContainerStyle={ styles.contentContainerStyle }
        showsHorizontalScrollIndicator={ false }
        horizontal
      >
        {
        Object.keys(filterKeyNames).map((key, index) => {
          const selected = selectedFilterKeys === key || (Array.isArray(selectedFilterKeys) && selectedFilterKeys.includes(key))
          return (
            <FilterItem
              key={ key }
              title={ filterKeyNames[key] }
              selected={ selected }
              first={ index === 0 }
              last={ index === Object.keys(filterKeyNames).length - 1 }
              onPress={ () => onPress(key) }
            />
          )
        })
      }
      </Scroll>
    </Container>
  )
}

export default ListFilter
