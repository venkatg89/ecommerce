import React from 'react'
import styled from 'styled-components/native'

import _Button from 'src/controls/Button'

import { ListItemActionProps } from './ListItem'

const Button = styled(_Button)`
  padding: 8px;
`

export default ({ onPress }: ListItemActionProps) => (
  <Button onPress={ () => onPress && onPress() } variant="contained" size="small">
    Submit
  </Button>
)
