import React, { useState, useCallback, useEffect, useContext, useMemo } from 'react'
import { connect } from 'react-redux'
import { NavigationInjectedProps, NavigationParams } from 'react-navigation'
import styled, { ThemeContext } from 'styled-components/native'

import Header from 'src/controls/navigation/Header'
import Container from 'src/controls/layout/ScreenContainer'
import QuestionList from 'src/components/Community/QuestionsList/QuestionList'
import { RecommendationFilterNames, RecommendationSortNames } from 'src/models/Communities/QuestionModel'
import RecommendationCategoryHeader from 'src/components/Community/RecommendationCategoryHeader'

import { fetchCategoryQaFeedAction } from 'src/redux/actions/communities/fetchCategoryQuestionsAction'
import { checkIsUserLoggedOutToBreakAction } from 'src/redux/actions/modals/guestUser'
import { fetchUserPostsAction } from 'src/redux/actions/communities/fetchUserPostAction'
import { getContentContainerStyleWithAnchor, useResponsiveDimensions } from 'src/constants/layout'
import { setRouteToRedirectPostLoginAction } from 'src/redux/actions/onboarding'

import { nav } from 'assets/images'
import SortFilter from 'src/controls/SortFilter/CommunitySortFilter'
import Button from 'src/controls/Button'
import { push, Routes, Params } from 'src/helpers/navigationService'
import { ThemeModel } from 'src/models/ThemeModel'

const Icon = styled.Image`
  width: ${({ theme }) => theme.spacing(4)};
  height: ${({ theme }) => theme.spacing(4)};
`

const AskButton = styled(Button)``

type OwnProps = NavigationInjectedProps

interface DispatchProps {
  fetchCategoryQuestions: (categoryId: string, sort: RecommendationSortNames, filter) => void
  fetchMyCategoryPost: (categoryId, sort) => void
  checkUserLogin: () => void
  setRedirect: (params: NavigationParams) => void
}

const dispatcher = dispatch => ({
  fetchCategoryQuestions:
    (categoryId, sort, filter) => dispatch(fetchCategoryQaFeedAction(categoryId, sort, filter)),
  fetchMyCategoryPost: (categoryId, sort) => dispatch(fetchUserPostsAction({ sort, categoryId })),
  checkUserLogin: () => dispatch(checkIsUserLoggedOutToBreakAction()),
  setRedirect: (params: NavigationParams) => dispatch(setRouteToRedirectPostLoginAction({ route: Routes.COMMUNITY__QUESTIONS_CATEGORIES, params })),
})

const connector = connect<{}, DispatchProps, OwnProps>(
  null,
  dispatcher,
)

type Props = OwnProps & DispatchProps

const QuestionsListCategories = ({ navigation, fetchCategoryQuestions, checkUserLogin, fetchMyCategoryPost, setRedirect }: Props) => {
  const [filterState, setFilterState] = useState<RecommendationFilterNames>(RecommendationFilterNames.MY_COMMUNITIES)
  const [sortState, setSortState] = useState<RecommendationSortNames>(RecommendationSortNames.RECENT)
  const [isOpen, setIsOpenState] = useState<boolean>(false)

  const theme = useContext(ThemeContext) as ThemeModel
  const { width } = useResponsiveDimensions()

  useEffect(() => {
    if (navigation.getParam('_goToMyPost', false)) {
      const categoryId = navigation.getParam('categoryId')
      fetchMyCategoryPost(categoryId, RecommendationSortNames.RECENT)
      setFilterState(RecommendationFilterNames.MY_POST)
      setSortState(RecommendationSortNames.RECENT)
      navigation.setParams({ _goToMyPost: false })
    }
  }, [navigation.getParam('_goToMyPost')])

  const toggleModal = useCallback((open: boolean) => () => {
    setIsOpenState(open)
  }, [])

  const toggleFilter = useCallback((filter, sort?) => {
    if (filter === RecommendationFilterNames.MY_POST && checkUserLogin()) {
      setRedirect({ _goToMyPost: true })
      return
    }

    const categoryId = navigation.getParam('categoryId')
    const sortOption = sort || sortState

    setFilterState(filter)
    if (sort) {
      setSortState(sort)
    }

    fetchCategoryQuestions(categoryId, sortOption, filter)
  }, [navigation, filterState, sortState])

  const gotoAskRecommendation = useCallback(() => {
    const categoryId = navigation.getParam('categoryId')
    push(Routes.COMMUNITY__ASK, { [Params.CATEGORY_ID]: categoryId })
  }, [navigation])

  const categoryId = navigation.getParam('categoryId')

  const contentContainerStyle = useMemo(() => getContentContainerStyleWithAnchor(theme, width), [theme, width])

  return (
    <Container>
      <QuestionList
        contentContainerStyle={ contentContainerStyle }
        header={ (
          <RecommendationCategoryHeader
            categoryId={ categoryId }
            bookListName={ `category-${categoryId}` }
            toggleSort={ toggleModal(true) }
            filter={ filterState }
            toggleFilter={ toggleFilter }
          />
        ) }
        currentFilter={ RecommendationFilterNames.CATEGORY }
        categoryId={ categoryId }
        sort={ sortState }
        questionFilter={ filterState }
      />
      <AskButton
        variant="contained"
        onPress={ gotoAskRecommendation }
        isAnchor
      >
        Ask a Question
      </AskButton>
      <SortFilter
        open={ isOpen }
        onClose={ toggleModal(false) }
        toggleFilter={ toggleFilter }
        currentFilter={ filterState }
        onlySort
      />
    </Container>
  )
}

QuestionsListCategories.navigationOptions = () => ({
  title: 'Categories',
  header: headerProps => <Header headerProps={ headerProps } ctaComponent={ <Icon source={ nav.topBar.dots } /> } />,
})

export default connector(QuestionsListCategories)
