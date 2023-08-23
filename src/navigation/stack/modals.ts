import { createStackNavigator, TransitionPresets } from 'react-navigation-stack'

import RootSwitch from 'src/navigation/switch/root'
import BarcodeScannerScreen from 'src/screens/search/BarCodeScanner'

import Routes from 'src/constants/routes'

// this is where we put the modals
export default createStackNavigator(
  {
    [Routes.ROOT]: {
      screen: RootSwitch,
      navigationOptions: {
        header: () => null,
      },
      path: 'root',
    },
    [Routes.SEARCH__BARCODE_SCAN]: {
      screen: BarcodeScannerScreen,
      navigationOptions: {
        ...TransitionPresets.ModalPresentationIOS,
        cardOverlayEnabled: true,
      },
    },
  },
  {
    mode: 'modal',
  },
)
