import React from 'react'
import { Platform, ActivityIndicator, Linking } from 'react-native'
import RNWebView from 'react-native-webview'
import styled from 'styled-components/native'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import MembershipHome from 'src/components/Home/MembershipHome'
import { WebRoutes } from 'src/constants/routes'

import config from 'config'
import Header from 'src/controls/navigation/Header'

import { LoginCredentialStore } from 'src/apis/session/sessions'

import {
  checkNavThenProps,
  Params,
  push,
  Routes,
  navigate,
} from 'src/helpers/navigationService'
import Logger from 'src/helpers/logger'
import { urlBrowseHelper } from 'src/endpoints/atgGateway/browse'
import { getSearchQueryFromUrl } from 'src/components/CqContent'

// We don't want the Apple App Store to reject our app 😢
const PARAMS_TO_PREVENT_DIGITAL_GOOD_PURCHASES_ON_IOS =
  'source=iOSND&browsery=iOS'

const TRANSFERRING_MESSAGE = 'Transferring you to www.bn.com'

/* This login method is piggy-backed on:
    http://wiki.hq.bn-corp.com/display/atg/External+Sites+ATG+Login
     ...and this form simulates skava's login/logout
    The exact behaviour is simulated to be as in mpreprod.barnesandnoble.com
*/

const headHTML =
  '<meta name="viewport" content="width=device-width, initial-scale=1">'
const transferringHTML =
  '<center style="font-family:sans-serif;position:absolute;top:50%;width:100%;color:#555">__TRANSFERRING_MESSAGE__</center>'

const transferringHTML1 = transferringHTML.replace(
  '__TRANSFERRING_MESSAGE__',
  `${TRANSFERRING_MESSAGE}`,
)
const transferringHTML2 = transferringHTML.replace(
  '__TRANSFERRING_MESSAGE__',
  `${TRANSFERRING_MESSAGE}`,
)
const transferringHTML3 = transferringHTML.replace(
  '__TRANSFERRING_MESSAGE__',
  `${TRANSFERRING_MESSAGE}`,
)

const blankHTML = '<html><body></body></html>'

const LOG_OUT_URL = `${config.api.atgGateway.webBaseUrl}/skavastream/xact/v5/barnesandnoble/logout?campaignId=230`
const LOGIN_URL = `${config.api.atgGateway.webBaseUrl}/xhr/handler.jsp?_DARGS=/account/login-frame-ra.jsp`
const BLANK_HTML = 'about:blank'

// We don't do this via pure Ajax because we'd like to avoid CORS
// Since we can create any webpage we wish and control it, we can
// accomplish this POST request via a form sumbission.

// Still TBD

// Note the values in this template, e.g. __WEB_BASE_URL__ , __EMAIL__
// these are replaced by generateLoginPageHtml() below
const loginPageTemplate = `<form id="loginForm"
  style="display: none"
  action="__WEB_BASE_URL__/xhr/handler.jsp?_DARGS=/account/login-frame-ra.jsp"
  method="post" novalidate="novalidate">
  <input name="_dyncharset" value="UTF-8">
  <input name="_dynSessConf" value="-461505150994362966">

  <input name="/atg/userprofiling/ProfileFormHandler.value.login"        value="__EMAIL__" type="text">
  <input name="_D:/atg/userprofiling/ProfileFormHandler.value.login"     value=" ">

  <input name="/atg/userprofiling/ProfileFormHandler.value.password"     value="__PASSWORD__" type="password">
  <input name="_D:/atg/userprofiling/ProfileFormHandler.value.password"  value=" ">

  <input name="/atg/userprofiling/ProfileFormHandler.value.autoLogin"    value="true" type="checkbox" checked="">
  <input name="_D:/atg/userprofiling/ProfileFormHandler.value.autoLogin" value=" ">

  <input name="amplifiHandler"                                           value="/atg/userprofiling/ProfileFormHandler.login">
  <input name="getData" value="profile">

  <input name="/atg/userprofiling/ProfileFormHandler.eGiftLogin"         value="">
  <input name="_D:/atg/userprofiling/ProfileFormHandler.eGiftLogin"      value=" ">

  <input name="/atg/userprofiling/ProfileFormHandler.showmembershipIDLink"    value="" >
  <input name="_D:/atg/userprofiling/ProfileFormHandler.showmembershipIDLink"  value=" ">

  <input name="_DARGS" value="/account/login-frame-ra.jsp">

  <input id="login_button" type="submit" value="Click To Sign In">
</form>
__TRANSFERRING_HTML__
`

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`
const Message = styled.Text`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const WebViewWrapper = styled.View`
  flex: 1;
`

