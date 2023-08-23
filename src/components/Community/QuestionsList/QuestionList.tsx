import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'

import { RecommendationFilterNames, RecommendationSortNames } from 'src/models/Communities/QuestionModel'
import MyPostList from 'src/components/Community/MyPostList/MyPostList'
import FeedRecommendationList from 'src/components/Community/QuestionsList/FeedQuestionList'
import CategoryRecommendationList from 'src/components/Community/QuestionsList/CategoryQuestionList'
import CategoryMyPostList from 'src/components/Community/MyPostList/CategoryMyPostList'


interface Props {
  currentFilter: RecommendationFilterNames,
  categoryId?: string
  header?: React.ReactElement;
  sort: RecommendationSortNames
  questionFilter?: RecommendationFilterNames
  contentContainerStyle?: StyleProp<ViewStyle>;
}

class QuestionList extends React.Component<Props> {
  // TODO implement fetch recommendation from friends
  // TODO implement infinite scrolling
  render() {
    const { currentFilter, categoryId, header, sort, questionFilter, contentContainerStyle } = this.props
    switch (currentFilter) {
      case (RecommendationFilterNames.MY_POST):
        return (
          <MyPostList
            contentContainerStyle={ contentContainerStyle }
            header={ header }
            sort={ sort }
          />
        )
      case (RecommendationFilterNames.CATEGORY):
        if (questionFilter === RecommendationFilterNames.MY_POST) {
          return (
            <CategoryMyPostList
              header={ header }
              categoryId={ categoryId }
              sort={ sort }
              contentContainerStyle={ contentContainerStyle }
            />
          )
        }

        return (
          <CategoryRecommendationList
            header={ header }
            filter={ questionFilter }
            categoryId={ categoryId }
            sort={ sort }
            contentContainerStyle={ contentContainerStyle }
          />
        )
      default:
      case (RecommendationFilterNames.MY_COMMUNITIES):
        return (
          <FeedRecommendationList
            contentContainerStyle={ contentContainerStyle }
            sort={ sort }
            header={ header }
            filter={ currentFilter }
          />
        )
    }
  }
}

export default QuestionList
