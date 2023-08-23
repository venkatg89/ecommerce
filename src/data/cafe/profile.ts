import { fetchGetCafeProfile, normalizeCafeProfileResponseDate, fetchUpdateCafeProfile } from 'src/endpoints/speedetab/profile'
import { CafeProfileModel } from 'src/models/CafeModel/ProfileModel'

export const getCafeProfileData = async (): Promise<CafeProfileModel | undefined> => {
    const response = await fetchGetCafeProfile()

    if (response.ok) {
      return normalizeCafeProfileResponseDate(response.data)
    }
    return undefined
  }

export const updateCafeProfileData = async ({ verified, phoneNumber }): Promise<boolean> => {
    const response = await fetchUpdateCafeProfile({ verified, phoneNumber })

    if (response.ok) {
      return true
    }
    return false
  }
