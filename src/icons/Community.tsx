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
        <Path d="M52 667 c-21 -22 -22 -33 -22 -188 0 -160 1 -166 23 -187 14 -13 36
        -22 55 -22 l32 0 0 -90 c0 -49 3 -90 8 -90 4 0 33 40 64 88 48 72 58 82 58 60
        0 -49 21 -58 130 -58 l99 0 48 -77 48 -78 3 78 3 77 29 0 c54 0 60 17 60 164
        0 153 -6 166 -78 166 l-42 0 0 68 c0 59 -3 72 -23 90 -22 21 -31 22 -248 22
        -223 0 -226 0 -247 -23z m584 -201 c16 -12 20 -29 22 -114 3 -91 2 -102 -17
        -121 -12 -12 -32 -21 -46 -21 -22 0 -25 -4 -25 -37 l0 -38 -25 38 -26 37 -89
        0 c-77 0 -93 3 -110 20 -11 11 -20 24 -20 30 0 6 44 10 112 10 101 0 114 2
        135 22 20 19 23 31 23 105 0 80 1 83 23 83 13 0 32 -6 43 -14z"
        />
      </G>
    </Svg>
  )
}
