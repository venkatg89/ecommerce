import storeGatewayApiRequest from 'src/apis/storeGateway'

import { StoreModel, EventId, EventModel, storeGraphqlModel, eventGraphqlModel } from 'src/models/StoreModel'
import { normalizeStoreDetails, normalizeStoreEvent } from 'src/helpers/api/store/normalizeStore'

// since alias names can't be numbers
const STORE_ALIAS_PREFIX = 'store'
const makeAliasKey = (storeId: string) => `${STORE_ALIAS_PREFIX}${storeId}`

/*
 * Since we the api doesn't support querying an array, build our own query with aliases
 */
const buildStoresQueryObject = (storeIds: string[]) => {
  const storesObject = storeIds.map(storeId => (`
    ${makeAliasKey(storeId)}: store(id: ${storeId}) {
      ${storeGraphqlModel}
      events(first: 1) {
        ${eventGraphqlModel}
      }
    }
  `)).join(' ')
  return `query { ${storesObject} }`
}

interface GetStoresDetailsParams {
  storeIds: string[];
}

export const storeGetStoresDetails = ({ storeIds }: GetStoresDetailsParams) => storeGatewayApiRequest({
  method: 'POST',
  endpoint: '/store-event/graphql',
  data: {
    query: buildStoresQueryObject(storeIds),
  },
})

interface GetStoreDetailsParams {
  storeId: string;
}

export const storeGetStoreDetails = ({ storeId }: GetStoreDetailsParams) => storeGatewayApiRequest({
  method: 'POST',
  endpoint: '/store-event/graphql',
  data: {
    query: buildStoresQueryObject([storeId]),
  },
})

export const normalizeStoresDetailsFromResponseData = (data: any): Record<string, StoreModel> => {
  const stores = Object.values(data.data)
  // @ts-ignore
  return stores.reduce((object, store) => {
    if (store) {
      // @ts-ignore
      object[store.id] = { // eslint-disable-line
        ...normalizeStoreDetails(store),
      }
    }
    return object
  }, {})
}

export const normalizeGetStoreDetailsResponseData = (data: any) => {
  const dataValues = Object.values(data.data)
  const store: any = dataValues[0]
  if (!store) { return {} }

  const events: Record<EventId, EventModel> = {}
  if (Array.isArray(store.events.edges)) {
    store.events.edges.forEach((_event) => {
      const event = _event.node
      events[event.id] = { ...normalizeStoreEvent(event, store.id) }
    })
  }

  return {
    stores: {
      // @ts-ignore
      [store.id]: {
        ...normalizeStoreDetails(store),
      },
    },
    events,
    // @ts-ignore
    storeId: store.id,
  }
}
