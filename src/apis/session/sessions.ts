import { Platform } from 'react-native'

import RNSecureKeyStore, { ACCESSIBLE } from 'react-native-secure-key-store'
import tough, { Cookie } from 'tough-cookie'

import { LoginCredentials } from 'src/models/SessionModel'

/*
  NOTES:
  a) react-native-secure-key-store handles the case of app removal, then re-installation.
      It completelly clears the keychain on the first run on the re-install, hooray!
  b) All Functions return promises.
*/

// Our app can not be used before the screen is unlocked.

const KEYS = {
  MILQ_USER_SESSION: 'MILQ_USER_SESSION',
  NODEJS_USER_SESSION: 'NODEJS_USER_SESSION',
  ATG_USER_SESSION: 'ATG_USER_SESSION',
  SPEEDETAB_USER_SESSION: 'SPEEDETAB_USER_SESSION',
  LOGIN_CREDENTIALS: 'LOGIN_CREDENTIALS',
  ATG_COOKIES: 'ATG_COOKIES',
}
const SECURITY_SETTINGS = {
  accessible: ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
}

interface KeychainAccessor<T> {
  set(value: T | T[]): Promise<void>
  get(): Promise<Nullable<T>>
  clear(): Promise<void>
  getSpecificKeys?: (value: string[]) => Promise<string>
}

const OVERRIDE_COOKIE_OBJ_ARRAY = [
  tough.Cookie.parse('channelType=MobileApp'),
] as Cookie[]

// Need to securely store a single string?
// Then define a new entry in KEYS above, and export an instance of this.
const KeychainStringAccessor = (key: string): KeychainAccessor<string> => ({
  // Sets a string value. Overwrites existing values.
  set: async (value: string) =>
    RNSecureKeyStore.set(key, value, SECURITY_SETTINGS),

  // Gets a string value. If not found, returns null.
  get: async () =>
    RNSecureKeyStore.get(key)
      .then((r) => r || null)
      .catch(() => null),

  // Clear this key out. Exception occur is a value was absent, so can be ignored.
  clear: async () =>
    RNSecureKeyStore.remove(key)
      .then(() => undefined)
      .catch(() => undefined),
})

// ATG User session is just a string
export const AtgUserSession = KeychainStringAccessor(KEYS.ATG_USER_SESSION)

// NodeJs User session is just a string
export const NodeJsSession = KeychainStringAccessor(KEYS.NODEJS_USER_SESSION)

// Speedetab User session is just a string
export const SpeedetabSession = KeychainStringAccessor(
  KEYS.SPEEDETAB_USER_SESSION,
)

// Login Credentials is a slightly complex object, so we can write a custom
// storage object for it
export const LoginCredentialStore: KeychainAccessor<LoginCredentials> = {
  set: async (value: LoginCredentials) => {
    const credentials = JSON.stringify(value)
    RNSecureKeyStore.set(KEYS.LOGIN_CREDENTIALS, credentials, SECURITY_SETTINGS)
  },

  get: async () => {
    try {
      const stringified = (await RNSecureKeyStore.get(
        KEYS.LOGIN_CREDENTIALS,
      )) as string
      const creds = JSON.parse(stringified) as LoginCredentials
      return creds.username && creds.password ? creds : null
    } catch {
      return null
    }
  },

  clear: async () =>
    RNSecureKeyStore.remove(KEYS.LOGIN_CREDENTIALS)
      .then(() => undefined)
      .catch(() => undefined),
}

/*
 * Native apis (CookieSyncManager on Android and NSHTTPCookieStorage for iOS) for cookie storage doesn't
 * seem reliable and sometimes aren't persisted properly. Instead lets manually keep track of cookies
 */
export const AtgCookiesStore: KeychainAccessor<string> = {
  set: async (value: string[]) => {
    const oldCookiesArray = await getCookiesObjArray()
    const oldCookiesTable = buildCookiesTable(oldCookiesArray)

    const newCookiesArray = value
      .map((cookie) => tough.Cookie.parse(cookie))
      .filter(Boolean) as Cookie[]
    const newCookiesTable = buildCookiesTable(newCookiesArray)

    const updatedCookiesTable = { ...oldCookiesTable, ...newCookiesTable }
    const updatedCookiesArray: Cookie[] = Object.values(updatedCookiesTable)

    const updatedCookiesSeralized = updatedCookiesArray
      .map((cookie) => JSON.stringify(cookie.toJSON()))
      .join(String.fromCharCode(127))
    await RNSecureKeyStore.set(
      KEYS.ATG_COOKIES,
      updatedCookiesSeralized,
      SECURITY_SETTINGS,
    )
  },

  get: async () => {
    const cookiesArray = await getCookiesObjArray()
    if (Platform.OS === 'ios') {
      return [...OVERRIDE_COOKIE_OBJ_ARRAY, ...cookiesArray]
        .map((cookie) => cookie.cookieString())
        .join('; ')
    } else {
      return cookiesArray.map((cookie) => cookie.cookieString()).join('; ')
    }
  },

  getSpecificKeys: async (keys: string[]) => {
    const serializedCookies = await RNSecureKeyStore.get(
      KEYS.ATG_COOKIES,
    ).catch(() => null)
    return serializedCookies
      ?.split(String.fromCharCode(127))
      .reduce((list, cookie) => {
        const cookiesObj = tough.Cookie.fromJSON(cookie)
        if (cookiesObj && keys.includes(cookiesObj.key)) {
          return [...list, cookiesObj.cookieString()]
        }
        return list
      }, [] as string[])
      .join('; ')
  },

  // Clear this key out. Exception occur is a value was absent, so can be ignored.
  clear: async () =>
    RNSecureKeyStore.remove(KEYS.ATG_COOKIES)
      .then(() => undefined)
      .catch(() => undefined),
}

// AtgCookiesStore helpers
const getCookiesObjArray = async (): Promise<Cookie[]> => {
  const serializedCookies = await RNSecureKeyStore.get(KEYS.ATG_COOKIES).catch(
    () => null,
  )
  const cookiesArray: Cookie[] =
    serializedCookies
      ?.split(String.fromCharCode(127))
      .map(tough.Cookie.fromJSON)
      .filter(Boolean) || []
  return cookiesArray
}

const buildCookiesTable = (cookiesArray: Cookie[]): Record<string, Cookie> => {
  return cookiesArray.reduce(
    (obj, cookieObj) => ({ ...obj, [cookieObj.key]: cookieObj }),
    {},
  )
}
