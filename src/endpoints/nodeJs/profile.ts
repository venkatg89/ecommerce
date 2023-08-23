import nodeJsApiRequest from 'src/apis/nodeJs'
import {
  ReadingStatusListItemUpdate,
  NotInterestedListItemUpdate,
} from 'src/models/ReadingStatusModel'
import { MembershipWalletPassModel } from 'src/models/UserModel/MembershipModel'
import { Ean, BookModel } from 'src/models/BookModel'

export const getNodeJsProfile = (milqUserId?: string) => {
  const endpoint = milqUserId
    ? `/v1/profiles/?milqUserId=${milqUserId}`
    : '/v1/profiles'
  return nodeJsApiRequest({
    method: 'GET',
    endpoint,
  })
}

type ReadingStatusListUpdateWithWorkId = ReadingStatusListItemUpdate & BookModel

export type ReadingStatusListUpdateParams = Record<
  Ean,
  ReadingStatusListUpdateWithWorkId
>

export const updateReadingStatusList = (
  updates: ReadingStatusListUpdateParams,
) =>
  nodeJsApiRequest({
    method: 'POST',
    endpoint: '/v1/profiles/readingStatus',
    data: updates,
  })

export const getNookLocker = () =>
  nodeJsApiRequest({
    method: 'GET',
    endpoint: '/v1/profiles/nook',
  })

/**
 * Marks/Unmarks books as uninteresting (add/remove from Not Interested list)
 * @param {Object} data list of EANs to be updated
 * (falsy values will be removed, truthy values will be created/updated)
 */
export const updateNotInterestedList = (data: NotInterestedListItemUpdate) =>
  nodeJsApiRequest({
    method: 'POST',
    endpoint: '/v1/profiles/notInterested',
    data,
  })

export const updatePrivacy = (data) =>
  nodeJsApiRequest({
    method: 'POST',
    endpoint: '/v1/profiles/privacy',
    data,
  })

export const membershipWalletPass = (data: MembershipWalletPassModel) =>
  nodeJsApiRequest({
    method: 'POST',
    endpoint: '/v1/profiles/membershipWalletPass',
    data,
  })

export const fetchGetAccountNotificationSettings = () =>
  nodeJsApiRequest({
    method: 'GET',
    endpoint: '/v1/profiles/setting/notifications',
  })
