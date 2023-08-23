export interface LoginCredentials {
  username: string,
  password: string,
}

export interface SessionModel {
  // If the session is logged in and ongoing
  active: boolean
  // The hash of username/password used for this session + a salt
  hash: Nullable<String>
  // When this session was obtained
  obtained: Nullable<Date>
}

export const SessionModelDefaults: SessionModel = {
  active: false,
  hash: null,
  obtained: null,
}
