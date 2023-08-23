import nodeJsApiRequest from 'src/apis/nodeJs'
import {
  CollectionBookAdded,
  CollectionCreated,
  HistoryResponseData,
  ReadingStatusUpdate,
} from 'src/models/SocialModel/NotificationModel'
import { CollectionModel } from 'src/models/CollectionModel'
import Logger from 'src/helpers/logger'

const logger = Logger.getInstance()

export const getHistory = (followers: string[]) =>
  nodeJsApiRequest({
    method: 'GET',
    endpoint: `/v1/history?followedUsers=${followers.join(',')}`,
  })

export const normalizeCollectionBookAdded = (item) =>
  ({
    addedBook: item.books[0],
    collection: {
      books: item.collection.books,
      name: item.collection.name,
      public: item.collection.public,
      id: item.collection._id,
      milqUserId: item.collection.milqUserId,
    } as CollectionModel,
    creationDate: item.entered,
    uid: item.milqUserId,
    type: item.__type,
  } as CollectionBookAdded)

export const normalizeCollectionCreated = (item) =>
  ({
    collection: {
      books: item.collection.books,
      name: item.collection.name,
      public: item.collection.public,
      id: item.collection._id,
      milqUserId: item.collection.milqUserId,
    } as CollectionModel,
    creationDate: item.entered,
    uid: item.milqUserId,
    type: item.__type,
  } as CollectionCreated)

export const normalizeReadingStatusUpdate = (item) =>
  ({
    statusUpdates: item.statusUpdates,
    creationDate: item.entered,
    uid: item.milqUserId,
    type: item.__type,
  } as ReadingStatusUpdate)

export const normalizeHistoryResponseData = (data): HistoryResponseData => {
  const empty = { eans: [], posts: [] } as HistoryResponseData
  if (!data) {
    return empty
  }
  const eansSoFar = new Set()
  return data.reduce((result: HistoryResponseData, item, index, array) => {
    switch (item.__type) {
      case 'CollectionBookAdded': {
        try {
          const normalizedItem = normalizeCollectionBookAdded(item)
          result.eans.push(normalizedItem.addedBook)
          result.posts.push(normalizedItem)
        } catch (error) {
          logger.warn(
            `Failed to normalizeCollectionBookAdded: ${error} ${JSON.stringify(
              item,
            )} `,
          )
        }
        return result
      }
      case 'CollectionCreated': {
        try {
          const normalizedItem = normalizeCollectionCreated(item)
          if (Object.keys(normalizedItem.collection).length) {
            result.eans.push(...Object.keys(normalizedItem.collection.books))
            result.posts.push(normalizedItem)
          }
        } catch (error) {
          logger.warn(
            `Failed to normalizeCollectionCreated: ${error} ${JSON.stringify(
              item,
            )} `,
          )
        }
        return result
      }

      case 'ReadingListBookSet': {
        try {
          const normalizedItem = normalizeReadingStatusUpdate(item)
          if (!eansSoFar.has(item.statusUpdates.ean)) {
            result.eans.push(normalizedItem.statusUpdates.ean)
            result.posts.push(normalizedItem)
            eansSoFar.add(item.statusUpdates.ean)
          }
        } catch (error) {
          logger.warn(
            `Failed to normalizeReadingStatusUpdate: ${error} ${JSON.stringify(
              item,
            )} `,
          )
        }
        return result
      }

      default:
        return result
    }
  }, empty)
}