interface OwnProps {
  onPressBack?: () => void
  url?: string
  closeModal?: () => void
}

interface State {
  readyForWebView: boolean
  finishedLoading: boolean
  finishedRemoving: boolean
  showMembership: boolean
}

type WebViewState =
  | 'InitialLoad'
  | 'NextWillBeLogin'
  | 'NextWillBeWebpage'
  | 'Completed'

type Props = OwnProps & NavigationInjectedProps

class UserSessionWebview extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    const onPressBack = navigation.getParam('onPressBack')

    return {
      title: 'Membership',
      header: (headerProps) => (
        <Header onPressBack={onPressBack} headerProps={headerProps} />
      ),
    }
  }

  state = {
    readyForWebView: false,
    finishedLoading: false,
    finishedRemoving: false,
    showMembership: false,
  }

  // Using member state, as a re-render is not required for state changes - it's all in the RNWebView
  webViewState: WebViewState = 'InitialLoad'

  loginPageHtml: string = ''

  webViewRef: Nullable<RNWebView> = null

  componentDidMount() {
    this.generateLoginPageHtml()
  }

  generateLoginPageHtml = async () => {
    const creds = await LoginCredentialStore.get()
    if (creds) {
      this.loginPageHtml = loginPageTemplate
        .replace(/\n/g, ' ') // remove the new lines from HTML, please
        .replace('__EMAIL__', creds!.username.replace('"', '&quot;'))
        .replace('__PASSWORD__', creds!.password.replace('"', '&quot;'))
        .replace('__WEB_BASE_URL__', config.api.atgGateway.webBaseUrl)
    }
    this.setState({ readyForWebView: true })
  }

  render = () => {
    const { readyForWebView, finishedLoading, finishedRemoving } = this.state
    const { closeModal, url, navigation } = this.props
    // Go to the part of
    const path = url ? url : checkNavThenProps(Params.WEB_ROUTE, this.props)
    let gotoUrl =
      path && path.startsWith('http')
        ? path
        : config.api.atgGateway.webBaseUrl + path

    if (Platform.OS === 'ios') {
      if (gotoUrl.indexOf('?') < 0) {
        gotoUrl += '?'
      } else {
        gotoUrl += '&'
      }
      gotoUrl += PARAMS_TO_PREVENT_DIGITAL_GOOD_PURCHASES_ON_IOS
    }

    return readyForWebView ? (
      <>
        {!finishedLoading && (
          <LoadingContainer>
            {!finishedRemoving && <Message>{TRANSFERRING_MESSAGE}</Message>}
            <ActivityIndicator
              size={!finishedRemoving ? 'small' : 'large'}
              color="#dddddd"
            />
          </LoadingContainer>
        )}

        <WebViewWrapper
          style={{
            display: finishedLoading ? 'flex' : 'none',
          }}
        >
          <RNWebView
            androidHardwareAccelerationDisabled
            source={{
              html: blankHTML,
            }}
            style={{
              flex: 1,
            }}
            ref={(ref) => {
              this.webViewRef = ref
            }}
            onShouldStartLoadWithRequest={(event) => {
              navigation.setParams({ [Params.WEBVIEW_TITLE]: event.title })
              if (event.url.includes('/b/')) {
                push(Routes.HOME__BROWSE, {
                  [Params.BROWSE_URL]: urlBrowseHelper(event.url),
                })
                closeModal && closeModal()
                return false
              }

              if (event.url.includes('/w/')) {
                const start = event.url.search('ean=')
                push(Routes.PDP__MAIN, {
                  [Params.EAN]: event.url.substr(start + 4),
                })
                closeModal && closeModal()
                return false
              }
              if (event.url.includes('/s/')) {
                navigate(Routes.SEARCH__SEARCH, {
                  [Params.SEARCH_QUERY]: getSearchQueryFromUrl(event.url),
                })
                closeModal && closeModal()
                return false
              }
              if (
                event.url === WebRoutes.MEMBERSHIP_LEARN_MORE ||
                event.url === WebRoutes.MEMBERSHIP_LEARN_MORE_MOBILE
              ) {
                this.setState({ showMembership: true })

                return false
              }

              if (
                event.url.includes(WebRoutes.BLOG) ||
                event.url.includes(WebRoutes.BLOG_MOBILE) ||
                event.url.includes(WebRoutes.PRESS)
              ) {
                Linking.openURL(event.url)
                closeModal && closeModal()
                navigation.goBack()
                return false
              }

              return true
            }}
            onLoadStart={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent
              if (
                nativeEvent.url !== LOG_OUT_URL &&
                nativeEvent.url !== LOGIN_URL &&
                nativeEvent.url !== BLANK_HTML
              ) {
                this.setState({ finishedLoading: false })
              }
            }}
            onLoadEnd={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent
              if (
                nativeEvent.url !== LOG_OUT_URL &&
                nativeEvent.url !== LOGIN_URL &&
                nativeEvent.url !== BLANK_HTML
              ) {
                this.setState({ finishedLoading: true })
              }
            }}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent
              Logger.getInstance().warn(`WebView error: ', ${nativeEvent}`)
            }}
            onLoad={() => {
              switch (this.webViewState) {
                case 'InitialLoad': {
                  this.webViewRef!.injectJavaScript(
                    `document.head.innerHTML='${headHTML}'; document.body.innerHTML = '${transferringHTML1}'; true`,
                  )
                  // We should logout, as the previous web view may have been for a different user of BNApp.
                  // We also need a bn.com page to login (referrer is checked by login form jsp handler, returns 500 is form is local),
                  // so this page is as good as any other.
                  this.webViewRef!.injectJavaScript(
                    `window.location = '${LOG_OUT_URL}'; true`,
                  )
                  // Do we have a login page to POST before showing the page, or not?
                  this.webViewState = this.loginPageHtml
                    ? 'NextWillBeLogin'
                    : 'NextWillBeWebpage'
                  break
                }
                case 'NextWillBeLogin': {
                  this.webViewRef!.injectJavaScript(
                    ` document.head.innerHTML='${headHTML}';
                    document.body.innerHTML = '${this.loginPageHtml}'.replace('__TRANSFERRING_HTML__', '${transferringHTML2}'); true`,
                  )
                  this.webViewRef!.injectJavaScript(
                    'document.getElementById("login_button").click(); true',
                  )
                  this.webViewState = 'NextWillBeWebpage'
                  break
                }
                case 'NextWillBeWebpage': {
                  this.webViewRef!.injectJavaScript(
                    `document.head.innerHTML='${headHTML}'; document.body.innerHTML = '${transferringHTML3}'; true`,
                  )
                  this.webViewRef!.injectJavaScript(
                    `window.setTimeout(() => window.location="${gotoUrl}",  20);
                     true`,
                  )

                  Logger.getInstance().info(
                    `Webview WithUserSession - set-up done - navigating to ${gotoUrl}`,
                  )
                  this.webViewState = 'Completed'
                  break
                }
                case 'Completed': {
                  this.webViewRef!.injectJavaScript(
                    `document.getElementById("header").style.display = "none" ;
                     document.getElementById("footer").style.display = "none";
                    true;`,
                  )
                  this.setState({ finishedRemoving: true })
                  break
                }
                default: {
                  break
                }
              }
            }}
          />
        </WebViewWrapper>
        {this.state.showMembership && (
          <MembershipHome
            openModal={true}
            handleMembershipModal={() => {
              this.setState({
                showMembership: !this.state.showMembership,
              })
            }}
          />
        )}
      </>
    ) : (
      <React.Fragment />
    )
  }
}

export default withNavigation(UserSessionWebview)

/*
  for further dev work, if needed.

  onNavigationStateChange={
    newState => console.log(newState)
  }
*/
