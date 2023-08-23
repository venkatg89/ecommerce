import React from 'react'
import { StatusBar, Dimensions, ScaledSize } from 'react-native'
import { connect } from 'react-redux'
import { NavigationInjectedProps } from 'react-navigation'
import styled, { withTheme } from 'styled-components/native'

import Container from 'src/controls/layout/ScreenContainer'
import _Button from 'src/controls/Button'
import Header from 'src/controls/navigation/Header'
import ProgressBar from 'src/controls/progress/ProgressBar'

import { Params } from 'src/constants/routes'
import {
  getScrollHorizontalPadding,
  getScrollVerticalPadding,
  getContentContainerStyleWithAnchor,
} from 'src/constants/layout'
import countLabelText from 'src/helpers/countLabelText'
import { Ean } from 'src/models/BookModel'
import { ReadingStatus } from 'src/models/ReadingStatusModel'
import { ThemeModel } from 'src/models/ThemeModel'
import { ONBOARDING_MIN_READ_BOOKS_SELECTED } from 'src/constants/onboarding'

import {
  onboardingMovedPastBookSelectionAction,
  navigateToNextOnboardingStepOrToHomeAction,
} from 'src/redux/actions/onboarding'
import { onboardingBookListEansSelector } from 'src/redux/selectors/onboarding/booksSelector'

import {
  searchResultsApiStatusActions,
  clearSearchResultsAction,
} from 'src/redux/actions/legacySearch/searchResultsAction'

import _SearchContainer from 'src/components/Onboarding/SearchContainer'
import { hasBookResultsSelector } from 'src/redux/selectors/listings/searchSelector'

const TITLE = 'What are your favorite books?'

interface ContainerProps {
  currentWidth: number
}

const DescriptionText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  margin-top: ${({ theme }) => theme.spacing(1)};
`

const HeaderContainer = styled.View<ContainerProps>`
  margin-top: ${({ theme }) => getScrollVerticalPadding(theme)};
  margin-horizontal: ${({ theme, currentWidth }) =>
    getScrollHorizontalPadding(theme, currentWidth)};
`

const SearchContainer = styled(_SearchContainer)`
  margin-top: ${({ theme }) => theme.spacing(2)};
`

const Title = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
`

const Button = styled(_Button)``

const DoneButton = styled(_Button)``

interface OwnProps {}

interface ThemeProps {
  theme: ThemeModel
}

interface State {
  currentDimension: ScaledSize
}

interface StateProps {
  readBooks: Record<Ean, ReadingStatus>
  hasBookResults: boolean
}

const selector = () => {
  const _onboardingSelector = onboardingBookListEansSelector()
  return (state) => ({
    readBooks: _onboardingSelector(state),
    hasBookResults: hasBookResultsSelector(state),
  })
}

interface DispatchProps {
  clearSearch: () => void
  onboardingMovedPastBookSelection: () => void
  navigateToNextOnboardingStepOrToHome(navigateHome?): void
}

const dispatcher = (dispatch) => ({
  clearSearch: () => {
    dispatch(clearSearchResultsAction())
    dispatch(searchResultsApiStatusActions().actions.clear)
  },
  onboardingMovedPastBookSelection: () =>
    dispatch(onboardingMovedPastBookSelectionAction()),
  navigateToNextOnboardingStepOrToHome: (navigateHome?: boolean) =>
    dispatch(navigateToNextOnboardingStepOrToHomeAction([], navigateHome)),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(
  selector,
  dispatcher,
)

type Props = OwnProps &
  StateProps &
  DispatchProps &
  NavigationInjectedProps &
  ThemeProps

const SKIP_CALLBACK = 'SKIP_CALLBACK'
class ReadBookSelection extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }) => ({
    title: 'Favorite Books',
    header: (headerProps) => {
      const userTip = navigation.getParam(Params.USER_TIP)
      const skipCallback = navigation.getParam(SKIP_CALLBACK, () => {})
      return (
        <Header
          headerProps={headerProps}
          ctaComponent={
            (!userTip && (
              <Button onPress={skipCallback} linkGreen>
                Skip
              </Button>
            )) ||
            undefined
          }
        />
      )
    },
  })

  state = {
    currentDimension: Dimensions.get('screen'),
  }

  handleSetDims = (dims) => {
    this.setState({ currentDimension: dims.screen })
  }

  componentWillMount() {
    this.props.clearSearch()
    this.props.navigation.setParams({
      [SKIP_CALLBACK]: () => this.listCompleted(),
    })
    Dimensions.addEventListener('change', this.handleSetDims)
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.handleSetDims)
  }

  listCompleted = async () => {
    const {
      onboardingMovedPastBookSelection,
      navigateToNextOnboardingStepOrToHome,
      navigation,
    } = this.props
    await onboardingMovedPastBookSelection()
    await navigateToNextOnboardingStepOrToHome(
      Boolean(navigation.getParam(Params.USER_TIP)),
    )
  }

  render() {
    const { currentDimension } = this.state
    const { width } = currentDimension
    const { readBooks, navigation, theme, hasBookResults } = this.props
    const userTip = navigation.getParam(Params.USER_TIP)
    const alreadyReadBooksCount =
      (userTip && userTip.alreadyReadBooksCount) || 0
    const readBooksCount = Object.keys(readBooks).length - alreadyReadBooksCount
    const isButtonDisabled = userTip
      ? !readBooksCount
      : !readBooksCount || readBooksCount < ONBOARDING_MIN_READ_BOOKS_SELECTED
    // const moreBooks = ONBOARDING_MIN_READ_BOOKS_SELECTED - readBooksCount
    let buttonText
    if (!userTip && readBooksCount < ONBOARDING_MIN_READ_BOOKS_SELECTED) {
      buttonText = 'Done'
      // buttonText = `Add ${moreBooks} More`
    } else {
      buttonText = `Done (${countLabelText(readBooksCount, 'BOOK', 'BOOKS')})`
    }

    return (
      <Container bottom={!userTip}>
        <StatusBar barStyle="dark-content" />
        {!userTip && <ProgressBar start="30%" end="60%" />}
        <HeaderContainer currentWidth={width}>
          <Title>{TITLE}</Title>
          <DescriptionText>
            The more books you add, the better our recommendations are for you!
          </DescriptionText>
        </HeaderContainer>
        <SearchContainer
          contentContainerStyle={getContentContainerStyleWithAnchor(
            theme,
            width,
          )}
        />
        {hasBookResults && (
          <DoneButton
            accessibilityStates={isButtonDisabled ? ['disabled'] : []}
            variant="contained"
            onPress={this.listCompleted}
            disabled={isButtonDisabled}
            isAnchor
          >
            {buttonText}
          </DoneButton>
        )}
      </Container>
    )
  }
}

export default withTheme(connector(ReadBookSelection))
