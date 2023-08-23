import moment from 'moment'

const FORMAT_DDMMYYYY = 'DDMMYYYY'

export const isSameDay = (date1: Date, date2: Date) => {
  const formattedDate1 = parseFloat(moment(date1).format(FORMAT_DDMMYYYY))
  const formattedDate2 = parseFloat(moment(date2).format(FORMAT_DDMMYYYY))

  if (typeof formattedDate1 !== 'number' || typeof formattedDate1 !== 'number') { return false }
  return formattedDate1 === formattedDate2
}

const FORMAT_MONTH_YEAR = 'MYYYY'

export const isSameMonth = (date1: Date, date2: Date) => {
  const formattedDate1 = parseFloat(moment(date1).format(FORMAT_MONTH_YEAR))
  const formattedDate2 = parseFloat(moment(date2).format(FORMAT_MONTH_YEAR))

  if (typeof formattedDate1 !== 'number' || typeof formattedDate1 !== 'number') { return false }
  return formattedDate1 === formattedDate2
}

const FORMAT_WEEK_YEAR = 'wYYYY'

export const isSameWeek = (date1: Date, date2: Date) => {
  const formattedDate1 = parseFloat(moment(date1).format(FORMAT_WEEK_YEAR))
  const formattedDate2 = parseFloat(moment(date2).format(FORMAT_WEEK_YEAR))

  if (typeof formattedDate1 !== 'number' || typeof formattedDate1 !== 'number') { return false }
  return formattedDate1 === formattedDate2
}

// export const isTodayOrFutureDate = (date: Date) => {
//   const FORMAT = 'DDYYYY'
//   const formattedDate = parseFloat(moment(date).format(FORMAT))
//   const formattedTodayDate = parseFloat(moment(new Date(Date.now())).format(FORMAT))
//
//   if (typeof formattedDate !== 'number' || typeof formattedTodayDate !== 'number') { return false }
//   return (formattedDate >= formattedTodayDate)
// }

const FORMAT_YEAR = 'YYYY'
const FORMAT_DAY_OF_YEAR = 'DDD'

export const betweenTodayAnd1Year = (date: Date) => {
  const todayDate = new Date(Date.now())

  const formattedYear = parseFloat(moment(date).format(FORMAT_YEAR))
  const formattedTodayYear = parseFloat(moment(todayDate).format(FORMAT_YEAR))

  if (typeof formattedYear !== 'number' || typeof formattedTodayYear !== 'number') { return false }
  // otherwise assume subsequential dates are valid
  if (formattedYear === formattedTodayYear) {
    const formattedDay = parseFloat(moment(date).format(FORMAT_DAY_OF_YEAR))
    const formattedTodayDay = parseFloat(moment(todayDate).format(FORMAT_DAY_OF_YEAR))
    return (formattedDay >= formattedTodayDay)
  } else if (formattedYear === formattedTodayYear+1) { // eslint-disable-line
    const formattedDay = parseFloat(moment(date).format(FORMAT_DAY_OF_YEAR))
    const formattedTodayDay = parseFloat(moment(todayDate).format(FORMAT_DAY_OF_YEAR))
    return (((365 - formattedTodayDay) + formattedDay) <= 365)
  }
  return false
}
