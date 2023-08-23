import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface Props {
  color?: string;
  width?: number;
  height?: number;
}
const Close = (props: Props) => {
  const { color, width, height } = props
  return (
    <Svg width={ width || 20 } height={ height || 20 } viewBox="0 0 24 24" fill={ color }>
      <Path
        // eslint-disable-next-line max-len
        d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"
      />
    </Svg>
  )
}

export default Close
