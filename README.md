## Barnes & Noble ##

This is the repo for the Barnes & Noble app, meant to integrate the existing functionality of multiple presently published B&N iOS and Android apps.

## VPN Set-Up ##

To access JIRA, Stash (code repo), and ATG (internal) APIs, a VPN connection is needed.

You need the below items - please ask your lead/PM for them as early as possible:
1) FTP credentials - same for all folks - just ask a team member
2) BN credentials - ask you PM to obtain a @bn.com email address and a username eg: `cxzvpo`
3) The "Defender Soft Token" app - search the app store.
4) An email from B&N with a token to import into "Defender Soft Token

[Symantec Endpoint Protection](ftp://ftp.barnesandnoble.com/symantecendpointprotection/AntiVirus/SEP_Mac/)
[Pulse Security](ftp://ftp.barnesandnoble.com/symantecendpointprotection/Pulse)
(use FTP credentials - same for everyone)

- Open Pulse Secure, create a new connection using `myaccess.bn-corp.com/corp/2f` as the server URL.
- Connect using the provided credentials (the 6 letter username, and password) 
- Enter the token "Defender Soft Token" app shows you. If rejected, click 🔁 in the token app, and try to enter a new number.

Once connected, use the same credentials for:
 - JIRA - `http://jira.hq.bn-corp.com/secure/Dashboard.jspa?selectPageId=12301`
 - Confluence - `http://wiki.hq.bn-corp.com/display/PM/BN+Mobile+App`
 - Stash - `http://stash.hq.bn-corp.com/projects/BNAP/repos/bnapprepo/browse?at=refs%2Fheads%2Fdevelop`

## Dev Software ##
Mac
1) Android Studio - https://developer.android.com/studio
2) Xcode 10 - https://itunes.apple.com/ca/app/xcode/id497799835?mt=12
3) React Native Debugger - https://github.com/jhen0409/react-native-debugger/releases
4) Home brew - https://brew.sh/ 
5) Node.js: `brew install node@10`
7) Cocoapods: `sudo gem install cocoapods`
8) Your Preferred editor (ex: VSCode is easy to get going and provides lots of plugins)

Windows
1) Install Android Studio, Node JS 10 (`https://nodejs.org`), React Native debugger.
2) Install Git Bash. Use the git bash shell to run the all commands.  They may be slightly different. You'll be limited to compiling Android only. Sometimes, putting `npx` in from of commands (like `npx react-native ....`) helps.

## Stash account ##
After your stash account is set up, generate your private key (if you don't have one) and add it to your account.
This is much like the set-up progress with GitHub or Bitbuket.

## Code Checkout ##
1) git clone the repo, selecting develop branch: `git clone -b develop ssh://git@stash.hq.bn-corp.com:7999/bnap/bnapprepo.git`
2) install npm packages: `npm ci`
3) set up configuration files: `npm run set-dev` 

Notes:
- Don't use `npm install` unless you add/remove packages. Use `npm ci` instead. This stops changes to `package-lock.json`.

## Running the App ##
There are 2 components: The Metro bunder, and the binary application
1) Start the Metro bunder: `npm start`. This packages the JS files, and shows your JS compilation errors. Wait for `Loading dependency graph, *done*.` to appear.
2) To run on iOS - start you simulator or connect the device. Run: `react-native run-ios`. To see other options/commands - 
3) To run on Android - start your emulator (or connect the device). Run: `react-native run-android`.

Notes:
- If you skip step 1), `react-native run-*` will open a new window with a package bundler. It often fails to do so properly.
- For packages with pure native components, don't forget to run `react-native link`.


## Submitting Code #
1) Base of develop.
2) Please make a new branch with the format "yourname/BMA-123/very-quick-description"
3) Once code is complete, run `npm run lint-fix` to clean up things.
4) To check if code is ready to check in `npm run tsc` and  `npm run lint`. Fix any found issues.
5) Be careful to not include any temporary files or large binaries, unless necessary. Change `.gitignore` if we need to ignore them.
6) Commit your files with message "BMA-123 - your verbal description". Please use correct spacing in "BMA-123 - " so that JIRA picks it up correctly.


## Run Time Environments ##
By default, right after checkout, the dev enviroment is selected
`npm start` or most other npm commands.

If you would like to run (or build for) other environments, please select the correct one:
To set to Dev: `npm run set-dev` (this uses config/dev.json)
To set to Prod: `npm run set-prod` (this uses config/prod.json)

Please run one of these commands *anytime* you modify config/{dev, qa, prod}.json.
This creates `config/generated.json` that is used as the actual configuration by the app.

You can override environment variables used by ./config/*.json by setting them in your own environment. 
*Be* *sure* to run a `npm run set-*` command for these to take effect.

## VSCode setup ##
TODO - still trying to get this to be consistent.
Plugins:
vscode-styled-components


## Release Building ##
*Note* Running in production requires some pre-configured env variables before running `npm run set-prod`. Please see `./config/prod.json` for details.

Android
- Install bundletool
- Run either `npm run set-prod` (for production build), or `npm run set-dev` for a QA/Dev build. Please don't forget this step!
- To Build `npm run release-android`
- Find your APK in `release` folder.
- Ask the NOOK team to sign the build before upload to Google Play

iOS
- For QA Enterprise builds - select `BNAppEnt` and Archive. Then export IOS using the entprise provisioning profile. Upload the build to App Center.
- For App Store / Testflight builds - run `npm run set-prod` (don't forget!!), and select `BNApp` and Archive. Upload the archive build to Itunes connect via Xcode as usual.
- (`BNAppEPreProd` is a old pre-prod build for enterprise. Please ignore it.)


## Links to Project Pages ##

[Stash](http://stash.hq.bn-corp.com/projects/BNAP/repos/bnapprepo) (VCS used by B+N)

[JIRA](http://jira.hq.bn-corp.com/secure/Dashboard.jspa?selectPageId=12301) (Confluence)

[Wiki](hhttp://wiki.hq.bn-corp.com/display/PM/BN+Mobile+App)
