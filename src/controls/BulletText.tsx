import React from 'react'
import styled from 'styled-components/native'

const Container = styled.View`
  flex-direction: row;
  align-items: flex-start;
  flex: 1;
`

const BulletContainer = styled.View`
  width: 10;
`

const TextContainer = styled.View`
  flex: 1;
`

interface FontProps {
  color?: string;
  fontSize?: number;
}

const Bullet = styled.Text<FontProps>`
  color: ${({ theme, color }) => (color || theme.font.default)};
  ${({ fontSize }) => (fontSize ? `font-size: ${fontSize};` : '')}
`

const Text = styled.Text<FontProps>`
  color: ${({ theme, color }) => (color || theme.font.default)};
  ${({ fontSize }) => (fontSize ? `font-size: ${fontSize};` : '')}
`

interface Props extends FontProps {
  style?: any;
  text: string | React.ReactNode;
}

export default ({ style, text, color, fontSize }: Props) => (
  <Container style={ style }>
    <BulletContainer>
      <Bullet color={ color } fontSize={ fontSize }>{ '\u2022' }</Bullet>
    </BulletContainer>
    <TextContainer>
      <Text color={ color } fontSize={ fontSize }>
        { text }
      </Text>
    </TextContainer>
  </Container>
)
