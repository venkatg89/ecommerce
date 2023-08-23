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
    <Svg
      width={ width || 20 }
      height={ height || 20 }
      viewBox="0 0 72.000000 72.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      <G transform="translate(0.000000,72.000000) scale(0.100000,-0.100000)" fill={ color } stroke="none">
        <Path d="M439 699 c-43 -25 -79 -84 -79 -128 l0 -31 -165 0 c-140 0 -165 -2
        -165 -15 0 -10 10 -15 30 -15 l30 0 0 -225 0 -225 225 0 225 0 0 97 0 96 59
        91 c82 127 91 148 91 207 0 58 -26 112 -68 144 -41 30 -136 32 -183 4z m151
        -34 c38 -20 60 -63 60 -117 0 -36 -11 -61 -61 -142 -34 -54 -65 -94 -69 -89
        -5 4 -33 48 -64 97 -47 75 -56 97 -56 135 0 51 24 97 62 117 31 18 93 17 128
        -1z m-200 -470 l0 -105 -75 0 -75 0 0 105 0 105 75 0 75 0 0 -105z"
        />
      </G>
    </Svg>
  )
}
