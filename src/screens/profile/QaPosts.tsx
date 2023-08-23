import React, { useState, useCallback } from 'react'
import { NavigationInjectedProps } from 'react-navigation'
import styled from 'styled-components/native'

import _Container from 'src/controls/layout/ScreenContainer'
import Header from 'src/controls/navigation/Header'

import { Params } from 'src/helpers/navigationService'

import QaPostsLists from 'src/components/Profile/QaPostsLists'
import { RecommendationSortNames } from 'src/models/Communities/QuestionModel'

type Props = NavigationInjectedProps

const Container = styled(_Container)`
  padding-top: ${({ theme }) => theme.spacing(2)};
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
`

const QaPosts = ({ navigation }: Props) => {
  const [sort, setSort] = useState<RecommendationSortNames>(RecommendationSortNames.RECENT)
  const uid = navigation.getParam(Params.MILQ_MEMBER_UID)
  const totalQuestions = navigation.getParam('totalQuestions')
  const onChangeSort = useCallback((_, selectedSort) => {
    setSort(selectedSort)
  }, [sort])
  return (
    <Container>
      <QaPostsLists
        uid={ uid }
        sort={ sort }
        totalQuestions={ totalQuestions }
        onChangeSort={ onChangeSort }
      />
    </Container>
  )
}

QaPosts.navigationOptions = () => ({
  title: 'User Posts',
  header: headerProps => <Header headerProps={ headerProps } />,
})

export default QaPosts
