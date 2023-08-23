#!/bin/bash

# For App Center - Apple (mac+iOS)
APPCENTER_SDK_APPLE_FOLDER="AppCenter-SDK-Apple"
APPCENTER_SDK_APPLE_ZIP="AppCenter-SDK-Apple.zip"
APPCENTER_SDK_APPLE_URL="https://github.com/microsoft/appcenter-sdk-apple/releases/download/2.0.1/AppCenter-SDK-Apple-2.0.1.zip"

# For App Center - React Native
APPCENTER_SDK_RN_FOLDER="AppCenterReactNativeShared"
APPCENTER_SDK_RN_ZIP="AppCenterReactNativeShared.zip"
APPCENTER_SDK_RN_URL="https://github.com/microsoft/appcenter-sdk-react-native/releases/download/2.0.0/AppCenter-SDK-ReactNative-iOS-Pod-2.0.0.zip"

downloadSdk () {
  # $1 - is *_FOLDER   $2 - is *_ZIP   $3 - is *_URL
  if [ ! -d "$1" ]
  then
    echo "'$1' missing"
    if [ ! -f "$2" ]
    then
      echo "'$2' folder missing, downloading"
      curl -L "$3" --output "$2"
      echo "Complete, curl exit code: '$?''"
    else
      echo "$2 present"
    fi
    echo "Unzipping '$2'"
    unzip "$2"
  else 
    echo "'$1' folder present" 
  fi
}


# ----------------------------------------------------
echo "Checking 'APPCENTER_SDK_RN'"
downloadSdk "$APPCENTER_SDK_RN_FOLDER"    "$APPCENTER_SDK_RN_ZIP"    "$APPCENTER_SDK_RN_URL"
downloadSdk "$APPCENTER_SDK_APPLE_FOLDER" "$APPCENTER_SDK_APPLE_ZIP" "$APPCENTER_SDK_APPLE_URL"
