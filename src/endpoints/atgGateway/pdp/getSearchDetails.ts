import atgApiRequest from 'src/apis/atgGateway'

export const getSearchDetails = (queryTerm: string) =>
  atgApiRequest({
    method: 'POST',
    endpoint: '/search/getSearchDetails',
    params: {
      queryTerm: queryTerm,
    },
  })

export const normalizeSalesRank = (data): string => {
  try {
    const salesRank =
      data.response.searchDetails.primaryMainContent[1].records[0].attributes
        .salesRank

    return salesRank
  } catch (e) {
    return ''
  }
}
