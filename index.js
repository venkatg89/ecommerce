/** @format */
import { AppRegistry, Text, TextInput } from 'react-native'

import Application from 'src/Application'
import { name as appName } from './app.json'


// Allow Network monitoring by React Native debugger
// An alternative is a plugin like reactotron-react-native
/* eslint-disable */
const _XHR = GLOBAL.originalXMLHttpRequest ?
  GLOBAL.originalXMLHttpRequest :
  GLOBAL.XMLHttpRequest
XMLHttpRequest = _XHR
/* eslint-enable */


// For Simulator demos =)
// console.disableYellowBox = true


//Temporarily disable scaling
Text.defaultProps = Text.defaultProps || {}
Text.defaultProps.allowFontScaling = false

TextInput.defaultProps = TextInput.defaultProps || {}
TextInput.defaultProps.allowFontScaling = false

AppRegistry.registerComponent(appName, () => Application)
