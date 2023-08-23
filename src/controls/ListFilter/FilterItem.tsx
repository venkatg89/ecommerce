import React from 'react'
import styled from 'styled-components/native'
import DeviceInfo from 'react-native-device-info'
import { CONTENT_HORIZONTAL_PADDING, useResponsiveDimensions } from 'src/constants/layout'

interface TextProps {
  selected?: boolean
}

interface ContainerProps extends TextProps {
  onPress: Function
  first?: boolean
  last?: boolean
}

const Container = styled.TouchableOpacity<ContainerProps>`
  height: ${({ theme }) => theme.spacing(4)};
  padding-horizontal: ${({ theme }) => `${theme.spacing(2)}px`};
  border-width: 1;
  border-color: #c2cbd1;
  border-radius: ${({ theme }) => theme.spacing(2)};
  margin-right: ${({ theme }) => theme.spacing(1)}px;
  justify-content: center;
  align-items: center;
  background-color: ${({ selected, theme }) => (selected ? '#c2cbd1' : theme.palette.white)};

  ${({ first, theme, currentWidth }) => first && (DeviceInfo.isTablet()
    ? `margin-left: ${CONTENT_HORIZONTAL_PADDING(currentWidth)}px;`
    : `margin-left: ${theme.spacing(2)}px;`
  )}
  ${({ last, theme }) => last && `margin-right: ${theme.spacing(2)}px;`}
`

const Text = styled.Text<TextProps>`
  color: ${({ selected, theme }) => (selected ? theme.palette.grey1 : theme.palette.grey2)};
  ${({ theme }) => theme.typography.subTitle2}
`

interface Props extends ContainerProps {
  title: string;
  onPress: () => void;
}

export default ({ title, selected, first, last, onPress }: Props) => {
  const { width } = useResponsiveDimensions()
  return (
    <Container
      currentWidth={ width }
      accessibilityLabel={ title }
      accessibilityRole="button"
      accessibilityStates={ selected ? ['selected'] : [] }
      selected={ selected }
      first={ first }
      last={ last }
      onPress={ onPress }
    >
      <Text selected={ selected }>
        { title }
      </Text>
    </Container>
  )
}
