import React from 'react'
import { AccessibilityProps } from 'react-native'
import styled from 'styled-components/native'

import { nav } from 'assets/images'

type SizeType = 'small'

const Button = styled.TouchableOpacity``

const Text = styled.Text``

interface IconProps {
  size?: SizeType
}

const Icon = styled.Image<IconProps>`
  height: ${({ theme, size }) => theme.spacing(size === 'small' ? 3 : 4)};
  width: ${({ theme, size }) => theme.spacing(size === 'small' ? 3 : 4)};
`

interface Props extends AccessibilityProps {
  title?: string
  onPress: () => void
  dots?: boolean
  cog?: boolean
  share?: boolean
  size?: SizeType
}

export default ({
  title,
  onPress,
  dots,
  cog,
  share,
  size,
  accessibilityLabel,
}: Props) => (
  // TODO: accessibility
  <Button
    accessibilityLabel={accessibilityLabel}
    accessibilityRole="button"
    onPress={onPress}
  >
    {title && !dots && <Text>{title}</Text>}
    {dots && !title && <Icon source={nav.topBar.dots} size={size} />}
    {cog && !title && <Icon source={nav.topBar.settings} size={size} />}
    {share && !title && <Icon source={nav.topBar.share} size={size} />}
  </Button>
)
