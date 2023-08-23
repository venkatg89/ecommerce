import React from 'react'
import { View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import styled from 'styled-components/native'

interface Props {
  selected: boolean
}

const Glyph = styled(View)`
  align-items: center;
  justify-content: center;
  margin: 5px;
`

const Bullet = (props: Props) => {
  const { selected } = props
  const fillColor = selected ? 'skyblue' : 'white'
  return (
    <Glyph>
      <Svg height="10" width="10">
        <Circle cx="5" cy="5" r="4" stroke="black" fill={ fillColor } />
      </Svg>
    </Glyph>
  )
}

export default Bullet
