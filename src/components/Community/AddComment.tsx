import React, { useState, useEffect } from 'react'
import { Keyboard } from 'react-native'
import styled from 'styled-components/native'
import { connect } from 'react-redux'
import { NavigationInjectedProps, NavigationParams, withNavigation } from 'react-navigation'
import { createStructuredSelector } from 'reselect'

import { setRouteToRedirectPostLoginAction } from 'src/redux/actions/onboarding'
import { checkIsUserLoggedOutToBreakAction } from 'src/redux/actions/modals/guestUser'
import { isUserLoggedInSelector } from 'src/redux/selectors/userSelector'

import _TextField from 'src/controls/form/TextField'
import Button from 'src/controls/Button'
import { CONTENT_HORIZONTAL_PADDING, useResponsiveDimensions } from 'src/constants/layout'
import { icons } from 'assets/images'

import { Params } from 'src/constants/routes'

interface ContentProps {
  currentWidth: number
}

const Content = styled.View<ContentProps>`
  border-top-width: 1;
  border-top-color: ${({ theme }) => theme.palette.disabledGrey};
  flex-direction: row;
  padding-vertical: ${({ theme }) => theme.spacing(2)};
  padding-horizontal: ${({ currentWidth }) => CONTENT_HORIZONTAL_PADDING(currentWidth)};
  background-color: #fafafa;
`

const TextField = styled(_TextField)`
  flex: 1;
`

const IconButton = styled(Button)`
  margin-left:${({ theme }) => theme.spacing(1)};
  align-self: flex-end;
`


const Icon = styled.Image`
  width:${({ theme }) => theme.spacing(4)};
  height:${({ theme }) => theme.spacing(4)};
  tint-color: ${({ theme }) => theme.palette.primaryGreen};
  opacity: 1;
`
interface OwnProps {
  label?: string
  postComment: (value: string) => void
  currentText?: string
}


interface DispatchProps {
  checkUserLogin: () => boolean
  setRedirect: (route: string, params: NavigationParams) => void
}

interface StateProps {
  isUserLogin: boolean
}

const selector = createStructuredSelector({
  isUserLogin: isUserLoggedInSelector,
})

const dispatcher = dispatch => ({
  checkUserLogin: () => dispatch(checkIsUserLoggedOutToBreakAction()),
  setRedirect: (route: string, params: NavigationParams) => dispatch(setRouteToRedirectPostLoginAction({ route, params })),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(selector, dispatcher)

type Props = OwnProps & DispatchProps & StateProps & NavigationInjectedProps

const AddComment = ({ checkUserLogin, postComment, isUserLogin, label, currentText = '', navigation, setRedirect }: Props) => {
  const [value, setValue] = useState<string>(currentText || '')
  const { width } = useResponsiveDimensions()

  useEffect(() => {
    if (currentText) {
      setValue(currentText)
    }
  }, [currentText])

  const onChange = text => setValue(text)

  const onFoucs = () => {
    if (checkUserLogin()) {
      Keyboard.dismiss()
      const answerId = navigation.getParam(Params.ANSWER_ID, '')
      const ean = navigation.getParam(Params.EAN, '')
      const title = navigation.getParam(Params.TITLE, '')
      const route = navigation.state.routeName
      setRedirect(route, { answerId, ean, title })
    }
  }
  const onSubmit = () => {
    postComment(value)
    setValue('')
    Keyboard.dismiss()
  }
  return (
    <Content currentWidth={ width }>
      <TextField
        onFocus={ onFoucs }
        label={ label }
        placeholder="This is my answer because..."
        value={ value }
        onChange={ onChange }
        onSubmitEditing={ onSubmit }
        numberOfLines={ 3 }
      />
      <IconButton
        accessibilityLabel="submit comment"
        icon
        onPress={ onSubmit }
        disabled={ !value.trim().length }
      >
        <Icon source={ icons.upload } />
      </IconButton>
    </Content>
  )
}

export default withNavigation(connector(AddComment))
