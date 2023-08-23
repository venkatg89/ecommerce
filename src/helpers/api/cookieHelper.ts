import CookieManager from '@react-native-cookies/cookies'

// https://stackoverflow.com/questions/48857740
const RCTNetworking = require('react-native/Libraries/Network/RCTNetworking')

import { AtgCookiesStore } from 'src/apis/session/sessions'

// Undocumented RN functionality
// but we need direct access to RN's CookieJar.
export const clearCookies = async () => new Promise((resolve, reject) => {
  RCTNetworking.clearCookies(async () => {
    await Promise.all([
      CookieManager.clearAll(),
      AtgCookiesStore.clear(),
    ])
    resolve()
  })
})
