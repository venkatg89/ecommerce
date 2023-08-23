/* eslint-disable react/no-unused-prop-types */
import React, { useEffect, useCallback, useContext, useMemo } from 'react'
import { connect } from 'react-redux'
import styled, { ThemeContext } from 'styled-components/native'
import { createStructuredSelector } from 'reselect'

import { CommunitiesInterestsModel } from 'src/models/Communities/InterestModel'
import { RecommendationFilterNames } from 'src/models/Communities/QuestionModel'
import { BookModel } from 'src/models/BookModel'

import { fetchCategoryAnswerAction } from 'src/redux/actions/communities/fetchCategoryAnswerAction'
import { followCommunityAction } from 'src/redux/actions/user/community/favoriteCategoriesAction'

import { communitiesInterestSelector } from 'src/redux/selectors/communities/interestsListSelector'
import { bookListFromEANListSelector } from 'src/redux/selectors/booksListSelector'
import { myInterestCommunityIds, isFollowCategoryBusy } from 'src/redux/selectors/userSelector'

import _BookCarousel from 'src/components/LegacyBookCarousel'
import RecommendationFilter from 'src/components/Community/RecommendationsFilter/RecommendationsFilter'
import Button from 'src/controls/Button'
import { getScrollVerticalPadding, getScrollHorizontalPadding, useResponsiveDimensions } from 'src/constants/layout'

import { icons } from 'assets/images'
import LoadingIndicator from 'src/controls/progress/LoadingIndicator'
import { ThemeModel } from 'src/models/ThemeModel'

type CategoryProps = {
  categoryColor: HexColor
  currentWidth: number
}

interface FollowButtonProps {
  following: boolean
  categoryColor: HexColor
}

const ButtonsContainer = styled.View`
  margin: ${({ theme }) => theme.spacing(2)}px 0px;
`

const IconButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing(2)};
`

const Icon = styled.Image`
 width: ${({ theme }) => theme.spacing(3)};
 height: ${({ theme }) => theme.spacing(3)};
`

const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding-vertical: ${({ theme }) => theme.spacing(3)};
`

const Title = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.white};
`

const FollowButton = styled(Button)<FollowButtonProps>`
  flex-shrink: 0;
  padding: ${({ theme }) => theme.spacing(1)}px ${({ theme }) => theme.spacing(1)}px;
  min-width: ${({ theme }) => theme.spacing(12)};
  background-color: ${({ theme, categoryColor, following }) => (following ? categoryColor : theme.palette.white)};
  ${({ theme, following }) => (following ? `border: 1px solid ${theme.palette.white}` : '')}
  margin: ${({ theme }) => theme.spacing(0)}px 0px;
`

const TitleWrapper = styled.View`
  flex-shrink: 1;
  margin-right: ${({ theme }) => theme.spacing(3)};
`


const BookCarousel = styled(_BookCarousel)`
  padding-bottom: ${({ theme }) => theme.spacing(3)}px;
`

const BooksContainer = styled.View<CategoryProps>`
  background-color: ${({ categoryColor }) => categoryColor};
  margin-top: -${({ theme }) => getScrollVerticalPadding(theme)};
  margin-horizontal: -${({ theme, currentWidth }) => getScrollHorizontalPadding(theme, currentWidth)};
  padding-horizontal: ${({ theme, currentWidth }) => getScrollHorizontalPadding(theme, currentWidth)};
  min-height: ${({ theme }) => theme.spacing(32)};
`

type OwnProps = {
  categoryId: string;
  bookListName: string;
  toggleSort: () => void
  toggleFilter: (filter) => void
  filter: RecommendationFilterNames
}

interface StateProps {
  category: CommunitiesInterestsModel,
  books: BookModel[],
  favorites: number[]
  isBusy: boolean
}

const selector = createStructuredSelector({
  category: communitiesInterestSelector,
  books: bookListFromEANListSelector,
  favorites: myInterestCommunityIds,
  isBusy: isFollowCategoryBusy,
})

interface DispatchProps {
  fetchCategoryAnswer: (categoryId: string) => void,
  followCategory: (categoryId: string) => void
}

const dispatcher = dispatch => ({
  fetchCategoryAnswer: categoryId => dispatch(fetchCategoryAnswerAction(categoryId)),
  followCategory: categoryId => dispatch(followCommunityAction(categoryId)),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(selector, dispatcher)

type Props = OwnProps & DispatchProps & StateProps

const QuestionsListCategories = ({ fetchCategoryAnswer, followCategory, category, books, toggleSort, filter, toggleFilter, favorites, isBusy }: Props) => {
  const theme = useContext(ThemeContext) as ThemeModel
  const { width } = useResponsiveDimensions()

  useEffect(() => {
    fetchCategoryAnswer(category.id)
  }, [])

  const onFollow = useCallback(() => {
    followCategory(category.id)
  }, [category.id])

  const { themeColor } = category.customAttributes
  const following = favorites.includes(Number(category.id))
  const textStyle = { color: theme.palette.grey1 }
  const carouselStyle = useMemo(() => ({
    marginHorizontal: -getScrollHorizontalPadding(theme, width),
  }), [theme, width])

  return (
    <React.Fragment>
      <BooksContainer categoryColor={ `#${themeColor}` } currentWidth={ width }>
        <TitleContainer>
          <TitleWrapper>
            <Title>{ category && category.name }</Title>
          </TitleWrapper>
          <FollowButton
            disabled={ isBusy }
            categoryColor={ `#${themeColor}` }
            following={ following }
            onPress={ onFollow }
            variant="contained"
            size="small"
            textStyle={ textStyle }
          >
            {following ? 'Following' : 'Follow' }
          </FollowButton>
        </TitleContainer>
        { books.length ? (
          <BookCarousel
            style={ carouselStyle }
            bookOrEanList={ books }
            bookMaxHeight={ theme.spacing(20) }
            bookMaxWidth={ theme.spacing(14) }
            leftPadTypeTablet="content-padding"
            rightPadTypeTablet="content-padding"
          />
        ) :
          <LoadingIndicator isLoading={ books.length < 1 } />
        }
      </BooksContainer>

      <ButtonsContainer>
        <RecommendationFilter currentFilter={ filter } onFilterChange={ toggleFilter } />
        <IconButton icon onPress={ toggleSort }>
          <Icon source={ icons.sort } />
        </IconButton>
      </ButtonsContainer>
    </React.Fragment>
  )
}

export default connector(QuestionsListCategories)
