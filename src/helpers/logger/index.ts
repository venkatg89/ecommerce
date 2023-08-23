import RNFS from 'react-native-fs'
import Info from 'react-native-device-info'
import { NativeModules, Platform } from 'react-native'
import sha256 from 'sha256'
import BnLogger from 'react-native-bn-logger'

export enum LogLevel {
  info = 'INFO',
  warn = 'WARNING',
  error = 'ERROR'
}

export interface LogEntry {
  level: LogLevel
  str: string
  date: Date
}

const LOGGER_FOLDER = 'log'
const LOGGER_FOLDER_LOCATION = RNFS.DocumentDirectoryPath
const LOGGER_FILENAME_PREFIX = 'log-'

const FLUSH_DELAY_BEFORE_READ = 400

// Hashing the device name for privacy (sha256, first 8 letters + salt)
const devHashSalt = 'WRVo7qVdcey'
const hashOfDeviceName = async () => {
  const deviceName: string = await Info.getDeviceName()
  return sha256(deviceName + devHashSalt).substr(0, 8)
}
const getDeviceInfo = async () => {
  const locale = Platform.select({
    ios: NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0],
    android: NativeModules.I18nManager.localeIdentifier,
  })!
  let str = `App: '${Info.getApplicationName()}' version '${Info.getVersion()}, bundle ID: '${Info.getBundleId()}' '\n`
  str += `Platform: '${Info.getDeviceId()}' ${Info.isEmulator() ? '(on emu/sim) ' : ''}`
  str += `running ${Platform.OS} ${Info.getSystemVersion()} `
  str += Info.getApiLevel() as unknown !== 'not available' ? `(API ver: '${Info.getApiLevel()}')\n` : '\n'
  str += `Locale: '${locale}', device name hash: '${await hashOfDeviceName()}'\n`
  return str
}

class Logger {
  filename: string = ''

  readyToWrite: boolean = false

  logQueue:Array<string> = [] as string[]

  static _instance: Nullable<Logger> = null

  constructor() {
    this._prepareLogger() // no 'await', any log message will be queu'ed.
  }

  async log(entry: LogEntry) {
    // TODO - log rotation check here

    const outputString = Logger._createOutputString(entry)
    if (__DEV__) {
      // We need to output to console when in dev
      // eslint-disable-next-line no-console
    }
    if (this.readyToWrite) {
      return Logger._output(outputString)
    }
    this.logQueue.push(outputString)
    return true
  }

  info(message: string, logToConsole: boolean = true) {
    /* TODO - console.logs are here temporarily, until we have a way to display logs
      in app & React Debugger
    */
    // eslint-disable-next-line
    logToConsole && __DEV__ &&  console.log(message)
    return this.log({
      level: LogLevel.info,
      str: message,
      date: new Date(),
    })
  }

  warn(message: string) {
    // eslint-disable-next-line
    __DEV__ && console.warn(message)

    return this.log(<LogEntry> {
      level: LogLevel.warn,
      str: message,
      date: new Date(),
    })
  }

  error(message: string) {
    // eslint-disable-next-line
    __DEV__ && console.warn(`-=ERROR=-: ${message}`) // keep warn, as console.error brings up a bit red dialog
    return this.log(<LogEntry> {
      level: LogLevel.error,
      str: message,
      date: new Date(),
    })
  }

  async _prepareLogger() {
    const folderLoc = `${LOGGER_FOLDER_LOCATION}/${LOGGER_FOLDER}`
    await RNFS.mkdir(folderLoc, { NSURLIsExcludedFromBackupKey: true })
    this.filename = `${folderLoc}/${LOGGER_FILENAME_PREFIX}log.txt`
    BnLogger.start(this.filename)
    const line = '\n\n------------------------------------\n\n'
    const firstMessage = `${line}New app start ${Date()}\n${await getDeviceInfo()}`
    // eslint-disable-next-line
    __DEV__ && console.log(firstMessage, `log file: ${this.filename}`)
    BnLogger.write(firstMessage)
    this.readyToWrite = true
    this._flushQueue()
  }

  static _createOutputString(entry: LogEntry) {
    return `${entry.date.toISOString()} - ${entry.level} - ${entry.str}`
  }

  _flushQueue() {
    if (this.logQueue.length < 1) {return}
    const outputString = this.logQueue.join('\n')
    BnLogger.write(outputString)
    this.logQueue = []
  }

  async getLogs(): Promise<string> {
    this._flushQueue()
    BnLogger.flush()
    return new Promise((resolve, reject) => {
      setTimeout(() => RNFS.readFile(this.filename)
        .then(result => resolve(result))
        .catch(exception => reject(exception)),
      FLUSH_DELAY_BEFORE_READ)
    })
  }

  static _output(message: string) {
    BnLogger.write(`${message}\n`)
  }

  static getInstance():Logger {
    if (!Logger._instance) {
      Logger._instance = new Logger()
    }
    return Logger._instance
  }
}


export default Logger
