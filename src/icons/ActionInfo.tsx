import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface Props {
  color?: string;
  width?: number;
  height?: number;
}
export default (props: Props) => {
  const { color, width, height } = props
  return (
    <Svg width={ width || 20 } height={ height || 20 } viewBox="0 0 48 48" fill={ color }>
      <Path
        // eslint-disable-next-line max-len
        d="M22.3,39.4V19.1h3.6V39.4ZM24.1,15.2c-.4,0,-.7,-.1,-1,-.2c-.3,-.1,-.6,-.3,-.8,-.5c-.2,-.3,-.4,-.5,-.5,-.8c-.2,-.3,-.2,-.7,-.2,-1c0,-.4,0,-.7,.2,-1c.1,-.3,.3,-.6,.5,-.8c.2,-.3,.5,-.4,.8,-.6c.3,-.1,.6,-.2,1,-.2c.3,0,.7,.1,1,.2c.3,.2,.6,.3,.8,.6c.2,.2,.4,.5,.6,.8c.1,.3,.2,.6,.2,1c0,.3,-.1,.7,-.2,1c-.2,.3,-.4,.5,-.6,.8c-.2,.2,-.5,.4,-.8,.5c-.3,.1,-.7,.2,-1,.2Zm.3,29.3c11.1,0,20.1,-9,20.1,-20.1c0,-11,-9,-20,-20.1,-20c-11,0,-20,9,-20,20c0,11.1,9,20.1,20,20.1Zm0,2.9C11.8,47.4,1.5,37.1,1.5,24.4C1.5,11.8,11.8,1.5,24.4,1.5c12.7,0,23,10.3,23,22.9c0,12.7,-10.3,23,-23,23Z"
      />
    </Svg>
  )
}
