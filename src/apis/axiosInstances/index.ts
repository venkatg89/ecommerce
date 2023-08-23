// React Libs
import axios from 'axios'
import { Platform } from 'react-native'
// This is our config, not npm's config
import config from 'config'

const packageJsonVersion = require('../../../package.json').version

const appVersion = `bnapp/${packageJsonVersion}`
const userAgent =
  Platform.OS === 'ios'
    ? `${appVersion} ios/${Platform.Version}`
    : `${appVersion} android/${Platform.Version}`

// -=-=-= ATG =-=-=-

const axiosAtgGatewayCommonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  Accept: 'application/json',
  'Ocp-Apim-Subscription-Key': config.api.atgGateway.key,
  'User-Agent': userAgent,
  withCredentials: true, // sometimes cookies arent sent, enable to always force
}

if (config.api.atgGateway.env !== 'none') {
  axiosAtgGatewayCommonHeaders['atg-env'] = config.api.atgGateway.env
}

const atgGatewayApiVersion = config.api.atgGateway.urlApiVersion
  ? `/${config.api.atgGateway.urlApiVersion}`
  : ''
const atgGatewayApiUrl = config.api.atgGateway.baseUrl + atgGatewayApiVersion
export const axiosAtgGateway = axios.create({
  baseURL: atgGatewayApiUrl,
  headers: { common: axiosAtgGatewayCommonHeaders },
})

// -=-=-= Stores =-=-=-

export const axiosBopis = axios.create({
  baseURL: config.api.bopis.baseUrl,
  headers: {
    common: {
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
    },
  },
})

export const axiosStore = axios.create({
  baseURL: config.api.storeGateway.baseUrl,
})

// -=-=-= Milq (Browsery) =-=-=-

// Axios instance for Milq speficially. Please any common headers/etc.. here.
export const axiosMilq = axios.create({
  baseURL: config.api.milq.baseUrl,
  headers: {
    common: {
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      'x-api-key': config.api.milq.apiKey,
    },
  },
})

// The Milq Production instance does searching for books faster
// and has a more complete set of books. Use it if configured
export const axiosMilqForBookSearch = config.api.milq.searchUrl
  ? axios.create({
      baseURL: config.api.milq.searchUrl,
      headers: {
        common: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
          'x-api-key': config.api.milq.searchKey,
        },
      },
    })
  : axiosMilq

// Any requests from the server gets an ARRAffinity in reply. So - just make a request to '/'
// (even a 404 reply has this cookie set)
export const milqFetchInitialARRAffinity = async () => {
  const reqOptions: RequestOptions = {
    method: 'GET',
    endpoint: '/',
  }
  await axiosMilq(reqOptions)
}

// -=-=-= Node JS =-=-=-

// Axios instance for NodeJs speficially. Please any common headers/etc.. here.
export const axiosNodeJs = axios.create({
  baseURL: config.api.nodeJs.baseUrl,
  headers: {
    common: {
      'Api-Key': config.api.nodeJs.key,
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      'x-bn-app-version': packageJsonVersion,
    },
  },
})

// -=-=-= SpeedEtab (BNCafé) =-=-=-

export const axiosSpeedETab = axios.create({
  baseURL: config.api.speedetab.baseUrl,
  headers: {
    common: {
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
    },
    'SpeedETab-Application-ID': config.api.speedetab.appId,
    'x-speedetab-api-version': config.api.speedetab.speedetabApiVersion,
  },
})

export const axiosSpreedly = axios.create({
  baseURL: config.api.speedetab.spreedlyBaseUrl,
  headers: {
    common: {
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
    },
  },
})

export const axiosSpeedETabPayment = axios.create({
  baseURL: config.api.speedetab.paymentBaseUrl,
  headers: {
    common: {
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
    },
    'SpeedETab-Application-ID': config.api.speedetab.appId,
    'x-speedetab-api-version': config.api.speedetab.speedetabApiVersion,
  },
})

// Bazaarvoice

export const axiosBazaarVoice = axios.create({
  baseURL: config.api.bazaarvoice.baseUrl,
  headers: {
    common: {
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      'X-Bazaarvoice-Api-Version': config.api.bazaarvoice.bazaarvoiceVersion,
    },
  },
})
