import { UserPostItem, myPostType } from 'src/models/Communities/MyPostModel'

export const createMyPostList = (list, type: myPostType) => list.map(item => ({
  type,
  creationDate: item.creationDate,
  referenceId: item.id,
  question: item.question,
  community: item.community,
} as UserPostItem
))
