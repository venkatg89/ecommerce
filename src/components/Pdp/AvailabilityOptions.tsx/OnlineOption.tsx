import { icons } from 'assets/images'
import React from 'react'
import RadioButton from 'src/controls/Button/RadioButton'
import { DELIVERY_OPTIONS } from 'src/screens/pdp/Pdp'
import styled from 'styled-components/native'

const OptionContainer = styled.View`
  flex: 1;
  flex-direction: row;
  margin-vertical: ${({ theme }) => theme.spacing(2)};
`

const Icon = styled.Image`
  width: 24;
  height: 24;
  tint-color: ${({ theme, inStock }) =>
    inStock ? theme.palette.primaryGreen : theme.palette.supportingError};
`

const OptionTextsContainer = styled.View`
  flex: 1;
  margin-horizontal: ${({ theme }) => theme.spacing(1)};
`

const OptionRow = styled.View`
  justify-content: flex-end;
`

const OptionHeading = styled.Text`
  flex: 1;
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey1};
`

const OptionSubHeading = styled.Text`
  flex: 1;
  ${({ theme }) => theme.typography.caption}
  color: ${({ theme }) => theme.palette.grey3};
`

interface OwnProps {
  inStock: boolean
  subheading?: string
  isSelected: boolean
  onSelectOption: (type: DELIVERY_OPTIONS) => {}
}

const OnlineOption = ({
  inStock,
  subheading,
  isSelected,
  onSelectOption,
}: OwnProps) => {
  return (
    <OptionContainer>
      <Icon
        source={inStock ? icons.checkmark : icons.xmark}
        inStock={inStock}
      />
      <OptionTextsContainer>
        <OptionHeading>
          {inStock ? 'In Stock Online' : 'Not Available Online'}{' '}
        </OptionHeading>
        <OptionSubHeading>{subheading}</OptionSubHeading>
      </OptionTextsContainer>
      <OptionRow>
        <RadioButton
          selected={inStock && isSelected}
          disabled={!inStock}
          onPress={() => {
            onSelectOption(DELIVERY_OPTIONS.ONLINE)
          }}
        />
      </OptionRow>
    </OptionContainer>
  )
}

export default OnlineOption
