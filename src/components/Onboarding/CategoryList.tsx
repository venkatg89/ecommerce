import React, { useCallback } from 'react'
import { FlatList, StyleProp, ViewStyle } from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import { communitiesInterestsListSelector } from 'src/redux/selectors/communities/interestsListSelector'

import { CommunitiesInterestsList } from 'src/models/Communities/InterestModel'

import InterestItem from 'src/components/InterestItem'

const Spacing = styled.View`
  height: ${({ theme }) => theme.spacing(2)};
`

interface OwnProps {
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  onPress: (interestId) => void
  selectedCategories: number[]
}

interface StateProps {
  interestList: CommunitiesInterestsList
}

const selector = createStructuredSelector({
  interestList: communitiesInterestsListSelector,
})

type Props = StateProps & OwnProps

const connector = connect<StateProps, {}, OwnProps>(selector)

const CategoryList = ({ style, contentContainerStyle, interestList, onPress, selectedCategories }: Props) => {
  const renderItem = useCallback(({ item }) => (
    <InterestItem
      themeColor={ `#${item.customAttributes.themeColor}` }
      interestId={ item.id }
      name={ `${item.name}` }
      onPress={ onPress }
      selected={ selectedCategories.includes(item.id) }
      isRadioButton
    />
  ), [selectedCategories, onPress])

  const keyExtractor = useCallback(item => item.id.toString(), [])

  return (
    <FlatList
      style={ style }
      contentContainerStyle={ contentContainerStyle }
      data={ interestList }
      keyExtractor={ keyExtractor }
      renderItem={ renderItem }
      extraData={ selectedCategories }
      ItemSeparatorComponent={ Spacing }
    />
  )
}

export default React.memo(connector(CategoryList))
