import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import { createStructuredSelector } from 'reselect'

import { communitiesInterestSelector } from 'src/redux/selectors/communities/interestsListSelector'
import { CommunitiesInterestsModel } from 'src/models/Communities/InterestModel'

const Tag = styled.View`
  height: 24px;
  justify-content: center;
  background-color: rgb(227, 227, 227);
  border-radius: 3px;
  padding: 5px 0;
  margin: 5px 0 13px;
  align-self: flex-start;
 `

const Title = styled.Text`
  text-align: center;
  font-size: 12px;
  line-height: 12px;
  color: rgb(81, 82, 83);
  align-self: flex-start;
  padding: 16px 22px;
  font-weight: 800;
`

interface OwnProps {
  categoryId: string
}

interface StateProps {
  category: CommunitiesInterestsModel,
}

const selector = createStructuredSelector({
  category: communitiesInterestSelector,
})

const connector = connect<StateProps, {}, OwnProps>(selector)

type Props = StateProps & OwnProps


class RecommendationCategoryTag extends React.Component<Props> {
  questionId = ''

  render() {
    const { category } = this.props
    return (
      <Tag>
        <Title>{ category.name }</Title>
      </Tag>
    )
  }
}

export default connector(RecommendationCategoryTag)
