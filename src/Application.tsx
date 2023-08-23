import React from 'react'
import {
  Platform,
  DeviceEventEmitter,
  NativeEventEmitter,
  EventEmitter,
  NativeModules,
  AppState,
} from 'react-native'
import { Provider as StoreProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { NativeBaseProvider } from 'native-base'

import {
  sendMailLogs,
  setMainComponentRef,
} from 'src/helpers/logger/logsSender'

import LoadingComponent from 'src/components/LoadingComponent'
import { LoggerProvider } from 'src/components/LoggerProvider'
import ThemeProvider from 'src/controls/layout/ThemeProvider'
import GlobalModalHandler from 'src/components/GlobalModalHandler'
import PushProvider from 'src/components/PushProvider'

import AppContainer from 'src/navigation/container'

import { store, persistor } from 'src/redux'
import { setUserSessionAction } from 'src/redux/actions/user/sessionsAction'

const trippleTapEventName = 'trippletap'

class Application extends React.Component {
  eventEmitter?: EventEmitter

  sendLogs = () => {
    sendMailLogs()
  }

  componentDidMount() {
    if (Platform.OS === 'ios') {
      NativeModules.RNEventEmitter.startListening()
      this.eventEmitter = new NativeEventEmitter(NativeModules.RNEventEmitter)
    } else if (Platform.OS === 'android') {
      this.eventEmitter = DeviceEventEmitter
    }
    this.eventEmitter!.addListener(trippleTapEventName, this.sendLogs)

    AppState.addEventListener('change', this.handleAppStateChange)
  }

  componentWillUnmount() {
    if (Platform.OS === 'ios') {
      NativeModules.RNEventEmitter.stopListening()
    }
    this.eventEmitter!.removeListener(trippleTapEventName, this.sendLogs)
    AppState.removeEventListener('change', this.handleAppStateChange)
  }

  handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      store.dispatch(setUserSessionAction())
    }
  }

  render = () => (
    <LoggerProvider>
      <StoreProvider store={store}>
        <PersistGate loading={<LoadingComponent />} persistor={persistor}>
          <NativeBaseProvider>
            <ThemeProvider>
              <PushProvider>
                <React.Fragment>
                  <AppContainer ref={(ref) => setMainComponentRef(ref)} />
                  <GlobalModalHandler />
                </React.Fragment>
              </PushProvider>
            </ThemeProvider>
          </NativeBaseProvider>
        </PersistGate>
      </StoreProvider>
    </LoggerProvider>
  )
}

export default Application
