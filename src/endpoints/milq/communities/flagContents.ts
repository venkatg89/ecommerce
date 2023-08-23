import milqApiRequest from 'src/apis/milq'

interface FlagContents {
  entityId: number,
  entityType: string
}

export const reportContents = (data: FlagContents) => milqApiRequest({
  method: 'POST',
  endpoint: '/api/v0/entities/flagcontent',
  data,
})
