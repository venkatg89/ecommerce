import nodeJsApiRequest from 'src/apis/nodeJs'

interface SetFavoriteStoresParams {
  add?: string[]
  remove?: string[]
}

export const nodeJsSetFavoriteStore = ({
  add,
  remove,
}: SetFavoriteStoresParams) =>
  nodeJsApiRequest({
    method: 'POST',
    endpoint: '/v1/profiles/favoriteStores',
    data: {
      add,
      delete: remove,
    },
  })

export const normalizeFavoriteStoreResponseData = (data: any) => ({
  storeIds: data,
})
