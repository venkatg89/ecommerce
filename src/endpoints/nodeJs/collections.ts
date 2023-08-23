import nodeJsApiRequest from 'src/apis/nodeJs'
import { Ean, BooksList } from 'src/models/BookModel'
import {
  CollectionId,
  CollectionEditModel,
  CollectionModel,
  CollectionBookModel,
} from 'src/models/CollectionModel'

import { normalizeBook } from 'src/helpers/api/milq/normalizeBookResult'

export const getCollections = (milqUserId?: string) => {
  const endpoint = milqUserId
    ? `/v1/collections?milqUserId=${milqUserId}`
    : '/v1/collections'
  return nodeJsApiRequest({
    method: 'GET',
    endpoint,
  })
}

export const createCollection = (name: string) =>
  nodeJsApiRequest({
    method: 'PUT',
    endpoint: '/v1/collections',
    data: { name },
  })

export const deleteCollection = (collectionId: CollectionId) =>
  nodeJsApiRequest({
    method: 'DELETE',
    endpoint: `/v1/collections/${collectionId}`,
  })

export const updateCollection = (
  collectionId: CollectionId,
  updates: CollectionEditModel,
) =>
  nodeJsApiRequest({
    method: 'POST',
    endpoint: `/v1/collections/${collectionId}`,
    data: updates,
  })

const normalizeCollectionBooks = (
  data: any,
): Record<Ean, CollectionBookModel> => {
  const result: Record<Ean, CollectionBookModel> = {}
  Object.keys(data).forEach((ean) => {
    const item = data[ean]
    result[ean] = {
      ean: item.ean,
      added: new Date(item.added),
    }
  })
  return result
}

export const normalizeSingleCollectionResponse = (
  reply: any,
): CollectionModel => ({
  id: reply._id,
  milqUserId: reply.milqUserId,
  name: reply.name,
  description: reply.description,
  books: normalizeCollectionBooks(reply.books),
  public: reply.public,
  createdDate: new Date(reply.created),
  changedDate: new Date(reply.changed),
})

interface NormalizeCollection {
  collections: CollectionModel[]
  books: BooksList
}

export const normalizeCollectionListReponse = (
  reply: any[],
): NormalizeCollection => {
  const collections = reply.map((e) => normalizeSingleCollectionResponse(e))
  const allBooks: BooksList = reply.reduce(
    (result, list) => ({ ...result, ...list.books }),
    {},
  )
  const books = Object.values(allBooks)
    .map(normalizeBook)
    .filter((book) => !Object.values(book).includes(undefined))
    .reduce((result, book) => ({ ...result, [book.ean]: book }), {})
  return { collections, books }
}
