export enum RequestStatus {
  FETCHING = 'fetching',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export interface ApiStatus {
  requestStatus: Nullable<RequestStatus>
  dateStated: Nullable<Date>
  dateCompleted: Nullable<Date>
  error: Nullable<String>
}

export type ApiStatusDict = Record<string, ApiStatus>

export const CANCELLED_INSTANCE_STATUS_CODE = -999
