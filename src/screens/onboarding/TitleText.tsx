import React from 'react'
import styled from 'styled-components/native'

const TitleTextStyle = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  padding-bottom: ${({ theme }) => theme.spacing(1)};
  margin-top: ${({ theme }) => theme.spacing(1)};
`

const TitleText = ({ children }) => {
  return <TitleTextStyle>{children}</TitleTextStyle>
}

export default TitleText
