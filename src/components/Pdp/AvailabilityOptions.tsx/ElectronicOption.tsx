import { icons } from 'assets/images'
import React from 'react'
import styled from 'styled-components/native'

const OptionContainer = styled.View`
  flex-direction: row;
  margin-vertical: 8;
`

const Icon = styled.Image`
  width: 24;
  height: 24;
  tint-color: ${({ theme }) => theme.palette.supportingError};
`

const OptionTextsContainer = styled.View`
  margin-horizontal: ${({ theme }) => theme.spacing(1)};
`

const OptionSubHeading = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey2};
`

const ElectronicOption = () => {
  return (
    <OptionContainer>
      <Icon source={icons.xmark} />
      <OptionTextsContainer>
        <OptionSubHeading>
          Digital purchasing is not supported on this app. Books purchased from
          Barnes & Noble or a NOOK device are available to read in the NOOK app.
        </OptionSubHeading>
      </OptionTextsContainer>
    </OptionContainer>
  )
}

export default ElectronicOption
