import React, { useState, useEffect, useContext } from 'react'
import { StatusBar } from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled, { ThemeContext } from 'styled-components/native'

import Container from 'src/controls/layout/ScreenContainer'
import Header from 'src/controls/navigation/Header'
import Button from 'src/controls/Button'

import { fetchCommunityInterestsAction } from 'src/redux/actions/communities/fetchInterestsAction'
import { setFavoriteCategoriesActions } from 'src/redux/actions/user/community/favoriteCategoriesAction'
import { navigateToNextOnboardingStepOrToHomeAction } from 'src/redux/actions/onboarding'

import { isUserLoggedInSelector, myInterestCommunityIds } from 'src/redux/selectors/userSelector'
import { updateFavoriteCommunitiesInProgressSelector } from 'src/redux/selectors/apiStatus/community'
import ProgressBar from 'src/controls/progress/ProgressBar'
import CategoryList from 'src/components/Onboarding/CategoryList'
import { getScrollHorizontalPadding, getScrollVerticalPadding, getContentContainerStyleWithAnchor, useResponsiveDimensions } from 'src/constants/layout'
import { navigate, Routes } from 'src/helpers/navigationService'
import { ThemeModel } from 'src/models/ThemeModel'

interface ContainerProps {
  currentWidth: number
}

const HeaderContainer = styled.View < ContainerProps>`
  padding-top: ${({ theme }) => getScrollVerticalPadding(theme)};
  padding-horizontal: ${({ theme, currentWidth }) => getScrollHorizontalPadding(theme, currentWidth)};
`

const Title = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(2)}px;
`

const SubTitle = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey2};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const DoneButton = styled(Button)``

interface OwnProps {}

interface StateProps {
  isUserLoggedIn: boolean
  updateFavoriteCommunitiesInProgress: boolean
  selectedInterests: number[]
}

const selector = createStructuredSelector({
  isUserLoggedIn: isUserLoggedInSelector,
  updateFavoriteCommunitiesInProgress: updateFavoriteCommunitiesInProgressSelector,
  selectedInterests: myInterestCommunityIds,
})

interface DispatchProps {
  fetchCategories(): void
  saveCategories(categories: number[], isUserLoggedIn: boolean): Promise<void>
  navigateToNextOnboardingStepOrToHome(): void
}

const dispatcher = dispatch => ({
  fetchCategories: () => dispatch(fetchCommunityInterestsAction()),
  saveCategories: categories => dispatch(setFavoriteCategoriesActions(categories)),
  navigateToNextOnboardingStepOrToHome: () => dispatch(navigateToNextOnboardingStepOrToHomeAction()),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(
  selector,
  dispatcher,
)

type Props = StateProps & DispatchProps & OwnProps

const ChooseInterests = ({ fetchCategories, saveCategories, isUserLoggedIn, navigateToNextOnboardingStepOrToHome, updateFavoriteCommunitiesInProgress, selectedInterests }: Props) => {
  const [categories, setCategories] = useState<number[]>(selectedInterests)
  const { width } = useResponsiveDimensions()
  const theme = useContext(ThemeContext) as ThemeModel

  useEffect(() => {
    fetchCategories()
  }, [])

  const toggleInterest = (interestId) => {
    const position = categories.indexOf(interestId)
    // Return a new array with the new interest added
    if (position < 0) {
      setCategories([...categories, interestId])
    } else {
      // Create a copy of the array, then remove the interest
      const result = [...categories]
      result.splice(position, 1)
      setCategories(result)
    }
  }

  const goNext = async () => {
    // TODO REMOVEMILQ fix the flow sometime in the future
    // await saveCategories(categories, isUserLoggedIn)
    // await navigateToNextOnboardingStepOrToHome()
    navigate(Routes.APP)
  }
  // TODO REMOVEMILQ same as above
  const isConfirmButtonDisabled = false// categories.length < 3 || updateFavoriteCommunitiesInProgress


  return (
    <Container bottom>
      <StatusBar barStyle="dark-content" />
      <ProgressBar start="0%" end="30%" />
      <HeaderContainer currentWidth={ width }>
        <Title>What are your interests?</Title>
        <SubTitle>Choose at least 3 to get started.</SubTitle>
      </HeaderContainer>
      <CategoryList
        contentContainerStyle={ getContentContainerStyleWithAnchor(theme, width) }
        onPress={ toggleInterest }
        selectedCategories={ categories }
      />
      <DoneButton
        accessibilityStates={ isConfirmButtonDisabled ? ['disabled'] : [] }
        variant="contained"
        onPress={ goNext }
        disabled={ isConfirmButtonDisabled }
        showSpinner={ updateFavoriteCommunitiesInProgress }
        isAnchor
      >
        Done
      </DoneButton>
    </Container>
  )
}

ChooseInterests.navigationOptions = () => ({
  title: 'Favorite Genres',
  header: headerProps => <Header headerProps={ headerProps } />,
})

export default connector(ChooseInterests)
