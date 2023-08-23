import moment from 'moment'

export const parseDate = (
  dateString: string | undefined,
  outputFormat: string,
  inputFormat = 'YYYYMMDD',
) => {
  if (moment(dateString, inputFormat, true).isValid()) {
    return moment(dateString, outputFormat).toDate()
  } else {
    return new Date()
  }
}
