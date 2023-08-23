import RNFS from 'react-native-fs'
import { Platform } from 'react-native'
import { captureRef, releaseCapture } from 'react-native-view-shot'
import Mailer from 'react-native-mail'
// import pako from 'pako'
// import { Base64 } from 'js-base64'

import Logger from 'src/helpers/logger'
// import { store } from 'src/redux'

import config from 'config'

const CLEANUP_AFTER = 4000 // ms
// const MAX_LINE_LENGTH = 48 // chars
const MAX_LOG_SIZE = 80000

const logger = Logger.getInstance()

const preamble = 'Please enter JIRA ticket: BMA-\n'

let mainComponentRef: any
export const setMainComponentRef = (ref: any) => { mainComponentRef = ref }

export const sendMailLogs = async () => {
  try {
    let imagePath = ''
    let attachmentImagePath = ''
    const presentDate = new Date()
    const longDateString = presentDate.toLocaleTimeString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', timeZoneName: 'short' })
    try {
      if (mainComponentRef) {
        imagePath = await captureRef(mainComponentRef, { format: 'jpg', quality: 0.93 })
        if (Platform.OS === 'android') {
          // The attachment is in the jailed path, so we shold copy it out
          imagePath = imagePath.replace('file://', '')
          attachmentImagePath = `${RNFS.ExternalCachesDirectoryPath}/bnappScrShot-${presentDate.getTime()}.jpg`
          await RNFS.copyFile(imagePath, attachmentImagePath)
        } else {
          // iOS - the Mailer is local to the app. No need to make a copy.
          attachmentImagePath = imagePath
        }
      }
    } catch (e) {
      logger.error(`Unable to take screenshot, exception: ${e}`)
    }

    let logs = await logger.getLogs()

    if (logs.length > MAX_LOG_SIZE) {
      logs = `\n\n--------------------\n\n${logs.substr(logs.length - MAX_LOG_SIZE, MAX_LOG_SIZE)}`
    }

    /*
    Too big to email the state as part of the body.

    const reduxStateAsJson = JSON.stringify(store.getState())
    const reduxGzipped = pako.deflate(reduxStateAsJson)
    const reduxGzippedBase64 = Base64.encode(reduxGzipped)
    const reduxGzippedBase64Lines: string [] = []
    for (let i = 0; i < Math.ceil(reduxGzippedBase64.length / MAX_LINE_LENGTH); i++) {
      reduxGzippedBase64Lines.push(reduxGzippedBase64.slice(i * MAX_LINE_LENGTH, (i + 1) * MAX_LINE_LENGTH))
    }
    const reduxGzippedBase64ForEmail = reduxGzippedBase64Lines.join('\n')
    */

    Mailer.mail({
      subject: `BNApp - Report ${longDateString}`,
      recipients: config.support.emails,
      body: `${preamble}\n${logs}\n\n------`,
      isHTML: false,
      attachment: attachmentImagePath ? {
        path: attachmentImagePath, // The absolute path of the file from which to read data.
        type: 'jpg', // Mime Type: jpg, png, doc, ppt, html, pdf, csv
        name: `bnapp.${longDateString}.jpg`, // Optional: Custom filename for attachment
      } : null,
    }, (error, event) => {
      // In case of error
      if (error) {
        logger.error(`Unable to send logs, error: ${error}`)
      }
    })

    setTimeout(async () => {
      try {
        if (attachmentImagePath !== imagePath) {
          await RNFS.unlink(attachmentImagePath)
        }
        if (imagePath) {
          await releaseCapture(imagePath)
        }
      } catch {
        // This is cleanup, so no big deal. Just
        logger.warn('Unable to clean up screenshot after creating email log.')
      }
    }, CLEANUP_AFTER)
  } catch (e) {
    logger.error(`Unable to send logs, exception: ${e}`)
  }
}
