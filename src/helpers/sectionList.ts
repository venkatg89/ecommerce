import { SectionListData } from 'react-native'
import moment from 'moment'

import { betweenTodayAnd1Year } from 'src/helpers/dateHelpers'

const dateToMonthValue = (date: Date): number => parseFloat(moment(date).format('M'))
const monthValueToMonthString = (month: string): string => moment(month, 'M').format('MMMM')

/*
 *  sectionDate = {
 *    title: MONTH_STRING,
 *    data: LIST_DATA,
 *  }
 */
export function formatListWithDateToMonthSectionsData<T extends {date: Date}>(listArray: Array<T>):
SectionListData<T>[] {
  const listObjectByMonth: {[key: string]: T[]} = {}
  const sectionsData: SectionListData<T>[] = []

  // for every event, assign it to the corresponding month if it is an upcoming event
  for (let i = 0; i < listArray.length; ++i) {
    const listItem: T = listArray[i]

    if (!listItem.date || !betweenTodayAnd1Year(listItem.date)) { continue }

    const month = dateToMonthValue(listItem.date).toString()

    if (listObjectByMonth[month]) {
      listObjectByMonth[month].push(listItem)
    } else {
      listObjectByMonth[month] = [listItem]
    }
  }

  // sort each month's events by its day and time
  Object.keys(listObjectByMonth).forEach((key) => {
    listObjectByMonth[key].sort((a, b) => (a.date).getTime() - (b.date).getTime())
  })

  // now sort by month starting by today
  const currentMonth = dateToMonthValue(new Date(Date.now()))
  for (let i = currentMonth; i < currentMonth + 12; ++i) {
    const month = (i % 12 + 1).toString()

    if (listObjectByMonth[month]) {
      // generate model
      sectionsData.push({
        title: monthValueToMonthString(month),
        data: listObjectByMonth[month],
      })
    }
  }

  const currentMonthString = monthValueToMonthString(currentMonth.toString())
  const currentMonthSection = sectionsData.find(item => item.title === currentMonthString)
  let indexCurrentMonth
  if (currentMonthSection) {
    indexCurrentMonth = sectionsData.indexOf(currentMonthSection)
  } else {
    indexCurrentMonth = 0
  }

  const finalSectionsData = sectionsData.slice(indexCurrentMonth, sectionsData.length).concat(sectionsData.slice(0, indexCurrentMonth))

  return finalSectionsData
}
