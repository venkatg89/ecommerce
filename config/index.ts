const generated = require('./generated.json')

export default {
  configName: generated.name as string,
  api: {
    atgGateway: {
      baseUrl: generated.ATG_GATEWAY_BASE_URL as string,
      urlApiVersion: generated.ATG_GATEWAY_URL_API_VERSION as string,
      key: generated.ATG_GATEWAY_SUBSCRIPTION_KEY as string,
      clientId: generated.ATG_GATEWAY_CLIENT_ID as string,
      env: generated.ATG_GATEWAY_ENV as string,
      webBaseUrl: generated.ATG_WEB_BASE_URL as string,
      prodImageUrl: generated.ATG_GATEWAY_PROD_IMAGE_URL as string,
      sessionExpiryInMinutes: Number(generated.ATG_SESSION_EXPIRY_MINUTES),
      staleSessionExpiryInMinutes: Number(
        generated.ATG_STALE_SESSION_EXPIRY_MINUTES,
      ),
    },
    nook: {
      deepLinking: generated.NOOK_DEEP_LINKING_URL as string,
    },
    milq: {
      baseUrl: generated.MILQ_BASE_URL as string,
      apiKey: generated.MILQ_API_KEY as string,
      searchUrl: generated.MILQ_SEARCH_URL as string,
      searchKey: generated.MILQ_SEARCH_KEY as string,
      avatarUrl: generated.MILQ_AVATAR_URL as string,
    },
    nodeJs: {
      // TODO REMOVEMILQ Revert to previous config when node is setup to run remotely
      baseUrl: generated.BNAPP_NODE_JS_BASE_URL as string,
      key: generated.BNAPP_NODE_JS_API_KEY as string,
    },
    storeGateway: {
      baseUrl: generated.STORE_GATEWAY_BASE_URL as string,
    },
    bopis: {
      // When need to change the url (or any others), please see dev.json and README.
      baseUrl: generated.BOPIS_BASE_URL as string,
      searchBaseUrl: generated.BOPIS_SEARCH_BASE_URL as string,
    },
    speedetab: {
      baseUrl: generated.SPEEDETAB_BASE_URL as string,
      appId: generated.SPEEDETAB_APPLICATION_ID as string,
      merchantId: generated.SPEEDETAB_BN_MERCHANT_ID as string,
      paymentBaseUrl: generated.SPEEDETAB_PAYMENT_BASE_URL as string,
      speedetabApiVersion: generated.SPEEDETAB_API_VERSION as string,
      spreedlyBaseUrl: generated.SPEEDETAB_SPREEDLY_BASE_URL as string,
      nutritionPdf: generated.SPEEDETAB_NUTRITION_PDF as string,
      termsSalePdf: generated.SPEEDETAB_TERMS_SALE_PDF as string,
    },
    bazaarvoice: {
      baseUrl: generated.BAZAARVOICE_BASE_URL as string,
      bazaarvoiceVersion: generated.BAZAARVOICE_API_VERSION as string,
      bazaarvoiceApiKey: generated.BAZAARVOICE_API_KEY as string,
      bazaarvoiceLimit: generated.LIMIT as string,
    },
  },
  support: {
    emails: (generated.SUPPORT_EMAILS as string).split(','),
  },
  redux: {
    clearStateOnReset: generated.CLEAR_STATE_ON_STARTUP as boolean,
  },
  appReview: {
    appleAppId: generated.APPLE_APP_ID as string,
    googlePackageName: generated.GOOGLE_PACKAGE_NAME as string,
    fallbackUrl: generated.APP_REVIEW_FALLBACK_URL as string,
    feedbackEmail: generated.APP_REVIEW_FEEDBACK_EMAIL as string,
  },
}
