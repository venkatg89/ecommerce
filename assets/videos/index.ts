import DeviceInfo from 'react-native-device-info'

/* eslint-disable global-require */

const VIDEOS = {
  introVideo: DeviceInfo.isTablet() ? require('./intro-video-tablet.mp4') : require('./intro-video-phone.mp4'),
}

export default VIDEOS
