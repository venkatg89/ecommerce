import moment from 'moment'

export const toDayMonthCommaYear = (date): string => {
  if (!date) {
    return ''
  }
  return moment(date).format('MMMM D, YYYY')
}

export const toTodayTomorrowTimeOrDate = (date): string => {
  if (!date) {
    return ''
  }
  return moment(date).calendar(undefined, {
    lastDay: '[Yesterday at] h:mm a.',
    sameDay: '[Today at] h:mm a.',
    nextDay: '[Tomorrow at] h:mm a.',
    lastWeek: '[last] dddd [at] h:mm a.',
    nextWeek: 'dddd [at] h:mm a.',
    sameElse: 'MMMM Do YYYY [at] hh:mma',
  })
}

export const toWeekdayDayMonthPipeTime = (date): string => {
  if (!date) {
    return ''
  }
  return moment(date).format('dddd MMMM Do | hh:mma')
}

export const toWeekdayCommaDayMonthYearAtTime = (date): string => {
  if (!date) {
    return ''
  }
  return moment(date).format('dddd, MMMM Do YYYY [at] hh:mma')
}

export const monthDayYearAtTime = (date): string => {
  if (!date) {
    return ''
  }
  return moment(date).format('MMMM Do, YYYY [at] hh:mma')
}

export const toWeekdayCommaDayMonthCommaTime = (date): string => {
  if (!date) {
    return ''
  }
  return moment(date).format('dddd MMMM Do | hh:mma')
}

export const toWeekdayCommaDayMonth = (date): string => {
  if (!date) {
    return ''
  }
  return moment(date).format('dddd, MMMM Do')
}

export const toDayCommaMonthDay = (date): string => {
  if (!date) {
    return ''
  }
  return moment(date).format('dddd, MMMM DD')
}

export const toDay = (date): string => {
  if (!date) {
    return ''
  }
  return moment(date).format('D')
}

export const toWeekday = (date): string => {
  if (!date) {
    return ''
  }
  return moment(date).format('dddd')
}

export const toMonth = (date): string => {
  if (!date) {
    return ''
  }
  return moment(date).format('MMMM')
}

export const toDayMonth = (timestamp: number) => {
  const date = new Date(timestamp)
  return moment(date).format('D MMMM')
}

export const toMonthDay = (date): string => {
  if (!date) {
    return ''
  }
  return moment(date).format('MMMM D, h:mm')
}

export const toMonthDayYear = (date): string => {
  if (!date) {
    return ''
  }
  return moment(date).format('MMMM D, YYYY')
}

export const toShortMonthDayYear = (date): string => {
  if (!date) {
    return ''
  }
  return moment(date).format('MMM D, YYYY')
}
