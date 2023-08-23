import { icons } from 'assets/images'
import React from 'react'
import _Button from 'src/controls/Button'
import RadioButton from 'src/controls/Button/RadioButton'
import { DELIVERY_OPTIONS } from 'src/screens/pdp/Pdp'
import styled from 'styled-components/native'

const OptionContainer = styled.View`
  flex: 1;
`

const BodyContainer = styled.View`
  flex: 1;
  flex-direction: row;
  margin-vertical: ${({ theme }) => theme.spacing(2)};
`

const Icon = styled.Image`
  width: 24;
  height: 24;
  ${({ theme, inStock, applyTint }) =>
    applyTint &&
    `tint-color: ${
      inStock ? theme.palette.primaryGreen : theme.palette.supportingError
    }}`};
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

const BoldText = styled(OptionHeading)`
  font-weight: bold;
`

const OptionSubHeading = styled.Text`
  flex: 1;
  ${({ theme }) => theme.typography.caption}
  color: ${({ theme }) => theme.palette.grey3};
`

const ChangeStoreButton = styled(_Button)`
  margin-left: ${({ theme }) => theme.spacing(4)};
`

interface OwnProps {
  isEmpty: boolean
  inStock: boolean
  subheading?: string
  storeName: string
  isSelected: boolean
  onPressChangeStore: () => {}
  onSelectOption: (DELIVERY_OPTIONS) => {}
}

const BopisOption = ({
  isEmpty,
  inStock,
  subheading,
  storeName,
  onPressChangeStore,
  onSelectOption,
  isSelected,
}: OwnProps) => {
  const getIcon = () => {
    let icon = inStock ? icons.checkmark : icons.xmark
    if (isEmpty) {
      icon = inStock ? icons.bopisIcon : icons.xmark
    }
    return icon
  }

  const getHeading = () =>
    isEmpty
      ? 'Buy Online, Pick Up in Store'
      : inStock
      ? 'Pick up at '
      : 'Not in stock at '

  const getButtonText = () => (isEmpty ? 'SELECT STORE' : 'CHANGE STORE')

  return (
    <OptionContainer>
      <BodyContainer>
        <Icon
          source={getIcon()}
          inStock={inStock}
          applyTint={(isEmpty && !inStock) || !isEmpty}
        />

        <OptionTextsContainer>
          <OptionHeading>
            {getHeading()}
            <BoldText>{storeName}</BoldText>
          </OptionHeading>
          <OptionSubHeading>{subheading}</OptionSubHeading>
        </OptionTextsContainer>
        <OptionRow>
          <RadioButton
            selected={inStock && isSelected}
            disabled={!inStock}
            onPress={() => {
              onSelectOption(DELIVERY_OPTIONS.BOPIS)
            }}
          />
        </OptionRow>
      </BodyContainer>
      <ChangeStoreButton linkGreen={true} onPress={onPressChangeStore}>
        {getButtonText()}
      </ChangeStoreButton>
    </OptionContainer>
  )
}

export default BopisOption
