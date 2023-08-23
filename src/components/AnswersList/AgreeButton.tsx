import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components/native'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { NavigationParams, NavigationInjectedProps, withNavigation } from 'react-navigation'

import { isMyAgreedAnswerSelector } from 'src/redux/selectors/userSelector'
import { toggleAgreeToAnswerAction } from 'src/redux/actions/user/community/agreeAnswersAction'
import { checkIsUserLoggedOutToBreakAction } from 'src/redux/actions/modals/guestUser'
import { setRouteToRedirectPostLoginAction } from 'src/redux/actions/onboarding'

import { AnswerId } from 'src/models/Communities/AnswerModel'
import _Button from 'src/controls/Button'

import Routes, { Params } from 'src/constants/routes'


const Button = styled(_Button)`
  ${({ theme, variant }) => variant === 'contained' && `backgroundColor: ${theme.palette.secondaryBlue}`};
  padding: ${({ theme }) => theme.spacing(1)}px ${({ theme }) => theme.spacing(2)}px;
  ${({ theme, variant }) => variant === 'outlined' && `borderColor: ${theme.palette.secondaryBlue}`};
`

interface OwnProps {
  answerId: AnswerId
  style?: any
}

interface DispatchProps {
  toggleAgreeToAnswer: (answerId: AnswerId) => void;
  checkIsUserLoggedOutToBreak: () => boolean;
  setRedirect: (route: string, params: NavigationParams) => void
}

interface StateProps {
  isAgreedAnswer: boolean
}

const dispatcher = dispatch => ({
  toggleAgreeToAnswer: answerId => dispatch(toggleAgreeToAnswerAction(answerId)),
  checkIsUserLoggedOutToBreak: () => dispatch(checkIsUserLoggedOutToBreakAction()),
  setRedirect: (route, params) => dispatch(setRouteToRedirectPostLoginAction({ route, params })),
})

const selector = createStructuredSelector({
  isAgreedAnswer: isMyAgreedAnswerSelector,
})

const connector = connect<StateProps, DispatchProps, OwnProps>(selector, dispatcher)

type Props = OwnProps & DispatchProps & StateProps & NavigationInjectedProps

const AgreeButton = ({ isAgreedAnswer, toggleAgreeToAnswer, style, answerId, checkIsUserLoggedOutToBreak, setRedirect, navigation }: Props) => {
  const { palette } = useContext(ThemeContext)
  const variant = isAgreedAnswer ? 'outlined' : 'contained'
  const textStyle = (variant === 'outlined' ? { color: palette.secondaryBlue } : {})
  const toggleAgree = () => {
    if (checkIsUserLoggedOutToBreak()) {
      if (navigation.state.routeName === Routes.SEARCH__MAIN_LEGACY) {return}
      const questionId = navigation.getParam(Params.QUESTION_ID, '')
      const route = navigation.state.routeName
      setRedirect(route, { questionId })
      return
    }
    toggleAgreeToAnswer(answerId)
  }

  return (
    <Button
      accessibilityHint={ isAgreedAnswer ? 'press to disagree' : 'press to agree' }
      style={ style }
      textStyle={ textStyle }
      onPress={ toggleAgree }
      variant={ variant }
      size="small"
    >
      { isAgreedAnswer ? 'AGREED' : 'AGREE' }
    </Button>
  )
}

export default withNavigation(connector(AgreeButton))
