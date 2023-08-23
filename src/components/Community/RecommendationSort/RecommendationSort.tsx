import React, { Component } from 'react'
import styled from 'styled-components/native'

import { RecommendationSortNames } from 'src/models/Communities/QuestionModel'
import RecommendationsSortItem from './RecommendationSortItem'

const Content = styled.View`
  flex-direction: row;
  width: 100%;
  height: 40px;
`

const Separator = styled.View`
  height: 20px;
  width: 1px;
  margin: 10px 10px 0;
  background-color: black;
`

interface State {
  currentSort: RecommendationSortNames
}

interface Props {
  initialSort: RecommendationSortNames
  onSortChange: (sort: RecommendationSortNames) => void
}

class RecommendationSort extends Component<Props, State> {
  constructor(props) {
    super(props)
    const { initialSort } = props
    this.state = {
      currentSort: initialSort,
    }
  }

  sortByRecent = () => {
    this.setState({ currentSort: RecommendationSortNames.RECENT })
    const { onSortChange } = this.props
    onSortChange(RecommendationSortNames.RECENT)
  }

  sortByPopular = () => {
    this.setState({ currentSort: RecommendationSortNames.POPULAR })
    const { onSortChange } = this.props
    onSortChange(RecommendationSortNames.POPULAR)
  }

  render() {
    const { sortByRecent, sortByPopular } = this

    return (
      <Content>
        <RecommendationsSortItem
          handler={ sortByRecent }
          content="RECENT"
          selected={ this.state.currentSort === RecommendationSortNames.RECENT }
        />
        <Separator />
        <RecommendationsSortItem
          handler={ sortByPopular }
          content="POPULAR"
          selected={ this.state.currentSort === RecommendationSortNames.POPULAR }
        />
      </Content>
    )
  }
}

export default RecommendationSort
