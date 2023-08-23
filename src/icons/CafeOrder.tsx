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
        <Path d="M60 429 l0 -201 39 -39 39 -39 147 0 147 0 39 39 c35 35 39 44 39 90
        l0 51 55 0 c86 0 95 14 95 150 0 161 24 150 -320 150 l-280 0 0 -201z m553
        152 c16 -16 16 -186 0 -202 -6 -6 -32 -14 -57 -16 l-46 -6 0 123 0 123 46 -6
        c25 -2 51 -10 57 -16z"
        />
      </G>
    </Svg>
  )
}
