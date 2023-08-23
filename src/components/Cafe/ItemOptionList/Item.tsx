import React, { memo } from 'react'
import styled from 'styled-components/native'

import RadioButton from 'src/controls/Button/RadioButton'

import { CafeItemOption } from 'src/models/CafeModel/ItemsModel'

interface DisabledProps {
  disabled?: boolean;
}

const Button = styled(RadioButton)`
  padding-vertical: ${({ theme }) => theme.spacing(1.5)};
`

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

const ItemOptionText = styled.Text<DisabledProps>`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme, disabled }) => (disabled ? theme.palette.grey5 : theme.palette.grey1)};
`

const PriceText = styled.Text<DisabledProps>`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme, disabled }) => (disabled ? theme.palette.grey5 : theme.palette.grey2)};
`

interface Props {
  itemOption: CafeItemOption;
  selected: boolean;
  onPress: () => void;
  checkboxStyle: boolean;
}

const CafeItemOptionItem = ({ itemOption, selected, onPress, checkboxStyle }: Props) => (
  <Button
    disabled={ itemOption.outOfStock }
    selected={ selected }
    onPress={ onPress }
    checkboxStyle={ checkboxStyle }
  >
    <Row>
      <ItemOptionText disabled={ itemOption.outOfStock }>{ itemOption.name }</ItemOptionText>
      { itemOption.price && (
        <PriceText disabled={ itemOption.outOfStock }>{ `$${(itemOption.price / 100).toFixed(2)}` }</PriceText>
      ) || undefined }
    </Row>
  </Button>
)

export default memo(CafeItemOptionItem)
