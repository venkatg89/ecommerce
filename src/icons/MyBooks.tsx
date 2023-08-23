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
        <Path d="M270 360 l0 -270 60 0 60 0 0 270 0 270 -60 0 -60 0 0 -270z" />
        <Path d="M126 573 c-34 -120 -126 -462 -126 -471 0 -8 22 -12 63 -12 l64 0 62
        228 c34 125 61 230 61 234 0 4 -19 12 -42 18 -24 6 -51 13 -60 16 -10 3 -18
        -2 -22 -13z"
        />
        <Path d="M570 330 l0 -240 60 0 60 0 0 240 0 240 -60 0 -60 0 0 -240z" />
        <Path d="M420 270 l0 -180 60 0 60 0 0 180 0 180 -60 0 -60 0 0 -180z" />
      </G>
    </Svg>
  )
}
