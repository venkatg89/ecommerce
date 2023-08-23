import React from 'react'
import styled from 'styled-components/native'

import Button from 'src/controls/Button'
import CtaButton from './CtaButton'

import { sectionLayoutStyles } from 'src/styles/stylesheets'

interface ContainerProps {
  last?: boolean
}

const Container = styled.View`
  align-self: stretch;
  overflow: visible;
`

const Header = styled.View`
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const Title = styled.Text`
  ${({ theme }) => theme.typography.heading3};
  color: ${({ theme }) => theme.palette.grey1};
`

const ButtonContainer = styled.View`
  flex: 1;
`

const Content = styled.View`
  overflow: visible;
`

interface Props extends ContainerProps {
  style?: any
  title?: string
  children?: React.ReactNode
  ctaButton?: React.ReactNode
  onPress?: () => void
}

export default ({
  style,
  title,
  children,
  ctaButton,
  last,
  onPress,
}: Props) => (
  <Container style={[style, !last && sectionLayoutStyles.marginBottom]}>
    {(title || ctaButton) && (
      <Header>
        {title && (
          <ButtonContainer>
            {onPress ? (
              <Button onPress={onPress} icon>
                <Title accessibilityRole="header" numberOfLines={1}>
                  {title}
                </Title>
              </Button>
            ) : (
              <Title accessibilityRole="header" numberOfLines={1}>
                {title}
              </Title>
            )}
          </ButtonContainer>
        )}
        {ctaButton}
      </Header>
    )}
    <Content>{children}</Content>
  </Container>
)

export { CtaButton }
