import React from 'react'
import styled from 'styled-components/native'

import CtaButton from './CtaButton'

import { sectionLayoutStyles } from 'src/styles/stylesheets'

interface ContainerProps {
  last?: boolean;
}

const Container = styled.View`
  align-self: stretch;
  overflow: visible;
`

const Header = styled.View`
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const Title = styled.Text`
  flex: 1;
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
`

const Content = styled.View`
  overflow: visible;
`

interface Props extends ContainerProps {
  style?: any;
  title?: string;
  children?: React.ReactNode;
  ctaButton?: React.ReactNode;
}

export default ({ style, title, children, ctaButton, last }: Props) => (
  <Container style={ [style, (!last && sectionLayoutStyles.marginBottom)] }>
    {
      (title || ctaButton) && (
        <Header>
          {
            title && (
              <Title accessibilityRole="header" numberOfLines={ 1 }>
                { title }
              </Title>
            )
          }
          { ctaButton }
        </Header>
      )
    }
    <Content>
      { children }
    </Content>
  </Container>
)

export { CtaButton }
