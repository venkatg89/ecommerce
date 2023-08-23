import { ReadingStatus } from 'src/models/ReadingStatusModel'

export default (status?: ReadingStatus): string => {
  switch (status) {
    case undefined: return ''
    case ReadingStatus.TO_BE_READ: return 'To Be Read'
    case ReadingStatus.READING: return 'Reading'
    case ReadingStatus.FINISHED: return 'Read'
    default: return '(unknown)'
  }
}
