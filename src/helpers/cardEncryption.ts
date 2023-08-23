import axios from 'axios'
import Logger from 'src/helpers/logger'
import { CHASE_KEYS, CHASE_ENCRYPTION } from 'src/constants/shop'

const logger = Logger.getInstance()

export const chaseEncryption = async () => {
  try {
    const keyResponse = await axios.get(CHASE_KEYS)
    const encResponse = await axios.get(CHASE_ENCRYPTION)

    const chaseBody = keyResponse.data + encResponse.data
    function parseRemote() {
      var func = new Function( // eslint-disable-line
        `${chaseBody}; return {ProtectPANandCVV, PIE, ValidatePANChecksum}`,
      )
      return func()
    }
    return parseRemote()
  } catch (e) {
    logger.warn(`chaseEncryption caught ${e || '(null)'}`)
    return null
  }
}
