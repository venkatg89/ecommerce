export const storeGraphqlModel = `
  id
  name
  address1
  city
  state
  zip
  phone
  location
  hours
  cafeInd
  holidayHours
`

export type StoreId = string

export interface StoreModel {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  latitude: number;
  longitude: number;
  hours: string;
  hasCafe: boolean;
  upcomingStoreEventId?: string;
  holidayHours: string;
}

export const eventGraphqlModel = `
  edges {
    node {
      id
      name
      description
      eventDate
      eventTime
      eans
      eventGenres {
        description
      }
    }
  }
`

export type EventId = string

export interface EventModel {
  id: EventId;
  name: string;
  description: string;
  date: Date;
  eans: string[];
  types: string[];
  storeId: string;
}
