import React, { ReactChild } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { ThemeProvider as ScThemeProvider } from 'styled-components'

import { getThemeNameSelector } from 'src/redux/selectors/themeSelector'

import { ThemeNames } from 'src/constants/theme'
import Themes from 'src/models/ThemeModel'

interface OwnProps {
  children?: ReactChild
}

interface StateProps {
  themeName: ThemeNames
}

const selector = createStructuredSelector({
  themeName: getThemeNameSelector,
})

const connector = connect<StateProps, {}, OwnProps>(selector)

type Props = StateProps & OwnProps

class ThemeProvider extends React.Component<Props> {
  getTheme = () => {
    const { themeName } = this.props
    return Themes[themeName]
  }

  render() {
    const { children } = this.props

    return (
      <ScThemeProvider theme={ this.getTheme() }>
        { children }
      </ScThemeProvider>
    )
  }
}

export default connector(ThemeProvider)
