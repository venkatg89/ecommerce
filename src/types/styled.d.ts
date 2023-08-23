import 'styled-components'

import { ThemeModel } from 'src/models/ThemeModel'

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeModel {}
}
