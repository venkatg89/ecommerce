import React from 'react'
import styled from 'styled-components/native'

const Container = styled.View``

const Empty = styled.View`
  height: 100%;
  overflow: hidden;
`

interface Props {
  condition: boolean
  renderContent
}

class Buffering extends React.Component<Props> {
  render() {
    const { condition, renderContent } = this.props
    return (
      <Container>
        { condition ? renderContent() : <Empty /> }
      </Container>
    )
  }
}

export default Buffering
