#!/bin/sh

PREV_FOLDER=`pwd`
DATE=`date +%Y.%m.%d_%H.%M.%S`
BUILD_FOLDER=/tmp/bnapp.android.build
VERSION=`awk '/version/{gsub(/("|",)/,"",$2);print $2};' package.json`

cd android

rm -rf $BUILD_FOLDER
mkdir $BUILD_FOLDER

./gradlew bundleRelease
rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi

bundletool  build-apks --mode=universal --bundle=app/build/outputs/bundle/release/app.aab --output $BUILD_FOLDER/bnapp.apks
rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi

cd $BUILD_FOLDER
unzip bnapp.apks
rc=$?; if [[ $rc != 0 ]]; then exit $rc; fi

cd $PREV_FOLDER
mv $BUILD_FOLDER/universal.apk release/bnapp.$VERSION._.$DATE.apk
