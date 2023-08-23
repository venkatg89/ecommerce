import React from 'react'
import styled from 'styled-components/native'

const Container = styled.View`
`

const Header = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const Body = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey3};
`

interface Props {
  style?: any;
  header: string;
  body?: string | React.ReactNode;
}

export default ({ style, header, body }: Props) => (
  <Container style={ style }>
    <Header>
      { header }
    </Header>
    {
      body && (
        <Body>
          { body }
        </Body>
      )
    }
  </Container>
)
