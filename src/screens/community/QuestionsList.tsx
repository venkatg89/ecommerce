import React, { useState, useCallback, useEffect, useContext, useMemo } from 'react'
import { NavigationInjectedProps, NavigationParams } from 'react-navigation'
import styled, { ThemeContext } from 'styled-components/native'
import { connect } from 'react-redux'

import Header from 'src/controls/navigation/Header'
import Container from 'src/controls/layout/ScreenContainer'
import QuestionList from 'src/components/Community/QuestionsList/QuestionList'
import { RecommendationFilterNames, RecommendationSortNames } from 'src/models/Communities/QuestionModel'

import { checkIsUserLoggedOutToBreakAction } from 'src/redux/actions/modals/guestUser'
import { fetchUserPostsAction } from 'src/redux/actions/communities/fetchUserPostAction'
import { setRouteToRedirectPostLoginAction } from 'src/redux/actions/onboarding'

import { getContentContainerStyleWithAnchor, useResponsiveDimensions } from 'src/constants/layout'
import SortFilter from 'src/controls/SortFilter/CommunitySortFilter'
import { icons } from 'assets/images/index'
import Button from 'src/controls/Button'
import RecommendationsFilter from 'src/components/Community/RecommendationsFilter/RecommendationsFilter'
import { push, Routes } from 'src/helpers/navigationService'
import { ThemeModel } from 'src/models/ThemeModel'

const HeaderContainer = styled.View`
  margin-bottom: ${props => props.theme.spacing(2)};
`

const Icon = styled.Image`
  width: ${props => props.theme.spacing(3)};
  height: ${props => props.theme.spacing(3)};
`

const AskButton = styled(Button)``

const IconButton = styled(Button)`
  margin-top: ${props => props.theme.spacing(2)};
`

type OwnProps = NavigationInjectedProps

interface SortState {
  [RecommendationFilterNames.MY_COMMUNITIES]: RecommendationSortNames
  [RecommendationFilterNames.MY_POST]: RecommendationSortNames
}

interface DispatchProps {
  checkUserLogin: () => boolean
  fetchMyPost: () => void
  setRedirect: (params: NavigationParams) => void
}

const dispatcher = dispatch => ({
  checkUserLogin: () => dispatch(checkIsUserLoggedOutToBreakAction()),
  fetchMyPost: () => dispatch(fetchUserPostsAction({})),
  setRedirect: (params: NavigationParams) => dispatch(setRouteToRedirectPostLoginAction({ route: Routes.COMMUNITY__QUESTIONS, params })),
})


type Props = OwnProps & DispatchProps

const connector = connect<{}, DispatchProps, OwnProps>(null, dispatcher)

const QuestionsList = ({ navigation, checkUserLogin, fetchMyPost, setRedirect }: Props) => {
  const [currentFilterState, setCurrentFilterState] = useState<RecommendationFilterNames>(RecommendationFilterNames.MY_COMMUNITIES)
  const [isOpenState, setIsOpenState] = useState<boolean>(false)
  const [sortState, setSortState] = useState<SortState>({
    [RecommendationFilterNames.MY_COMMUNITIES]: RecommendationSortNames.RECENT,
    [RecommendationFilterNames.MY_POST]: RecommendationSortNames.RECENT,
  })

  const theme = useContext(ThemeContext) as ThemeModel
  const { width } = useResponsiveDimensions()

  useEffect(() => {
    if (navigation.getParam('_goToMyPost', false)) {
      fetchMyPost()
      setCurrentFilterState(RecommendationFilterNames.MY_POST)
      setSortState({ ...sortState, [RecommendationFilterNames.MY_POST]: RecommendationSortNames.RECENT })
      navigation.setParams({ _goToMyPost: false })
    }
  }, [navigation.getParam('_goToMyPost')])

  const toggleModal = useCallback((open: boolean) => () => {
    setIsOpenState(open)
  }, [])

  const toggleFilter = useCallback((filter: RecommendationFilterNames, sort?: RecommendationSortNames) => {
    if (filter === RecommendationFilterNames.MY_POST && checkUserLogin()) {
      setRedirect({ _goToMyPost: true })
      return
    }

    setCurrentFilterState(filter)

    if (sort) {
      setSortState({ ...sortState, [filter]: sort })
    }
  }, [checkUserLogin, sortState])

  const gotoAskRecommendation = useCallback(() => {
    push(Routes.COMMUNITY__ASK)
  }, [])

  const contentContainerStyle = useMemo(() => getContentContainerStyleWithAnchor(theme, width), [theme, width])

  return (
    <Container>
      <QuestionList
        contentContainerStyle={ contentContainerStyle }
        sort={ sortState[currentFilterState] }
        currentFilter={ currentFilterState }
        header={ (
          <HeaderContainer>
            <RecommendationsFilter onFilterChange={ toggleFilter } currentFilter={ currentFilterState } />
            <IconButton
              accessibilityLabel="sort and filter"
              onPress={ toggleModal(true) }
              icon
            >
              <Icon source={ icons.sort } />
            </IconButton>
          </HeaderContainer>
        ) }
      />
      <AskButton
        variant="contained"
        onPress={ gotoAskRecommendation }
        isAnchor
      >
        Ask a Question
      </AskButton>
      <SortFilter
        onlySort
        currentSort={ sortState[currentFilterState] }
        open={ isOpenState }
        onClose={ toggleModal(false) }
        currentFilter={ currentFilterState }
        toggleFilter={ toggleFilter }
      />
    </Container>
  )
}

QuestionsList.navigationOptions = () => ({
  title: 'Community',
  header: headerProps => <Header headerProps={ headerProps } />,
})

export default connector(QuestionsList)
