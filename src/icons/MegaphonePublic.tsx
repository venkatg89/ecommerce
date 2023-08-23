import React from 'react'
import Svg, { G, Path } from 'react-native-svg'

interface Props {
  color?: string;
  width?: number;
  height?: number;
}
export default (props: Props) => {
  const { color, width, height } = props
  return (
    <Svg width={ width || 20 } height={ height || 20 } viewBox="0 0 720 720" preserveAspectRatio="xMidYMid meet">
      <G fill={ color } stroke="none">
        <Path d="M537 587 l-119 -39 -27 26 c-39 38 -83 50 -125 36 -48 -15 -86 -63 -86 -106 0 -19 -3 -34 -6 -34 -4
        0 -22 14 -41 30 -36 32 -41 34 -61 22 -9 -7 -12 -47 -10 -168 3 -145 5 -159 22 -162 10 -2 32 9 50 27 l32 31
        242 -81 c134 -45 245 -79 248 -77 2 3 3 124 2 270 l-3 265 -118 -40z m-184 -37 c18 -17 16 -18 -57 -43 l-76
        -26 0 23 c0 22 32 59 60 69 21 7 52 -2 73 -23z m277 -196 c0 -201 -1 -215 -17 -210 -10 3 -110 37 -223 74
        l-205 69 -3 69 -3 69 213 72 c117 39 219 72 226 72 9 1 12 -48 12 -215z m-480 6 c0 -61 -3 -69 -30 -95 l-30
         -29 0 124 0 124 30 -29 c27 -26 30 -34 30 -95z"
        />
      </G>
    </Svg>
  )
}
