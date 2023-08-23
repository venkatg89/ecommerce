import moment from 'moment'

import { StoreModel, EventModel } from 'src/models/StoreModel'

export const normalizeStoreDetails = (store): StoreModel => {
  return ({
  id: store.id.toString(),
  name: store.name,
  address: store.address1,
  city: store.city,
  state: store.state,
  zip: store.zip,
  phone: store.phone,
  latitude: store.location[1],
  longitude: store.location[0],
  hours: store.hours,
  hasCafe: (store.cafeInd === 'true'),
  upcomingStoreEventId: store.events && store.events.edges[0] && store.events.edges[0].node.id || undefined,
  holidayHours:store.holidayHours,
})}

export const normalizeStoreEvent = (event, storeId: string): EventModel => ({
  id: event.id,
  name: event.name,
  description: event.description,
  date: moment(`${event.eventDate} ${event.eventTime}`, 'YYYY-MM-DD hh:mm').toDate(),
  eans: event.eans,
  types: event.eventGenres.map(genre => genre.description),
  storeId,
})
