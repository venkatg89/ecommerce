import React from 'react'
import styled from 'styled-components/native'
import { Dimensions } from 'react-native'

const { width } = Dimensions.get('screen')

const DescriptionTextStyle = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  max-width: ${width * 0.95}px;
  text-align: center;
  line-height: 20px;
`

const DescriptionText = ({ children }) => {
  return <DescriptionTextStyle>{children}</DescriptionTextStyle>
}

export default DescriptionText
