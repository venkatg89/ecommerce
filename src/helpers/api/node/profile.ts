import { NodeProfileModel } from 'src/models/UserModel/NodeProfileModel'
import { Ean, NookListItem, BookModel } from 'src/models/BookModel'

export const normalizeNookLocker = (data) => {
  const books: Record<Ean, BookModel> = {}
  let list: NookListItem[] = []
  const { syncDate } = data
  Object.keys(data.books).forEach((ean) => {
    books[ean] = data.books[ean].bookModel
    list.push({
      type: data.books[ean].type,
      title: books[ean].name,
      author: books[ean].authors,
      addedDate: data.books[ean].addedDate,
      changeDate: data.books[ean].changeDate,
      ean,
      reading: data.books[ean].status,
      workId: data.books[ean].bookModel.workId,
    })
  })
  // default sort by date added
  list = list.sort(
    (itemA, itemB) =>
      new Date(itemB.changeDate).getTime() -
      new Date(itemA.changeDate).getTime(),
  )
  return {
    books,
    list,
    syncDate,
  }
}

export const normalizeNodeJsProfileReply = (reply: any): NodeProfileModel => ({
  cafeEnabled: reply.cafeEnabled,
})
