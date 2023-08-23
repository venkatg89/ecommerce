import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'
import Bullet from './Bullet'

interface Props {
  step: number
  total: number
}

const Glyph = styled(View)`
  margin-bottom: 10px;
  margin-top: 20px;
  flex-direction: row;
  height: 20px;
  justify-content: center;
  width: 100%;
`

const PageControl = (props: Props) => {
  const { step, total } = props
  return (
    <Glyph>
      { [...Array(total)].map((item, index) => (
        // The key is unique
        // eslint-disable-next-line react/no-array-index-key
        <Bullet key={ `bullet-${index}` } selected={ step === index + 1 } />
      )) }
    </Glyph>
  )
}

export default PageControl
