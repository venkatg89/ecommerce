import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'
import { createStructuredSelector } from 'reselect'
import NavigationService from 'src/helpers/navigationService'

import routes from 'src/constants/routes'
import { CONTENT_VERTICAL_PADDING, CONTENT_HORIZONTAL_PADDING, useResponsiveDimensions } from 'src/constants/layout'
import InterestItem from 'src/components/InterestItem'
import { CommunitiesInterestsList } from 'src/models/Communities/InterestModel'
import { communitiesInterestsListSelector } from 'src/redux/selectors/communities/interestsListSelector'
import { fetchCommunityInterestsAction } from 'src/redux/actions/communities/fetchInterestsAction'


const Spacing = styled.View`
  height: ${({ theme }) => theme.spacing(2)};
`

const Content = styled.View`
  flex: 1;
`

interface StateProps {
  interestList: CommunitiesInterestsList,
}

const selector = createStructuredSelector({
  interestList: communitiesInterestsListSelector,
})

interface DispatchProps {
  fetchCategories(): void
}

const dispatcher = dispatch => ({
  fetchCategories: () => dispatch(fetchCommunityInterestsAction()),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps


const ChooseCategories = ({ fetchCategories, interestList }: Props) => {
  const { width } = useResponsiveDimensions()
  useEffect(() => {
    fetchCategories()
  }, [])

  const contentContainerStyle = useMemo(() => ({
    paddingVertical: CONTENT_VERTICAL_PADDING,
    paddingHorizontal: CONTENT_HORIZONTAL_PADDING(width),
  }), [width])

  const gotoCategoriesList = (categoryId) => {
    NavigationService.navigate(routes.COMMUNITY__QUESTIONS_CATEGORIES, { categoryId })
  }

  return (
    <Content>
      <FlatList
        data={ interestList }
        keyExtractor={ item => item.id.toString() }
        contentContainerStyle={ contentContainerStyle }
        renderItem={ ({ item }) => (
          <InterestItem
            themeColor={ `#${item.customAttributes.themeColor}` }
            key={ `interest-${item.id}` }
            interestId={ item.id }
            name={ `${item.name}` }
            onPress={ () => gotoCategoriesList(item.id) }
            selected
          />
        ) }
        ItemSeparatorComponent={ Spacing }
      />
    </Content>
  )
}

// class ChooseCategories extends React.Component<Props> {
//   componentDidMount() {
//     const { fetchCategories } = this.props
//     fetchCategories()
//   }

//   gotoCategoriesList = (categoryId) => {
//     NavigationService.navigate(routes.COMMUNITY__QUESTIONS_CATEGORIES, { categoryId })
//   }

//   render() {
//     const { gotoCategoriesList } = this
//     const { interestList } = this.props
//     return (
//       <Content>
//         <FlatList
//           data={ interestList }
//           keyExtractor={ item => item.id.toString() }
//           contentContainerStyle={ containerStyle }
//           renderItem={ ({ item }) => (
//             <InterestItem
//               themeColor={ `#${item.customAttributes.themeColor}` }
//               key={ `interest-${item.id}` }
//               interestId={ item.id }
//               name={ `${item.name}` }
//               onPress={ () => gotoCategoriesList(item.id) }
//               selected
//             />
//           ) }
//           ItemSeparatorComponent={ Spacing }
//         />
//       </Content>
//     )
//   }
// }

export default connector(ChooseCategories)
