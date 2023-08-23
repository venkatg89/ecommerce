// Disable autolinking for packages that don't have support for it
module.exports = {
    dependencies: {
      'react-native-bn-logger': {
        platforms: {
            android: null,
            ios: null,
        },
      },
    },
};