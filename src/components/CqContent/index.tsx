import React, { useState, useEffect, useRef } from 'react'
import { Linking } from 'react-native'
import RNWebView from 'react-native-webview'
import axios from 'axios'
import styled from 'styled-components/native'
import {
  push,
  Routes,
  Params,
  navigate,
  WebRoutes,
} from 'src/helpers/navigationService'
import { CqContentModel } from 'src/models/CqContentModel'
import { View } from 'react-native'
import { urlBrowseHelper } from 'src/endpoints/atgGateway/browse'

const BASE_URL = 'http://www.barnesandnoble.com/'

const Container = styled.ScrollView`
  margin-horizontal: ${({ theme }) => -theme.spacing(2)};
`

interface OwnProps {
  cqContent: CqContentModel
  cssLink?: string
  jsLink?: string
}

type Props = OwnProps

export const getSearchQueryFromUrl = (url) => {
  // replace + with space
  const decodeURL = decodeURI(url.replace(/\+/g, '%20'))
  const startSeparator = decodeURL.split('s/"')
  const splitURLWithSearchTerm = startSeparator[1]
  const endSeparator = splitURLWithSearchTerm
    ? splitURLWithSearchTerm.split('"')
    : undefined

  const searchTermValue = endSeparator ? endSeparator[0] : ''

  return searchTermValue
}

const CqContent = ({ cqContent, jsLink, cssLink }: Props) => {
  const webview = useRef(null)
  const [htmlBody, setHtmlBody] = useState<string>('')
  const [htmlHeight, setHtmlHeight] = useState<number>(0)

  const generateHtmlBody = (content) => `<!DOCTYPE html>
<html>
  <head>
  <link href="https://css.css-bn.com/static/redesign/release/css/bn-responsive.min.css?v8.9.7&setviewtype=full" rel="stylesheet">
  <link href=${cssLink} rel="stylesheet">
  <link href=${jsLink} rel="stylesheet">
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
      body {
        margin: 0;
        padding: 0;
      }
    </style>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    ${cqContent.stylesheet ? cqContent.stylesheet : ''}
  </head>
  <body class="bncom-responsive bnappcq">
    ${content ? content : cqContent.markdown}
  </body>
  <script type="text/javascript">
    // check for new document height
    Promise.all(Array.from(document.images).filter(img => !img.complete).map(img =>
      new Promise(resolve => { img.onload = img.onerror = resolve; }))).then(() => {
        const payload = { height: document.body.scrollHeight };
        window.ReactNativeWebView.postMessage(document.body.scrollHeight);
      });
  </script>
</html>`

  useEffect(() => {
    const callback = async () => {
      let data
      if (cqContent.source) {
        const response = await axios.get(cqContent.source)
        data = response.data
      }
      setHtmlBody(generateHtmlBody(data))
    }
    callback()
  }, [cqContent])
  const onWebViewMessage = (event) => {
    setHtmlHeight(Number(event.nativeEvent.data))
  }

  const onNavigationStateChange = (event) => {
    if (event.url !== BASE_URL) {
      if (webview) {
        /* @ts-ignore */
        webview.current.stopLoading()
      }
      if (event.url.includes('/b/')) {
        push(Routes.HOME__BROWSE, {
          [Params.BROWSE_URL]: urlBrowseHelper(event.url),
        })
      } else if (event.url.includes('/w/')) {
        const product = event.url.split('ean=')[1]
        if (product) {
          push(Routes.PDP__MAIN, { ean: product })
        }
      } else if (
        event.url.includes(WebRoutes.BLOG) ||
        event.url.includes(WebRoutes.BLOG_MOBILE) ||
        event.url.includes(WebRoutes.PRESS)
      ) {
        Linking.openURL(event.url)
      } else if (event.url.includes('/s/')) {
        navigate(Routes.SEARCH__SEARCH, {
          [Params.SEARCH_QUERY]: getSearchQueryFromUrl(event.url),
        })
      } else {
        navigate(Routes.WEBVIEW__WITH_SESSION, {
          [Params.WEB_ROUTE]: event.url,
        })
      }
    }
  }

  const webViewScript = `
  setTimeout(function() {
    window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight);
  }, 500);
  true;
`

  return (
    <Container scrollEnabled>
      <View style={{ height: htmlHeight + 8 }}>
        <RNWebView
          ref={webview}
          automaticallyAdjustContentInsets={false}
          source={{ html: htmlBody, baseUrl: BASE_URL }}
          onMessage={onWebViewMessage}
          onNavigationStateChange={onNavigationStateChange}
          scrollEnabled
          originWhitelist={['*']}
          javaScriptEnabled={true}
          injectedJavaScript={webViewScript}
          useWebKit={true}
          containerStyle={{ marginVertical: 16, resizeMode: 'cover' }}
          contentInset={{ top: -8 }}
          scalesPageToFit={false}
        />
      </View>
    </Container>
  )
}

export default CqContent
