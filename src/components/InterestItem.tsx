import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import RadioButton from 'src/controls/Button/RadioButton'
import Button from 'src/controls/Button'

interface TextBorderProps {
  selected: boolean
  themeColor?: HexColor
}

const TextWrapper = styled.View`
  flex-direction: row;
`

const TextBorder = styled.View<TextBorderProps>`
  border-bottom-width: 2;
  border-bottom-color: ${({ selected, theme, themeColor }) => (!selected ? theme.palette.disabledGrey : themeColor)};
`

const ButtonText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey3};
  text-transform: uppercase;
`


interface Props {
  interestId: string
  name: string
  onPress(id:string):void
  selected: boolean;
  themeColor?: HexColor
  isRadioButton?: boolean
}

const InterestItem = ({ name, selected, themeColor, isRadioButton, onPress, interestId }: Props) => {
  const onPressHandler = useCallback(() => {
    onPress(interestId)
  }, [onPress, interestId])

  const Container = isRadioButton ? RadioButton : Button

  return (
    <Container
      accessibilityState={ {selected} }
      onPress={ onPressHandler }
      selected={ selected }
      checkboxStyle
      icon
    >
      <TextWrapper>
        <TextBorder themeColor={ themeColor } selected={ selected }>
          <ButtonText>
            {name}
          </ButtonText>
        </TextBorder>
      </TextWrapper>
    </Container>
  )
}

export default InterestItem
