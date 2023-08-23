import storeGatewayApiRequest from 'src/apis/storeGateway'

import { eventGraphqlModel } from 'src/models/StoreModel'
import { normalizeStoreEvent } from 'src/helpers/api/store/normalizeStore'


export const NUMBER_EVENTS_REQUESTED = 20

const buildEventsQueryObject = (storeId: string, skip: number) => {
  const eventsObject = `
    store(id: ${storeId}) {
      id
      events(first: ${NUMBER_EVENTS_REQUESTED}, after: "${/* this uses pagination by pages */Math.ceil(skip / NUMBER_EVENTS_REQUESTED)}") {
        ${eventGraphqlModel}
      }
    }
  `
  return `query { ${eventsObject} }`
}

interface GetStoreEventsParams {
  storeId: string;
  skip?: number;
}

export const storeGetStoreEvents = ({ storeId, skip = 0 }: GetStoreEventsParams) => storeGatewayApiRequest({
  method: 'POST',
  endpoint: '/store-event/graphql',
  data: {
    query: buildEventsQueryObject(storeId, skip),
  },
})

export const normalizeStoreEventsFromResponseData = (data: any) => {
  const eventList = data.data.store.events.edges

  const eventIds = eventList.map(event => event.node.id)
  const events = eventList.reduce((object, event) => ({
    ...(object || {}),
    [event.node.id]: {
      ...normalizeStoreEvent(event.node, data.data.store.id),
    },
  }), {})

  return {
    eventIds,
    events,
  }
}
