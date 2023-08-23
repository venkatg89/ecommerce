export interface NodeProfileModel {
  cafeEnabled: boolean
}

// LEGACY
export interface PrivacyModel {
  profile: {
    public: boolean
  }
  readingStatus: {
    read: boolean
    reading: boolean
    wtr: boolean
  }
}

enum PrivacyKey {
  profile,
  wtr,
  reading,
  read
}

export type PrivacyParams = Record<PrivacyKey, boolean>
